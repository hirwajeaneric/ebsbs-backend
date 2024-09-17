import { Request, Response, NextFunction } from "express";

import asyncWrapper from '../middlewares/AsyncWrapper';
import prisma from "../db/client";

export const createBloodBag = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    var expirationDate: Date = new Date();

    // Set expiration date based on blood type
    if (req.body.bloodType === "Plasma") {
        expirationDate = new Date(expirationDate.setDate(expirationDate.getDate() + 265));
    } else if (req.body.bloodType === "Platelet") {
        expirationDate = new Date(expirationDate.setDate(expirationDate.getDate() + 5));
    } else if (req.body.bloodType === "Whole Blood") {
        expirationDate = new Date(expirationDate.setDate(expirationDate.getDate() + 35));
    } else if (req.body.bloodType === "Red Blood Cells") {
        expirationDate = new Date(expirationDate.setDate(expirationDate.getDate() + 42));
    }

    // Generate 9-character code (e.g., first letter of bloodType, bloodGroup, rhesis, and last 6 digits of timestamp)
    const currentTimestamp = Date.now();
    const code = `${req.body.bloodType[0]}${req.body.bloodGroup}${req.body.rhesis}${currentTimestamp.toString().slice(-6)}`;

    // Create blood bag entry
    const bloodBag = await prisma.bloodBag.create({
        data: {
            bloodBankId: req.body.bloodBankId,
            bloodGroup: req.body.bloodGroup,
            rhesis: req.body.rhesis,
            bloodQuality: req.body.bloodQuality,
            bloodType: req.body.bloodType,
            expirationDate: expirationDate,
            amountInLitres: req.body.amountInLitres,
            code: code
        }
    });

    if (bloodBag) {
        const bloodBank = await prisma.bloodBank.findFirst({
            where: { id: bloodBag.bloodBankId }
        });

        if (bloodBank) {
            // Update BloodBag stock based on blood type and group
            if (bloodBag.bloodType === "Red Blood Cells") {
                updateRbcStock(bloodBank, bloodBag);
            } else if (bloodBag.bloodType === "Plasma") {
                updatePlasmaStock(bloodBank, bloodBag);
            } else if (bloodBag.bloodType === "Platelet") {
                updatePlateletStock(bloodBank, bloodBag);
            } else if (bloodBag.bloodType === "Whole Blood") {
                updateWholeBloodStock(bloodBank, bloodBag);
            }

            const { id, ...rest } = bloodBank;

            await prisma.bloodBank.update({
                where: { id: id },
                data: rest
            });
        }
    }

    res.status(201).json({ message: 'Blood bag added', bloodBag });
});

export const getBloodBag = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBag = await prisma.bloodBag.findFirst({
        where: {
            id: req.query.id as string
        }
    });

    if (!bloodBag) {
        return res.status(404).json({ message: 'Blood bag not found' });
    }

    res.status(200).json({ bloodBag });
});

export const getAllBloodBags = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBags = await prisma.bloodBag.findMany();
    res.status(200).json({ bloodBags });
});

export const getAllBloodBagsInBloodBank = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBags = await prisma.bloodBag.findMany({
        where: {
            bloodBankId: req.query.id as string
        }
    });
    res.status(200).json({ bloodBags });
});

export const getAllBloodBagsInHospital = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const bloodBags = await prisma.bloodBag.findMany({
        where: {
            hospitalId: req.query.id as string
        }
    });
    res.status(200).json({ bloodBags });
});

export const deleteBloodBag = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    await prisma.bloodBag.delete({
        where: {
            id: req.query.id as string
        }
    });

    res.status(200).json({ message: 'Blood bag deleted successfully' });
});


// Helper functions to update blood stock levels based on blood type and group
function updateRbcStock(bloodBank: any, bloodBag: any) {
    if (bloodBag.rhesis === 'P') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.rhP_O = (bloodBank.rhP_O || 0) + 1;
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.rhP_A = (bloodBank.rhP_A || 0) + 1;
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.rhP_B = (bloodBank.rhP_B || 0) + 1;
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.rhP_AB = (bloodBank.rhP_AB || 0) + 1;
        }
    } else if (bloodBag.rhesis === 'N') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.rhN_O = (bloodBank.rhN_O || 0) + 1;
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.rhN_A = (bloodBank.rhN_A || 0) + 1;
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.rhN_B = (bloodBank.rhN_B || 0) + 1;
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.rhN_AB = (bloodBank.rhN_AB || 0) + 1;
        }
    }
}

function updatePlasmaStock(bloodBank: any, bloodBag: any) {
    if (bloodBag.rhesis === 'P') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.plasmaRhP_O = (bloodBank.plasmaRhP_O || 0) + 1;
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.plasmaRhP_A = (bloodBank.plasmaRhP_A || 0) + 1;
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.plasmaRhP_B = (bloodBank.plasmaRhP_B || 0) + 1;
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.plasmaRhP_AB = (bloodBank.plasmaRhP_AB || 0) + 1;
        }
    } else if (bloodBag.rhesis === 'N') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.plasmaRhN_O = (bloodBank.plasmaRhN_O || 0) + 1;
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.plasmaRhN_A = (bloodBank.plasmaRhN_A || 0) + 1;
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.plasmaRhN_B = (bloodBank.plasmaRhN_B || 0) + 1;
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.plasmaRhN_AB = (bloodBank.plasmaRhN_AB || 0) + 1;
        }
    }
}

function updatePlateletStock(bloodBank: any, bloodBag: any) {
    if (bloodBag.rhesis === 'P') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.plateletRhP_O = (bloodBank.plateletRhP_O || 0) + 1;
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.plateletRhP_A = (bloodBank.plateletRhP_A || 0) + 1;
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.plateletRhP_B = (bloodBank.plateletRhP_B || 0) + 1;
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.plateletRhP_AB = (bloodBank.plateletRhP_AB || 0) + 1;
        }
    } else if (bloodBag.rhesis === 'N') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.plateletRhN_O = (bloodBank.plateletRhN_O || 0) + 1;
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.plateletRhN_A = (bloodBank.plateletRhN_A || 0) + 1;
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.plateletRhN_B = (bloodBank.plateletRhN_B || 0) + 1;
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.plateletRhN_AB = (bloodBank.plateletRhN_AB || 0) + 1;
        }
    }
}

function updateWholeBloodStock(bloodBank: any, bloodBag: any) {
    if (bloodBag.rhesis === 'P') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.rhP_O = (bloodBank.rhP_O || 0) + 1;
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.rhP_A = (bloodBank.rhP_A || 0) + 1;
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.rhP_B = (bloodBank.rhP_B || 0) + 1;
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.rhP_AB = (bloodBank.rhP_AB || 0) + 1;
        }
    } else if (bloodBag.rhesis === 'N') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.rhN_O = (bloodBank.rhN_O || 0) + 1;
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.rhN_A = (bloodBank.rhN_A || 0) + 1;
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.rhN_B = (bloodBank.rhN_B || 0) + 1;
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.rhN_AB = (bloodBank.rhN_AB || 0) + 1;
        }
    }
}