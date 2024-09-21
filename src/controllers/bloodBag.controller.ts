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
            amountInLitres: parseFloat(req.body.amountInLitres),
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

export const updateBloodBag = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    const {
        bloodType,
        bloodGroup,
        rhesis,
        bloodQuality,
        amountInLitres,
        bloodBankId
    } = req.body;

    // Fetch the existing blood bag for updates
    const existingBloodBag = await prisma.bloodBag.findUnique({ where: { id: id as string } });

    if (!existingBloodBag) {
        return res.status(404).json({ message: 'Blood bag not found' });
    }

    // Update expiration date based on the new blood type
    let expirationDate = new Date();
    if (bloodType === "Plasma") {
        expirationDate.setDate(expirationDate.getDate() + 265);
    } else if (bloodType === "Platelet") {
        expirationDate.setDate(expirationDate.getDate() + 5);
    } else if (bloodType === "Whole Blood") {
        expirationDate.setDate(expirationDate.getDate() + 35);
    } else if (bloodType === "Red Blood Cells") {
        expirationDate.setDate(expirationDate.getDate() + 42);
    }

    // Update blood bag details
    const updatedBloodBag = await prisma.bloodBag.update({
        where: { id: id as string },
        data: {
            bloodType: bloodType || existingBloodBag.bloodType,
            bloodGroup: bloodGroup || existingBloodBag.bloodGroup,
            rhesis: rhesis || existingBloodBag.rhesis,
            bloodQuality: bloodQuality || existingBloodBag.bloodQuality,
            amountInLitres: amountInLitres || existingBloodBag.amountInLitres,
            expirationDate: expirationDate,
            bloodBankId: bloodBankId || existingBloodBag.bloodBankId
        }
    });

    // If the blood bag's type or group changed, update the blood bank stock accordingly
    if (
        updatedBloodBag.bloodType !== existingBloodBag.bloodType ||
        updatedBloodBag.bloodGroup !== existingBloodBag.bloodGroup ||
        updatedBloodBag.rhesis !== existingBloodBag.rhesis
    ) {
        const bloodBank = await prisma.bloodBank.findUnique({
            where: { id: bloodBankId || existingBloodBag.bloodBankId }
        });

        if (bloodBank) {
            // Decrease the stock for the old blood bag type
            if (existingBloodBag.bloodType === "Red Blood Cells") {
                decreaseRbcStock(bloodBank, existingBloodBag);
            } else if (existingBloodBag.bloodType === "Plasma") {
                decreasePlasmaStock(bloodBank, existingBloodBag);
            } else if (existingBloodBag.bloodType === "Platelet") {
                decreasePlateletStock(bloodBank, existingBloodBag);
            } else if (existingBloodBag.bloodType === "Whole Blood") {
                decreaseWholeBloodStock(bloodBank, existingBloodBag);
            }

            // Increase the stock for the new blood bag type
            if (updatedBloodBag.bloodType === "Red Blood Cells") {
                updateRbcStock(bloodBank, updatedBloodBag);
            } else if (updatedBloodBag.bloodType === "Plasma") {
                updatePlasmaStock(bloodBank, updatedBloodBag);
            } else if (updatedBloodBag.bloodType === "Platelet") {
                updatePlateletStock(bloodBank, updatedBloodBag);
            } else if (updatedBloodBag.bloodType === "Whole Blood") {
                updateWholeBloodStock(bloodBank, updatedBloodBag);
            }

            await prisma.bloodBank.update({
                where: { id: bloodBank.id },
                data: bloodBank
            });
        }
    }

    res.status(200).json({ message: 'Blood bag updated successfully', updatedBloodBag });
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

// Helper functions to decrease stock based on blood type and group
function decreaseRbcStock(bloodBank: any, bloodBag: any) {
    if (bloodBag.rhesis === 'P') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.rhP_O = Math.max((bloodBank.rhP_O || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.rhP_A = Math.max((bloodBank.rhP_A || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.rhP_B = Math.max((bloodBank.rhP_B || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.rhP_AB = Math.max((bloodBank.rhP_AB || 0) - 1, 0);
        }
    } else if (bloodBag.rhesis === 'N') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.rhN_O = Math.max((bloodBank.rhN_O || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.rhN_A = Math.max((bloodBank.rhN_A || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.rhN_B = Math.max((bloodBank.rhN_B || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.rhN_AB = Math.max((bloodBank.rhN_AB || 0) - 1, 0);
        }
    }
}

function decreasePlasmaStock(bloodBank: any, bloodBag: any) {
    if (bloodBag.rhesis === 'P') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.plasmaRhP_O = Math.max((bloodBank.plasmaRhP_O || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.plasmaRhP_A = Math.max((bloodBank.plasmaRhP_A || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.plasmaRhP_B = Math.max((bloodBank.plasmaRhP_B || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.plasmaRhP_AB = Math.max((bloodBank.plasmaRhP_AB || 0) - 1, 0);
        }
    } else if (bloodBag.rhesis === 'N') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.plasmaRhN_O = Math.max((bloodBank.plasmaRhN_O || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.plasmaRhN_A = Math.max((bloodBank.plasmaRhN_A || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.plasmaRhN_B = Math.max((bloodBank.plasmaRhN_B || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.plasmaRhN_AB = Math.max((bloodBank.plasmaRhN_AB || 0) - 1, 0);
        }
    }
}

function decreasePlateletStock(bloodBank: any, bloodBag: any) {
    if (bloodBag.rhesis === 'P') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.plateletRhP_O = Math.max((bloodBank.plateletRhP_O || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.plateletRhP_A = Math.max((bloodBank.plateletRhP_A || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.plateletRhP_B = Math.max((bloodBank.plateletRhP_B || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.plateletRhP_AB = Math.max((bloodBank.plateletRhP_AB || 0) - 1, 0);
        }
    } else if (bloodBag.rhesis === 'N') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.plateletRhN_O = Math.max((bloodBank.plateletRhN_O || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.plateletRhN_A = Math.max((bloodBank.plateletRhN_A || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.plateletRhN_B = Math.max((bloodBank.plateletRhN_B || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.plateletRhN_AB = Math.max((bloodBank.plateletRhN_AB || 0) - 1, 0);
        }
    }
}

function decreaseWholeBloodStock(bloodBank: any, bloodBag: any) {
    if (bloodBag.rhesis === 'P') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.rhP_O = Math.max((bloodBank.rhP_O || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.rhP_A = Math.max((bloodBank.rhP_A || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.rhP_B = Math.max((bloodBank.rhP_B || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.rhP_AB = Math.max((bloodBank.rhP_AB || 0) - 1, 0);
        }
    } else if (bloodBag.rhesis === 'N') {
        if (bloodBag.bloodGroup === 'O') {
            bloodBank.rhN_O = Math.max((bloodBank.rhN_O || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'A') {
            bloodBank.rhN_A = Math.max((bloodBank.rhN_A || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'B') {
            bloodBank.rhN_B = Math.max((bloodBank.rhN_B || 0) - 1, 0);
        } else if (bloodBag.bloodGroup === 'AB') {
            bloodBank.rhN_AB = Math.max((bloodBank.rhN_AB || 0) - 1, 0);
        }
    }
}
