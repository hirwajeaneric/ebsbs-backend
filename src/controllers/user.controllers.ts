import { Request, Response, NextFunction } from "express";

import asyncWrapper from '../middlewares/AsyncWrapper';
import prisma from "../db/client";
import { GeneratePassword, GenerateToken, isTokenValid, ValidatePassword, ValidateToken } from "../utils/password.utils";
import { sendEmail } from "../utils/notification.utils";

export const test = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello World');
})

export const bloodBankSignIn = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    var existingUser: any = {}

    existingUser = await prisma.admin.findFirst({ where: { email: req.body.email } });
    if (!existingUser) {
        existingUser = await prisma.bloodBankRecorder.findFirst({ where: { email: req.body.email } });
    }
    if (!existingUser) {
        return res.status(404).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await ValidatePassword(req.body.password, existingUser.password, 10);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = await GenerateToken({
        _id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        hospitalId: "None",
        accountStatus: existingUser.accountStatus,
        verified: existingUser.verified
    });
    const user = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        accountStatus: existingUser.accountStatus,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName
    };
    const cookieName = existingUser.role === "admin" ? "admin-access-token" : "blood-bank-access-token";
    res
        .cookie(cookieName, token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
        .status(200)
        .json({ message: 'Login successful', user, token });
});

export const hospitalSignIn = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    var existingUser: any = {}

    existingUser = await prisma.hospitalAdmin.findFirst({ where: { email: req.body.email } });
    if (!existingUser) {
        existingUser = await prisma.hospitalWorker.findFirst({ where: { email: req.body.email } });
    }
    if (!existingUser) {
        return res.status(404).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await ValidatePassword(req.body.password, existingUser.password, 10);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = await GenerateToken({
        _id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        hospitalId: existingUser.hospitalId,
        accountStatus: existingUser.accountStatus,
        verified: existingUser.verified
    });
    const user = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        accountStatus: existingUser.accountStatus,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName
    };
    const cookieName = existingUser.role === "Hospital Admin" ? "hospital-admin-access-token" : "pharmacist-access-token";
    res
        .cookie(cookieName, token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
        .status(200)
        .json({ message: 'Login successful', user, token });
});

export const adminSignUp = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const existingUser = await prisma.admin.findFirst({
        where: {
            email: req.body.email
        }
    });
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await GeneratePassword(req.body.password, 10);
    const user = await prisma.admin.create({
        data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
        }
    });
    res.status(201).json({ message: 'Account created successfully', user });
});

export const hospitalSignUp = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const existingUser = await prisma.hospitalAdmin.findFirst({
        where: {
            email: req.body.email
        }
    });
    if (existingUser) {
        return res.status(409).json({ message: 'User account already exists' });
    }
    const hashedPassword = await GeneratePassword(req.body.password, 10);
    const user = await prisma.hospitalAdmin.create({
        data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
        }
    });
    res.status(201).json({ message: 'Account created successfully', user });
});

export const addNewUser = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    var user: any = {};

    if (req.body.role === "Hospital Worker") {
        let existingUser = await prisma.hospitalWorker.findFirst({
            where: {
                email: req.body.email
            }
        });
        if (existingUser) {
            return res.status(409).json({ message: 'User account already exists' });
        }
        const hashedPassword = await GeneratePassword(req.body.password, 10);
        user = await prisma.hospitalAdmin.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword,
            }
        });
    } else if (req.body.role === "Blood Bank Recorder") {
        let existingUser = await prisma.bloodBankRecorder.findFirst({
            where: {
                email: req.body.email
            }
        });
        if (existingUser) {
            return res.status(409).json({ message: 'User account already exists' });
        }
        const hashedPassword = await GeneratePassword(req.body.password, 10);
        user = await prisma.hospitalAdmin.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword,
            }
        });
    }

    var emailBody = "";
    if (user.role === "Hospital Worker") {
        emailBody = `Dear ${user.firstName} ${user.lastName},\n\nYour account has been created successfully. \n\nHere are your account credentials: \n\nEmail: ${user.email}\nPassword: ${req.body.password}\n\nAccess link: ${process.env.CLIENT_URL}/hauth/${req.body.hospitalId}/sign-in\n\nRemember to reset your password on login. \n\nNow you can log in.\n\nBest Regards,\nAdmin`;
    } else if (user.role === "Blood Bank Recorder") {
        emailBody = `Dear ${user.firstName} ${user.lastName},\n\nYour account has been created successfully. \n\nHere are your account credentials: \n\nEmail: ${user.email}\nPassword: ${req.body.password}\n\nAccess link: ${process.env.CLIENT_URL}/bbauth/sign-in\n\nRemember to reset your password on login. \n\nNow you can log in.\n\nBest Regards,\nAdmin`;
    }

    if (user) {
        await sendEmail(req.body.email, 'Your account credentials', emailBody);
    }

    res.status(201).json({ message: 'Account created successfully' });
});

export const listUsers = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const hospitalAdmins = await prisma.hospitalAdmin.findMany();
    const hospitalWorkers = await prisma.hospitalWorker.findMany();
    const bloodBankRecorders = await prisma.bloodBankRecorder.findMany();
    const users = [...hospitalAdmins, ...hospitalWorkers, ...bloodBankRecorders];
    res.status(200).json({ users });
})

