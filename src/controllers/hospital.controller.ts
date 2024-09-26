import { Request, Response, NextFunction } from "express";

import asyncWrapper from '../middlewares/AsyncWrapper';
import prisma from "../db/client";
import { sendEmail } from "../utils/notification.utils";

export const createHospital = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const hospital = await prisma.hospital.create({
        data: {
            name: req.body.name,
            googleLocation: req.body.googleLocation,
            province: req.body.province,
            town: req.body.town,
            specialization: req.body.specialization,
            hospitalType: req.body.hospitalType,
        }
    });

    const updateAdminAccount = await prisma.hospitalAdmin.update({
        where: {
            id: req.body.hospitalAdminId
        },
        data: {
            hospitalId: hospital.id
        }
    });

    if (!updateAdminAccount) {
        return res.status(404).json({ message: 'Hospital admin not found' });
    }

    res.status(201).json({ message: 'Hospital application submitted successfully' });
});

export const updateHospital = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const existingHospitalData = await prisma.hospital.findFirst({ where: { id: req.query.id as string } });
    
    if (!existingHospitalData) {
        return res.status(404).json({ message: 'Hospital not found' });
    }

    const updatedData = {
        name: req.body.name || existingHospitalData.name,
        googleLocation: req.body.googleLocation || existingHospitalData.googleLocation,
        province: req.body.province || existingHospitalData.province,
        town: req.body.town || existingHospitalData.town,
        specialization: req.body.specialization || existingHospitalData.specialization,
        hospitalType: req.body.hospitalType || existingHospitalData.hospitalType,
        accessStatus: req.body.accessStatus || existingHospitalData.accessStatus,
        rhP_O: req.body.rhP_O || existingHospitalData.rhP_O,
        rhP_AB: req.body.rhP_AB || existingHospitalData.rhP_AB,
        rhP_B: req.body.rhP_B || existingHospitalData.rhP_B,
        rhP_A: req.body.rhP_A || existingHospitalData.rhP_A,
        rhN_O: req.body.rhN_O || existingHospitalData.rhN_O,
        rhN_AB: req.body.rhN_AB || existingHospitalData.rhN_AB,
        rhN_B: req.body.rhN_B || existingHospitalData.rhN_B,
        rhN_A: req.body.rhN_A || existingHospitalData.rhN_A,
        plasmaRhP_O: req.body.plasmaRhP_O || existingHospitalData.plasmaRhP_O,
        plasmaRhP_AB: req.body.plasmaRhP_AB || existingHospitalData.plasmaRhP_AB,
        plasmaRhP_B: req.body.plasmaRhP_B || existingHospitalData.plasmaRhP_B,
        plasmaRhP_A: req.body.plasmaRhP_A || existingHospitalData.plasmaRhP_A,
        plasmaRhN_O: req.body.plasmaRhN_O || existingHospitalData.plasmaRhN_O,
        plasmaRhN_AB: req.body.plasmaRhN_AB || existingHospitalData.plasmaRhN_AB,
        plasmaRhN_B: req.body.plasmaRhN_B || existingHospitalData.plasmaRhN_B,
        plasmaRhN_A: req.body.plasmaRhN_A || existingHospitalData.plasmaRhN_A,
        plateletRhP_O: req.body.plateletRhP_O || existingHospitalData.plateletRhP_O,
        plateletRhP_AB: req.body.plateletRhP_AB || existingHospitalData.plateletRhP_AB,
        plateletRhP_B: req.body.plateletRhP_B || existingHospitalData.plateletRhP_B,
        plateletRhP_A: req.body.plateletRhP_A || existingHospitalData.plateletRhP_A,
        plateletRhN_O: req.body.plateletRhN_O || existingHospitalData.plateletRhN_O,
        plateletRhN_AB: req.body.plateletRhN_AB || existingHospitalData.plateletRhN_AB,
        plateletRhN_B: req.body.plateletRhN_B || existingHospitalData.plateletRhN_B,
        plateletRhN_A: req.body.plateletRhN_A || existingHospitalData.plateletRhN_A,
        rbcP_O: req.body.rbcP_O || existingHospitalData.rbcP_O,
        rbcP_AB: req.body.rbcP_AB || existingHospitalData.rbcP_AB,
        rbcP_B: req.body.rbcP_B || existingHospitalData.rbcP_B,
        rbcP_A: req.body.rbcP_A || existingHospitalData.rbcP_A,
        rbcN_O: req.body.rbcN_O || existingHospitalData.rbcN_O,
        rbcN_AB: req.body.rbcN_AB || existingHospitalData.rbcN_AB,
        rbcN_B: req.body.rbcN_B || existingHospitalData.rbcN_B,
        rbcN_A: req.body.rbcN_A || existingHospitalData.rbcN_A,
    };

    const hospital = await prisma.hospital.update({ where: { id: req.query.id as string }, data: updatedData });
    
    const hospitalAdmin = await prisma.hospitalAdmin.findFirst({ where: { hospitalId: hospital.id } });
    
    if (hospitalAdmin && hospitalAdmin.email) {
        if (req.body.accessStatus === 'Active' && existingHospitalData.accessStatus === 'Inactive') {
            await prisma.hospitalAdmin.update({ where: { id: hospitalAdmin.id }, data: { accountStatus: 'Active' } });
            sendEmail(
                hospitalAdmin.email,
                'Hospital Access Approval',
                `Dear ${hospitalAdmin.firstName} ${hospitalAdmin.lastName}, \n\nYour access request for the hospital ${hospital.name} has been approved. And your account is now active. \n\nPlease use the following credentials to log in: \n\nUsername/email: ${hospitalAdmin.email}\nAccess Link: ${process.env.CLIENT_URL}/hdash/${hospital.id}\n\nRegards, \n\nThank you.`
            );
        } else if (req.body.accessStatus === 'Inactive' && existingHospitalData.accessStatus === 'Active') {
            sendEmail(
                hospitalAdmin.email,
                'Hospital Access Revocation',
                `Dear ${hospitalAdmin.firstName} ${hospitalAdmin.lastName}, \n\nYour access to the hospital ${hospital.name} has been revoked. \n\nRegards, \n\nThank you.`
            );
        }
    }

    res.status(200).json({ message: 'Hospital info updated successfully', hospital });
});


