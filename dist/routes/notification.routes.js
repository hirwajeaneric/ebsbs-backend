"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("../controllers/notification.controller");
const notificationRouter = express_1.default.Router();
notificationRouter.post('/add', notification_controller_1.createNotification);
notificationRouter.delete('/delete', notification_controller_1.deleteNotification);
notificationRouter.get('/getAll', notification_controller_1.getAllNotifications);
notificationRouter.get('/getNotificationsByBloodBank', notification_controller_1.getNotificationsByBloodBank);
notificationRouter.get('/getNotificationsByHospital', notification_controller_1.getNotificationsByHospital);
notificationRouter.get('/getNotificationsSentByBloodBank', notification_controller_1.getNotificationsSentByBloodBank);
notificationRouter.get('/getNotificationsSentByHospital', notification_controller_1.getNotificationsSentByHospital);
notificationRouter.get('/changeToSeen', notification_controller_1.setToSeen);
notificationRouter.get('/admin-notifications', notification_controller_1.getNotifcationsForAdmin);
exports.default = notificationRouter;
