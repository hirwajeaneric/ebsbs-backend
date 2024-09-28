import { Request, Response, NextFunction } from "express";

import asyncWrapper from '../middlewares/AsyncWrapper';
import prisma from "../db/client";

export const createBloodBank = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBank = await prisma.bloodBank.create({
        data: {
            name: req.body.name,
            googleLocation: req.body.googleLocation,
            phone: req.body.phone,
            email: req.body.email,
            province: req.body.province,
            town: req.body.town,
            POBox: req.body.POBox
        }
    });

    res.status(201).json({ message: 'Blood bank created successfully', bloodBank });
});

export const updateBloodBank = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const existingBloodBankData = await prisma.bloodBank.findFirst({
        where: {
            id: req.query.id as string
        }
    });

    if (!existingBloodBankData) {
        return res.status(404).json({ message: 'Blood bank not found' });
    }
    
    const updatedData = {
        name: req.body.name || existingBloodBankData.name,
        googleLocation: req.body.googleLocation || existingBloodBankData.googleLocation,
        phone: req.body.phone || existingBloodBankData.phone,
        email: req.body.email || existingBloodBankData.email,
        province: req.body.province || existingBloodBankData.province,
        town: req.body.town || existingBloodBankData.town,
        POBox: req.body.POBox || existingBloodBankData.POBox,

        // Update Rh positive blood types
        rhP_O: req.body.rhP_O || existingBloodBankData.rhP_O,
        rhP_AB: req.body.rhP_AB || existingBloodBankData.rhP_AB,
        rhP_B: req.body.rhP_B || existingBloodBankData.rhP_B,
        rhP_A: req.body.rhP_A || existingBloodBankData.rhP_A,

        // Update Rh negative blood types
        rhN_O: req.body.rhN_O || existingBloodBankData.rhN_O,
        rhN_AB: req.body.rhN_AB || existingBloodBankData.rhN_AB,
        rhN_B: req.body.rhN_B || existingBloodBankData.rhN_B,
        rhN_A: req.body.rhN_A || existingBloodBankData.rhN_A,

        // Update Plasma Rh positive types
        plasmaRhP_O: req.body.plasmaRhP_O || existingBloodBankData.plasmaRhP_O,
        plasmaRhP_AB: req.body.plasmaRhP_AB || existingBloodBankData.plasmaRhP_AB,
        plasmaRhP_B: req.body.plasmaRhP_B || existingBloodBankData.plasmaRhP_B,
        plasmaRhP_A: req.body.plasmaRhP_A || existingBloodBankData.plasmaRhP_A,

        // Update Plasma Rh negative types
        plasmaRhN_O: req.body.plasmaRhN_O || existingBloodBankData.plasmaRhN_O,
        plasmaRhN_AB: req.body.plasmaRhN_AB || existingBloodBankData.plasmaRhN_AB,
        plasmaRhN_B: req.body.plasmaRhN_B || existingBloodBankData.plasmaRhN_B,
        plasmaRhN_A: req.body.plasmaRhN_A || existingBloodBankData.plasmaRhN_A,

        // Update Platelet Rh positive types
        plateletRhP_O: req.body.plateletRhP_O || existingBloodBankData.plateletRhP_O,
        plateletRhP_AB: req.body.plateletRhP_AB || existingBloodBankData.plateletRhP_AB,
        plateletRhP_B: req.body.plateletRhP_B || existingBloodBankData.plateletRhP_B,
        plateletRhP_A: req.body.plateletRhP_A || existingBloodBankData.plateletRhP_A,

        // Update Platelet Rh negative types
        plateletRhN_O: req.body.plateletRhN_O || existingBloodBankData.plateletRhN_O,
        plateletRhN_AB: req.body.plateletRhN_AB || existingBloodBankData.plateletRhN_AB,
        plateletRhN_B: req.body.plateletRhN_B || existingBloodBankData.plateletRhN_B,
        plateletRhN_A: req.body.plateletRhN_A || existingBloodBankData.plateletRhN_A,

        // Update Red Blood Cells Rh positive types
        rbcP_O: req.body.rbcP_O || existingBloodBankData.rbcP_O,
        rbcP_AB: req.body.rbcP_AB || existingBloodBankData.rbcP_AB,
        rbcP_B: req.body.rbcP_B || existingBloodBankData.rbcP_B,
        rbcP_A: req.body.rbcP_A || existingBloodBankData.rbcP_A,

        // Update Red Blood Cells Rh negative types
        rbcN_O: req.body.rbcN_O || existingBloodBankData.rbcN_O,
        rbcN_AB: req.body.rbcN_AB || existingBloodBankData.rbcN_AB,
        rbcN_B: req.body.rbcN_B || existingBloodBankData.rbcN_B,
        rbcN_A: req.body.rbcN_A || existingBloodBankData.rbcN_A,
    };

    const bloodBank = await prisma.bloodBank.update({
        where: { id: req.query.id as string },
        data: updatedData
    });
    
    res.status(200).json({ message: 'Blood bank updated successfully', bloodBank });
});


export const getBloodBank = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBank = await prisma.bloodBank.findFirst({ where: { id: req.query.id as string }});
    if (!bloodBank) { return res.status(404).json({ message: 'Blood bank not found' }) }
    res.status(200).json({ bloodBank });
});

export const getAllBloodBanks = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBanks = await prisma.bloodBank.findMany();
    res.status(200).json({ bloodBanks });
});

export const deleteBloodBank = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    await prisma.bloodBank.delete({ where: { id: req.query.id as string }});

    res.status(200).json({ message: 'Blood bank deleted successfully'});
});

export const adminOverviewData = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBankId = req.query.id as string;
    
    const hospitals = await prisma.hospital.findMany({ where: { accessStatus: "Active" }})
    const applications = await prisma.hospital.findMany({ where: { accessStatus: "Inactive" }});
    const bloodBankUsers = await prisma.bloodBankRecorder.findMany({ where: { bloodBankId: bloodBankId }});
    const notifications: any = [];
    
    res.status(200).json({ hospitals, applications, notifications, users: bloodBankUsers });
});