export const getHospital = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const fetchedHospital = await prisma.hospital.findFirst({ where: { id: req.query.id as string } });
    if (!fetchedHospital) {
        return res.status(404).json({ message: 'Hospital not found' });
    }
    const hospital = {
        id: fetchedHospital.id,
        name: fetchedHospital.name,
        googleLocation: fetchedHospital.googleLocation,
        province: fetchedHospital.province,
        town: fetchedHospital.town,
        specialization: fetchedHospital.specialization,
        hospitalType: fetchedHospital.hospitalType,
        accessStatus: fetchedHospital.accessStatus,
        createdAt: fetchedHospital.createdAt,
        updatedAt: fetchedHospital.updatedAt,
        rhP_O: fetchedHospital.rhP_O,
        rhP_AB: fetchedHospital.rhP_AB,
        rhP_B: fetchedHospital.rhP_B,
        rhP_A: fetchedHospital.rhP_A,
        rhN_O: fetchedHospital.rhN_O,
        rhN_AB: fetchedHospital.rhN_AB,
        rhN_B: fetchedHospital.rhN_B,
        rhN_A: fetchedHospital.rhN_A,
        plasmaRhP_O: fetchedHospital.plasmaRhP_O,
        plasmaRhP_AB: fetchedHospital.plasmaRhP_AB,
        plasmaRhP_B: fetchedHospital.plasmaRhP_B,
        plasmaRhP_A: fetchedHospital.plasmaRhP_A,
        plasmaRhN_O: fetchedHospital.plasmaRhN_O,
        plasmaRhN_AB: fetchedHospital.plasmaRhN_AB,
        plasmaRhN_B: fetchedHospital.plasmaRhN_B,
        plasmaRhN_A: fetchedHospital.plasmaRhN_A,
        plateletRhP_O: fetchedHospital.plateletRhP_O,
        plateletRhP_AB: fetchedHospital.plateletRhP_AB,
        plateletRhP_B: fetchedHospital.plateletRhP_B,
        plateletRhP_A: fetchedHospital.plateletRhP_A,
        plateletRhN_O: fetchedHospital.plateletRhN_O,
        plateletRhN_AB: fetchedHospital.plateletRhN_AB,
        plateletRhN_B: fetchedHospital.plateletRhN_B,
        plateletRhN_A: fetchedHospital.plateletRhN_A,
        rbcP_O: fetchedHospital.rbcP_O,
        rbcP_AB: fetchedHospital.rbcP_AB,
        rbcP_B: fetchedHospital.rbcP_B,
        rbcP_A: fetchedHospital.rbcP_A,
        rbcN_O: fetchedHospital.rbcN_O,
        rbcN_AB: fetchedHospital.rbcN_AB,
        rbcN_B: fetchedHospital.rbcN_B,
        rbcN_A: fetchedHospital.rbcN_A,
    }
    res.status(200).json({ hospital });
});

export const getInactiveHospitals = asyncWrapper(async (req: Request, response: Response, next: NextFunction) => {
    const hospitals = await prisma.hospital.findMany({
        where: {
            accessStatus: "Inactive"
        }
    });
    response.status(200).json({ hospitals });
});

export const getActiveHospitals = asyncWrapper(async (req: Request, response: Response, next: NextFunction) => {
    const hospitals = await prisma.hospital.findMany({
        where: {
            accessStatus: "Active"
        }
    });
    response.status(200).json({ hospitals });
});

export const getAllHospitals = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const hospitals = await prisma.hospital.findMany();
    res.status(200).json({ hospitals });
});

export const deleteHospital = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    await prisma.hospital.delete({
        where: {
            id: req.query.id as string
        }
    });

    res.status(200).json({ message: 'Hospital deleted successfully' });
});

export const searchHospitalsByBlood = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { bloodType, bloodGroup, rhesis } = req.body;

    // Define the column in the hospital table to check based on bloodType, bloodGroup, and Rhesis
    let bloodField;
    if (bloodType === "Plasma") {
        bloodField = `plasmaRh${rhesis}_${bloodGroup}`;
    } else if (bloodType === "Platelet") {
        bloodField = `plateletRh${rhesis}_${bloodGroup}`;
    } else if (bloodType === "Red Blood Cells") {
        bloodField = `rbc${rhesis}_${bloodGroup}`;
    } else if (bloodType === "Whole Blood") {
        bloodField = `rh${rhesis}_${bloodGroup}`;
    }

    if (!bloodField) {
        return res.status(400).json({ message: "Invalid blood type" });
    }

    // Query hospitals that have the requested blood type and meet the blood quality condition
    const hospitals = await prisma.hospital.findMany({
        where: {
            [bloodField]: {
                gt: 0, // Ensure there is available stock
            },
        },
    });

    if (!hospitals.length) {
        return res.status(404).json({ message: "No hospitals found with the requested blood type and quality" });
    }

    res.status(200).json({ hospitals });
});
