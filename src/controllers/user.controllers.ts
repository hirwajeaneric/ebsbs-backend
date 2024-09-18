import { Request, Response, NextFunction } from "express";

import asyncWrapper from '../middlewares/AsyncWrapper';
import prisma from "../db/client";
import { GeneratePassword, GenerateToken, isTokenValid, ValidateToken } from "../utils/password.utils";
import { sendEmail } from "../utils/notification.utils";
import bcrypt from "bcryptjs";

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
        console.log("Hello")
        return res.status(404).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
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
    const cookieName = existingUser.role === "admin" ? "admin-access-token" : "recorder-access-token";
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
    const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password);
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
        return res.status(409).json({ error: 'User already exists' });
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

    res.status(201).json({ message: 'Account created successfully', userId: user.id });
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
        user = await prisma.hospitalWorker.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword,
                hospitalId: req.body.hospitalId
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
        user = await prisma.bloodBankRecorder.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword,
                bloodBankId: req.body.bloodBankId
            }
        });
    }

    var emailBody = ``;
    if (user.role === "Hospital Worker") {
        emailBody = `Dear ${user.firstName} ${user.lastName},\n\nYour account has been created successfully. \n\nHere are your account credentials: \n\nEmail: ${user.email}\nPassword: ${req.body.password}\n\nAccess link: ${process.env.CLIENT_URL}/hauth/${req.body.hospitalId}/sign-in\n\nRemember to reset your password on login. \n\nNow you can log in.\n\nBest Regards,\nAdmin`;
    } else if (user.role === "Blood Bank Recorder") {
        emailBody = `Dear ${user.firstName} ${user.lastName},\n\nYour account has been created successfully. \n\nHere are your account credentials: \n\nEmail: ${user.email}\nPassword: ${req.body.password}\n\nAccess link: ${process.env.CLIENT_URL}/bbauth/sign-in\n\nRemember to reset your password on login. \n\nNow you can log in.\n\nBest Regards,\nAdmin`;
    }

    await sendEmail(req.body.email, 'Your account credentials', emailBody);

    res.status(201).json({ message: 'Account created successfully' });
});

export const listUsers = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const hospitalAdmins = await prisma.hospitalAdmin.findMany({ select: { email: true, firstName: true, lastName: true, role: true, id: true, accountStatus: true, hospitalId: true } });
    const hospitalWorkers = await prisma.hospitalWorker.findMany({ select: { email: true, firstName: true, lastName: true, role: true, id: true, accountStatus: true, hospitalId: true } });
    const bloodBankRecorders = await prisma.bloodBankRecorder.findMany({ select: { email: true, firstName: true, lastName: true, role: true, id: true, accountStatus: true } });
    const users = [...hospitalAdmins, ...hospitalWorkers, ...bloodBankRecorders];
    
    res.status(200).json({ users });
})

export const listHospitalEmployees = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const hospitalWorkers = await prisma.hospitalWorker.findMany({
        where: {
            hospitalId: req.query.hospitalId as string
        }
    });
    res.status(200).json({ hospitalWorkers });
})

export const findUserByHospitalId = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const hospitalAdmin = await prisma.hospitalWorker.findFirst({
        where: {
            hospitalId: req.query.hospitalId as string
        }
    });
    res.status(200).json({ hospitalAdmin });
})

export const listBloodBankEmployees = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBankRecorders = await prisma.bloodBankRecorder.findMany({
        where: {
            bloodBankId: req.query.bloodBankId as string
        }
    });
    res.status(200).json({ bloodBankRecorders });
})

