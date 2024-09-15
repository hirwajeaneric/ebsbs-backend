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
        rhP_O: req.body.rhP_O || existingBloodBankData.rhP_O,
        rhP_AB: req.body.rhP_AB || existingBloodBankData.rhP_AB,
        rhP_B: req.body.rhP_B || existingBloodBankData.rhP_B,
        rhP_A: req.body.rhP_A || existingBloodBankData.rhP_A,
        rhN_O: req.body.rhN_O || existingBloodBankData.rhN_O,
        rhN_AB: req.body.rhN_AB || existingBloodBankData.rhN_AB,
        rhN_B: req.body.rhN_B || existingBloodBankData.rhN_B,
        rhN_A: req.body.rhN_A || existingBloodBankData.rhN_A,
        plasma_O_P: req.body.plasma_O_P || existingBloodBankData.plasma_O_P,
        plasma_O_N: req.body.plasma_O_N || existingBloodBankData.plasma_O_N,
        plasma_AB_P: req.body.plasma_AB_P || existingBloodBankData.plasma_AB_P,
        plasma_AB_N: req.body.plasma_AB_N || existingBloodBankData.plasma_AB_N,
        plasma_B_P: req.body.plasma_B_P || existingBloodBankData.plasma_B_P,
        plasma_B_N: req.body.plasma_B_N || existingBloodBankData.plasma_B_N,
        plasma_A_P: req.body.plasma_A_P || existingBloodBankData.plasma_A_P,
        plasma_A_N: req.body.plasma_A_N || existingBloodBankData.plasma_A_N
    };

    const bloodBank = await prisma.bloodBank.update({
        where: {
            id: req.query.id as string
        },
        data: updatedData
    });
    
    res.status(200).json({ message: 'Blood bank updated successfully', bloodBank });
});


export const getBloodBank = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBank = await prisma.bloodBank.findFirst({
        where: {
            id: req.query.id as string
        }
    });

    if (!bloodBank) {
        return res.status(404).json({ message: 'Blood bank not found' });
    }

    res.status(200).json({ bloodBank });
});

export const getAllBloodBanks = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBanks = await prisma.bloodBank.findMany();
    res.status(200).json({ bloodBanks });
});

export const deleteBloodBank = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBank = await prisma.bloodBank.delete({
        where: {
            id: req.query.id as string
        }
    });

    res.status(200).json({ message: 'Blood bank deleted successfully'});
});