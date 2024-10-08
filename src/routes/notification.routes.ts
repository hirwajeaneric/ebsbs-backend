import express from 'express';
import { 
    createNotification, 
    deleteNotification, 
    getAllNotifications, 
    getNotifcationsForAdmin, 
    getNotificationsByBloodBank, 
    getNotificationsByHospital, 
    getNotificationsSentByBloodBank, 
    getNotificationsSentByHospital, 
    setToSeen
} from '../controllers/notification.controller';

const notificationRouter = express.Router();

notificationRouter.post('/add', createNotification);
notificationRouter.delete('/delete', deleteNotification);
notificationRouter.get('/getAll', getAllNotifications);
notificationRouter.get('/getNotificationsByBloodBank', getNotificationsByBloodBank);
notificationRouter.get('/getNotificationsByHospital', getNotificationsByHospital);
notificationRouter.get('/getNotificationsSentByBloodBank', getNotificationsSentByBloodBank);
notificationRouter.get('/getNotificationsSentByHospital', getNotificationsSentByHospital);
notificationRouter.get('/changeToSeen', setToSeen);
notificationRouter.get('/admin-notifications', getNotifcationsForAdmin);

export default notificationRouter;