export const forgotPassword = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    var user: any = {};
    user = await prisma.hospitalAdmin.findFirst({ where: { email: req.body.email } });
    if (!user) {
        user = await prisma.admin.findFirst({ where: { email: req.body.email } });
    }
    if (!user) {
        user = await prisma.hospitalWorker.findFirst({ where: { email: req.body.email } });
    }
    if (!user) {
        user = await prisma.bloodBankRecorder.findFirst({ where: { email: req.body.email } });
    }

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
    console.log(req.user);
    console.log(isTokenValid);
    if (!isTokenValid) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
    var foundUser: any = {};

    if (req.user?.role === "Hospital Worker") {
        foundUser = await prisma.hospitalWorker.findFirst({ where: { id: req.user?._id } });
        foundUser.password = await GeneratePassword(req.body.password, 10);
        await prisma.bloodBankRecorder.update({
            where: { id: req.user?._id },
            data: {
                password: foundUser.password
            }
        });
        await prisma.token.deleteMany({ where: { user: req.user?._id } });
        await sendEmail(foundUser.email, 'Password Reset', `Your password has been reset.`);
        res.status(200).json({ message: 'Password reset successfully' });
    } else if (req.user?.role === "Blood Bank Recorder") {
        foundUser = await prisma.bloodBankRecorder.findFirst({ where: { id: req.user?._id } });
        foundUser.password = await GeneratePassword(req.body.password, 10);
        await prisma.bloodBankRecorder.update({
            where: { id: req.user?._id },
            data: {
                password: foundUser.password
            }
        });
        await prisma.token.deleteMany({ where: { user: req.user?._id } });
        await sendEmail(foundUser.email, 'Password Reset', `Your password has been reset.`);
        res.status(200).json({ message: 'Password reset successfully' });
    } else if (req.user?.role === "Hospital Admin") {
        foundUser = await prisma.hospitalAdmin.findFirst({ where: { id: req.user?._id } });
        foundUser.password = await GeneratePassword(req.body.password, 10);
        await prisma.bloodBankRecorder.update({
            where: { id: req.user?._id },
            data: {
                password: foundUser.password
            }
        });
        await prisma.token.deleteMany({ where: { user: req.user?._id } });
        await sendEmail(foundUser.email, 'Password Reset', `Your password has been reset.`);
        res.status(200).json({ message: 'Password reset successfully' });
    } else if (req.user?.role === "Blood Bank Admin") {
        foundUser = await prisma.admin.findFirst({ where: { id: req.user?._id } });
        foundUser.password = await GeneratePassword(req.body.password, 10);
        await prisma.bloodBankRecorder.update({
            where: { id: req.user?._id },
            data: {
                password: foundUser.password
            }
        });
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
    var toBeUpdated: any = {};

    if (req.query.role === "Hospital Worker") {
        toBeUpdated = await prisma.hospitalWorker.findUnique({
            where: { id: req.query.id as string }
        })
        if (!toBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }
        toBeUpdated.firstName = req.body.firstName || toBeUpdated.firstName;
        toBeUpdated.lastName = req.body.lastName || toBeUpdated.lastName;
        toBeUpdated.phone = req.body.phone || toBeUpdated.phone;
        toBeUpdated.email = req.body.email || toBeUpdated.email;
        toBeUpdated.accountStatus = req.body.accountStatus || toBeUpdated.accountStatus;
        
        delete toBeUpdated.id;

        updatedUser = await prisma.hospitalWorker.update({
            where: { id: req.query.id as string },
            data: toBeUpdated
        })
    }

    if (req.query.role === "Blood Bank Recorder") {
        toBeUpdated = await prisma.bloodBankRecorder.findUnique({
            where: { id: req.query.id as string }
        })
        if (!toBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }

        toBeUpdated.firstName = req.body.firstName || toBeUpdated.firstName;
        toBeUpdated.lastName = req.body.lastName || toBeUpdated.lastName;
        toBeUpdated.phone = req.body.phone || toBeUpdated.phone;
        toBeUpdated.email = req.body.email || toBeUpdated.email;
        toBeUpdated.accountStatus = req.body.accountStatus || toBeUpdated.accountStatus;
        
        delete toBeUpdated.id;

        updatedUser = await prisma.bloodBankRecorder.update({
            where: { id: req.query.id as string },
            data: toBeUpdated
        })
    }

    if (req.query.role === "Hospital Admin") {
        toBeUpdated = await prisma.hospitalAdmin.findUnique({
            where: { id: req.query.id as string }
        })
        if (!toBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }
        toBeUpdated.firstName = req.body.firstName || toBeUpdated.firstName;
        toBeUpdated.lastName = req.body.lastName || toBeUpdated.lastName;
        toBeUpdated.phone = req.body.phone || toBeUpdated.phone;
        toBeUpdated.email = req.body.email || toBeUpdated.email;
        toBeUpdated.accountStatus = req.body.accountStatus || toBeUpdated.accountStatus;
        
        delete toBeUpdated.id;

        updatedUser = await prisma.hospitalAdmin.update({
            where: { id: req.query.id as string },
            data: toBeUpdated
        })
    }

    if (req.query.role === "Blood Bank Admin") {
        toBeUpdated = await prisma.admin.findUnique({
            where: { id: req.query.id as string }
        })
        if (!toBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }
        toBeUpdated.firstName = req.body.firstName || toBeUpdated.firstName;
        toBeUpdated.lastName = req.body.lastName || toBeUpdated.lastName;
        toBeUpdated.phone = req.body.phone || toBeUpdated.phone;
        toBeUpdated.email = req.body.email || toBeUpdated.email;
        toBeUpdated.accountStatus = req.body.accountStatus || toBeUpdated.accountStatus;
        
        delete toBeUpdated.id;

        updatedUser = await prisma.admin.update({
            where: { id: req.query.id as string },
            data: toBeUpdated
        })
    }

    res.status(200).json({
        message: 'Account Updated successfully',
        user: {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            accountStatus: updatedUser.accountStatus,
            role: updatedUser.role,
            id: updatedUser.id,
            hospitalId: updatedUser.hospitalId,
        }
    });
})

export const verifyToken = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const validToken = await isTokenValid(req);

    if (!validToken) {
        return res.status(401).json({ message: 'Access Denied' });
    }
    res.status(200).json({ message: 'Token is valid' });
})
