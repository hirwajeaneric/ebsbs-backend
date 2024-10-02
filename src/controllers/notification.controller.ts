import { Request, Response, NextFunction } from "express";
import asyncWrapper from '../middlewares/AsyncWrapper';
import prisma from "../db/client";
import { sendEmail } from "../utils/notification.utils";

// Create notification based on type and condition
export const createNotification = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const {
        title,
        content,
        sendingUserId,
        sendingUserName,
        sendingHospitalId,
        sendingHospitalName,
        sendingBloodBankId,
        sendingBloodBankName,
        receivingHospitalId,
        receivingBloodBankId,
        type,
        status
    } = req.body;

    let notification;

    // Condition: Hospital Application
    if (type === "Hospital Application") {
        const bloodBank = await prisma.bloodBank.findFirst(); // Fetch existing blood bank

        notification = await prisma.notification.create({
            data: {
                title: "Hospital Application",
                content: `${sendingHospitalName} has applied for access to the system.`,
                sendingUserId,
                sendingUserName,
                sendingHospitalId,
                sendingHospitalName,
                receivingBloodBankId: bloodBank?.id || null, // Assign blood bank
                type: "Hospital Application",
                status: status || "Unseen",
            }
        });

        // Send email to admin
        await sendEmail(
            "admin@example.com",
            "New Hospital Application",
            `Hospital ${sendingHospitalName} has applied for access.`
        );

    // Condition: Blood Request (from Hospital to Blood Bank)
    } else if (type === "Blood Request") {
        const bloodBank = await prisma.bloodBank.findUnique({
            where: { id: receivingBloodBankId }
        });

        notification = await prisma.notification.create({
            data: {
                title: "Blood Request",
                content: `${sendingHospitalName} is requesting blood from ${bloodBank?.name}`,
                sendingUserId,
                sendingUserName,
                sendingHospitalId,
                sendingHospitalName,
                receivingBloodBankId,
                type: "Blood Request",
                status: status || "Unseen",
            }
        });

        await sendEmail(
            bloodBank?.email || "",
            "New Blood Request",
            `Hospital ${sendingHospitalName} has requested blood.`
        );

    // Condition: Blood Request Acceptance
    } else if (type === "Blood Request Acceptance") {
        notification = await prisma.notification.create({
            data: {
                title: "Blood Request Accepted",
                content: content,
                sendingUserId,
                sendingUserName,
                sendingBloodBankId,
                sendingBloodBankName,
                receivingHospitalId,
                type: "Blood Request Acceptance",
                status: status || "Unseen",
            }
        });

        await sendEmail(
            "hospital@example.com", // Adjust the recipient based on your logic
            "Blood Request Accepted",
            `Your blood request has been accepted.`
        );

    // Condition: Blood Delivery
    } else if (type === "Blood Delivery") {
        notification = await prisma.notification.create({
            data: {
                title: "Blood Delivery",
                content: content,
                sendingUserId,
                sendingUserName,
                sendingBloodBankId,
                sendingBloodBankName,
                receivingHospitalId,
                type: "Blood Delivery",
                status: status || "Unseen",
            }
        });

        await sendEmail(
            "hospital@example.com", // Adjust the recipient based on your logic
            "Blood Delivered",
            `The requested blood has been delivered to your hospital.`
        );
    }

    res.status(201).json({ message: `${type} notification created successfully`, notification });
});

// Get all notifications
export const getAllNotifications = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const notifications = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }});
    res.status(200).json({ notifications });
});

// Delete notification
export const deleteNotification = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    await prisma.notification.delete({
        where: { id: req.query.id as string }
    });

    res.status(200).json({ message: 'Notification deleted successfully' });
});

// Get notifications for a specific blood bank
export const getNotificationsByBloodBank = asyncWrapper(async (req: Request, res: Response) => {
    const { bloodBankId } = req.query;

    const notifications = await prisma.notification.findMany({
        where: { receivingBloodBankId: bloodBankId as string},
        orderBy: { createdAt: "desc" }
    });

    res.status(200).json({ notifications });
});

// Get notifications for a specific hospital
export const getNotificationsByHospital = asyncWrapper(async (req: Request, res: Response) => {
    const { hospitalId } = req.query;

    const notifications = await prisma.notification.findMany({
        where: { receivingHospitalId: hospitalId as string },
        orderBy: { createdAt: "desc" }
    });

    res.status(200).json({ notifications });
});

// Get notifications sent by a specific hospital
export const getNotificationsSentByHospital = asyncWrapper(async (req: Request, res: Response) => {
    const { hospitalId } = req.query;

    const notifications = await prisma.notification.findMany({
        where: { sendingHospitalId: hospitalId as string },
        orderBy: { createdAt: "desc" }
    });

    res.status(200).json({ notifications });
});

// Get notifications sent by a specific blood bank
export const getNotificationsSentByBloodBank = asyncWrapper(async (req: Request, res: Response) => {
    const { bloodBankId } = req.query;

    const notifications = await prisma.notification.findMany({
        where: { sendingBloodBankId: bloodBankId as string },
        orderBy: { createdAt: "desc" }
    });

    res.status(200).json({ notifications });
});

export const setToSeen = asyncWrapper(async (req: Request, res: Response) => {
    const notificationId = req.query.id as string;

    const updatedNotification = await prisma.notification.update({
        where: {
            id: notificationId
        },
        data: {
            status: "Seen"
        }
    });
    res.status(200).json({ message: "Seen" });
});