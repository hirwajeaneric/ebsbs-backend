"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToSeen = exports.getNotificationsSentByBloodBank = exports.getNotificationsSentByHospital = exports.getNotifcationsForAdmin = exports.getNotificationsByHospital = exports.getNotificationsByBloodBank = exports.deleteNotification = exports.getAllNotifications = exports.createNotification = void 0;
const AsyncWrapper_1 = __importDefault(require("../middlewares/AsyncWrapper"));
const client_1 = __importDefault(require("../db/client"));
const notification_utils_1 = require("../utils/notification.utils");
// Create notification based on type and condition
exports.createNotification = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, sendingUserId, sendingUserName, sendingHospitalId, sendingHospitalName, sendingBloodBankId, sendingBloodBankName, receivingHospitalId, receivingBloodBankId, type, status } = req.body;
    let notification;
    // Condition: Hospital Application
    if (type === "Hospital Application") {
        const bloodBank = yield client_1.default.bloodBank.findFirst(); // Fetch existing blood bank
        notification = yield client_1.default.notification.create({
            data: {
                title: "Hospital Application",
                content: `${sendingHospitalName} has applied for access to the system.`,
                sendingUserId,
                sendingUserName,
                sendingHospitalId,
                sendingHospitalName,
                receivingBloodBankId: (bloodBank === null || bloodBank === void 0 ? void 0 : bloodBank.id) || null, // Assign blood bank
                type: "Hospital Application",
                status: status || "Unseen",
            }
        });
        // Send email to admin
        yield (0, notification_utils_1.sendEmail)("admin@example.com", "New Hospital Application", `Hospital ${sendingHospitalName} has applied for access.`);
        // Condition: Blood Request (from Hospital to Blood Bank)
    }
    else if (type === "Blood Request") {
        const bloodBank = yield client_1.default.bloodBank.findUnique({
            where: { id: receivingBloodBankId }
        });
        notification = yield client_1.default.notification.create({
            data: {
                title: "Blood Request",
                content: `${sendingHospitalName} is requesting blood from ${bloodBank === null || bloodBank === void 0 ? void 0 : bloodBank.name}`,
                sendingUserId,
                sendingUserName,
                sendingHospitalId,
                sendingHospitalName,
                receivingBloodBankId,
                type: "Blood Request",
                status: status || "Unseen",
            }
        });
        yield (0, notification_utils_1.sendEmail)((bloodBank === null || bloodBank === void 0 ? void 0 : bloodBank.email) || "", "New Blood Request", `Hospital ${sendingHospitalName} has requested blood.`);
        // Condition: Blood Request Acceptance
    }
    else if (type === "Blood Request Acceptance") {
        notification = yield client_1.default.notification.create({
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
        yield (0, notification_utils_1.sendEmail)("hospital@example.com", // Adjust the recipient based on your logic
        "Blood Request Accepted", `Your blood request has been accepted.`);
        // Condition: Blood Delivery
    }
    else if (type === "Blood Delivery") {
        notification = yield client_1.default.notification.create({
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
        yield (0, notification_utils_1.sendEmail)("hospital@example.com", // Adjust the recipient based on your logic
        "Blood Delivered", `The requested blood has been delivered to your hospital.`);
    }
    res.status(201).json({ message: `${type} notification created successfully`, notification });
}));
// Get all notifications
exports.getAllNotifications = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield client_1.default.notification.findMany({ orderBy: { createdAt: "desc" } });
    res.status(200).json({ notifications });
}));
// Delete notification
exports.deleteNotification = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.default.notification.delete({
        where: { id: req.query.id }
    });
    res.status(200).json({ message: 'Notification deleted successfully' });
}));
// Get notifications for a specific blood bank
exports.getNotificationsByBloodBank = (0, AsyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bloodBankId } = req.query;
    const notifications = yield client_1.default.notification.findMany({
        where: { receivingBloodBankId: bloodBankId },
        orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ notifications });
}));
// Get notifications for a specific hospital
exports.getNotificationsByHospital = (0, AsyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hospitalId } = req.query;
    const notifications = yield client_1.default.notification.findMany({
        where: { receivingHospitalId: hospitalId },
        orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ notifications });
}));
exports.getNotifcationsForAdmin = (0, AsyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield client_1.default.notification.findMany({
        where: { type: "Hospital Application" },
        orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ notifications });
}));
// Get notifications sent by a specific hospital
exports.getNotificationsSentByHospital = (0, AsyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hospitalId } = req.query;
    const notifications = yield client_1.default.notification.findMany({
        where: { sendingHospitalId: hospitalId },
        orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ notifications });
}));
// Get notifications sent by a specific blood bank
exports.getNotificationsSentByBloodBank = (0, AsyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bloodBankId } = req.query;
    const notifications = yield client_1.default.notification.findMany({
        where: { sendingBloodBankId: bloodBankId },
        orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ notifications });
}));
exports.setToSeen = (0, AsyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationId = req.query.id;
    const updatedNotification = yield client_1.default.notification.update({
        where: {
            id: notificationId
        },
        data: {
            status: "Seen"
        }
    });
    res.status(200).json({ message: "Seen" });
}));
