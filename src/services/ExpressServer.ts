import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import ErrorHandlerMiddleware from '../middlewares/ErrorHandler';
import userRouter from '../routes/user.routes';
import bloodBankRouter from '../routes/bloodBank.routes';
import hospitalRouter from '../routes/hospital.routes';
import bloodBagRouter from '../routes/bloodBag.routes';
import bloodRequestRouter from '../routes/bloodRequest.routes';
import notificationRouter from '../routes/notification.routes';

export default async (app: Application) => {
    app.use(express.json());
   
    app.use(cors({
        origin: [process.env.CLIENT_URL as string],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }));

    app.get("/health", async(req: Request, res: Response ) => {
        res.send({
            message: "Health OK!"
        });
    });

    app.use('/api/v1/auth', userRouter);
    app.use('/api/v1/bloodbanks', bloodBankRouter);
    app.use('/api/v1/hospitals', hospitalRouter);
    app.use('/api/v1/bloodbags', bloodBagRouter);
    app.use('/api/v1/bloodrequests', bloodRequestRouter);
    app.use('/api/v1/notifications', notificationRouter);

    app.use(ErrorHandlerMiddleware);

    return app;
}