export const listHospitalEmployees = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const hospitalWorkers = await prisma.hospitalWorker.findMany({
        where: {
            hospitalId: req.params.hospitalId
        }
    });
    res.status(200).json({ hospitalWorkers });
})

export const listBloodBankEmployees = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBankRecorders = await prisma.bloodBankRecorder.findMany();
    res.status(200).json({ bloodBankRecorders });
})

export const forgotPassword = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.hospitalAdmin.findFirst({
        where: {
            email: req.body.email
        }
    });
    if (!user) {
        return res.status(404).json({ message: 'User with this email not found' });
    }
    const token = await GenerateToken({
        _id: user.id,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus
    });

    await prisma.token.create({
        data: {
            user: user.id,
            token,
            expirationDate: new Date(Date.now() + (1000 * 60 * 60))
        }
    })

    var url = ``;
    if (user.role === "Hospital Worker") {
        url = `${process.env.CLIENT_URL}/hauth/${user.hospitalId}/reset-password?token=${token}&id=${user.id}`;
    } else if (user.role === "Blood Bank Recorder") {
        url = `${process.env.CLIENT_URL}/bbauth/reset-password?token=${token}&id=${user.id}`;
    } else if (user.role === "Hospital Admin") {
        url = `${process.env.CLIENT_URL}/hauth/${user.hospitalId}/reset-password?token=${token}&id=${user.id}`;
    } else if (user.role === "Blood Bank Admin") {
        url = `${process.env.CLIENT_URL}/bbauth/reset-password?token=${token}&id=${user.id}`;
    }

    await sendEmail(user.email, 'Reset Password', `Click here to reset your password: ${url}`);

    res.status(200).json({ message: 'Password reset link sent to your email' });
})

export const resetPassword = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const isTokenValid = await ValidateToken(req);
    if (!isTokenValid) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
    var foundUser: any = {};

    if (req.body.role === "Hospital Worker") {
        foundUser = await prisma.hospitalWorker.findFirst({ where: { id: req.user?._id } });
        foundUser.password = await GeneratePassword(req.body.password, 10);
        await foundUser.save();
        await prisma.token.deleteMany({ where: { user: req.user?._id } });
        await sendEmail(foundUser.email, 'Password Reset', `Your password has been reset.`);
        res.status(200).json({ message: 'Password reset successfully' });
    } else if (req.body.role === "Blood Bank Recorder") {
        foundUser = await prisma.bloodBankRecorder.findFirst({ where: { id: req.user?._id } });
        foundUser.password = await GeneratePassword(req.body.password, 10);
        await foundUser.save();
        await prisma.token.deleteMany({ where: { user: req.user?._id } });
        await sendEmail(foundUser.email, 'Password Reset', `Your password has been reset.`);
        res.status(200).json({ message: 'Password reset successfully' });
    } else if (req.body.role === "Hospital Admin") {
        foundUser = await prisma.hospitalAdmin.findFirst({ where: { id: req.user?._id } });
        foundUser.password = await GeneratePassword(req.body.password, 10);
        await foundUser.save();
        await prisma.token.deleteMany({ where: { user: req.user?._id } });
        await sendEmail(foundUser.email, 'Password Reset', `Your password has been reset.`);
        res.status(200).json({ message: 'Password reset successfully' });
    } else if (req.body.role === "Blood Bank Admin") {
        foundUser = await prisma.admin.findFirst({ where: { id: req.user?._id } });
        foundUser.password = await GeneratePassword(req.body.password, 10);
        await foundUser.save();
        await prisma.token.deleteMany({ where: { user: req.user?._id } });
        await sendEmail(foundUser.email, 'Password Reset', `Your password has been reset.`);
        res.status(200).json({ message: 'Password reset successfully' });
    }

    if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
    }
});

export const updateAccount = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    var updatedUser: any = {};

    if (req.body.role === "Hospital Worker") {
        updatedUser = await prisma.hospitalWorker.update({
            where: { id: req.body.id },
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                email: req.body.email,
                accountStatus: req.body.accountStatus
            }
        })
    }

    if (req.body.role === "Blood Bank Recorder") {
        updatedUser = await prisma.bloodBankRecorder.update({
            where: { id: req.body.id },
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                email: req.body.email,
                accountStatus: req.body.accountStatus
            }
        })
    }

    if (req.body.role === "Hospital Admin") {
        updatedUser = await prisma.hospitalAdmin.update({
            where: { id: req.body.id },
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                email: req.body.email,
                accountStatus: req.body.accountStatus
            }
        })
    }

    if (req.body.role === "Blood Bank Admin") {
        updatedUser = await prisma.admin.update({
            where: { id: req.body.id },
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                email: req.body.email,
                accountStatus: req.body.accountStatus
            }
        })
    }

    res.status(200).json({
        message: 'Account updated successfully',
        user: updatedUser
    });
})

export const verifyToken = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const validToken = await isTokenValid(req);

    if (!validToken) {
        return res.status(401).json({ message: 'Access Denied' });
    }
    res.status(200).json({ message: 'Token is valid' });
})
