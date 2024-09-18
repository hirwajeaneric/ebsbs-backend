import { Request, Response, NextFunction } from "express";

import asyncWrapper from '../middlewares/AsyncWrapper';
import prisma from "../db/client";

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
    const existingHospitalData = await prisma.hospital.findFirst({
        where: {
            id: req.query.id as string
        }
    });

    if (!existingHospitalData) {
        return res.status(404).json({ message: 'Hospital not found' });
    }

    const updatedData = {
        name: req.body.name,
        googleLocation: req.body.googleLocation,
        province: req.body.province,
        town: req.body.town,
        specialization: req.body.specialization,
        hospitalType: req.body.hospitalType,
        // Update Rh positive blood types
        rhP_O: req.body.rhP_O || existingHospitalData.rhP_O,
        rhP_AB: req.body.rhP_AB || existingHospitalData.rhP_AB,
        rhP_B: req.body.rhP_B || existingHospitalData.rhP_B,
        rhP_A: req.body.rhP_A || existingHospitalData.rhP_A,

        // Update Rh negative blood types
        rhN_O: req.body.rhN_O || existingHospitalData.rhN_O,
        rhN_AB: req.body.rhN_AB || existingHospitalData.rhN_AB,
        rhN_B: req.body.rhN_B || existingHospitalData.rhN_B,
        rhN_A: req.body.rhN_A || existingHospitalData.rhN_A,

        // Update Plasma Rh positive types
        plasmaRhP_O: req.body.plasmaRhP_O || existingHospitalData.plasmaRhP_O,
        plasmaRhP_AB: req.body.plasmaRhP_AB || existingHospitalData.plasmaRhP_AB,
        plasmaRhP_B: req.body.plasmaRhP_B || existingHospitalData.plasmaRhP_B,
        plasmaRhP_A: req.body.plasmaRhP_A || existingHospitalData.plasmaRhP_A,

        // Update Plasma Rh negative types
        plasmaRhN_O: req.body.plasmaRhN_O || existingHospitalData.plasmaRhN_O,
        plasmaRhN_AB: req.body.plasmaRhN_AB || existingHospitalData.plasmaRhN_AB,
        plasmaRhN_B: req.body.plasmaRhN_B || existingHospitalData.plasmaRhN_B,
        plasmaRhN_A: req.body.plasmaRhN_A || existingHospitalData.plasmaRhN_A,

        // Update Platelet Rh positive types
        plateletRhP_O: req.body.plateletRhP_O || existingHospitalData.plateletRhP_O,
        plateletRhP_AB: req.body.plateletRhP_AB || existingHospitalData.plateletRhP_AB,
        plateletRhP_B: req.body.plateletRhP_B || existingHospitalData.plateletRhP_B,
        plateletRhP_A: req.body.plateletRhP_A || existingHospitalData.plateletRhP_A,

        // Update Platelet Rh negative types
        plateletRhN_O: req.body.plateletRhN_O || existingHospitalData.plateletRhN_O,
        plateletRhN_AB: req.body.plateletRhN_AB || existingHospitalData.plateletRhN_AB,
        plateletRhN_B: req.body.plateletRhN_B || existingHospitalData.plateletRhN_B,
        plateletRhN_A: req.body.plateletRhN_A || existingHospitalData.plateletRhN_A,

        // Update Red Blood Cells Rh positive types
        rbcP_O: req.body.rbcP_O || existingHospitalData.rbcP_O,
        rbcP_AB: req.body.rbcP_AB || existingHospitalData.rbcP_AB,
        rbcP_B: req.body.rbcP_B || existingHospitalData.rbcP_B,
        rbcP_A: req.body.rbcP_A || existingHospitalData.rbcP_A,

        // Update Red Blood Cells Rh negative types
        rbcN_O: req.body.rbcN_O || existingHospitalData.rbcN_O,
        rbcN_AB: req.body.rbcN_AB || existingHospitalData.rbcN_AB,
        rbcN_B: req.body.rbcN_B || existingHospitalData.rbcN_B,
        rbcN_A: req.body.rbcN_A || existingHospitalData.rbcN_A,
    };

    const hospital = await prisma.hospital.update({
        where: {
            id: req.query.id as string
        },
        data: updatedData
    });

    res.status(200).json({ message: 'Hospital updated successfully', hospital });
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