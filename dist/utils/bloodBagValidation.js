"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBloodBag = void 0;
const express_validator_1 = require("express-validator");
const userValidation_1 = require("./userValidation");
exports.validateBloodBag = [
    (0, express_validator_1.body)('bloodType')
        .isString()
        .withMessage('Blood type must be a string')
        .isIn(['Plasma', 'Platelet', 'Whole Blood', 'Red Blood Cells'])
        .withMessage('Invalid blood type, accepted values are: Plasma, Platelet, Whole Blood, Red Blood Cells'),
    (0, express_validator_1.body)('bloodGroup')
        .isString()
        .withMessage('Blood group must be a string')
        .isIn(['O', 'A', 'B', 'AB'])
        .withMessage('Invalid blood group, accepted values are: O, A, B, AB'),
    (0, express_validator_1.body)('rhesis')
        .isString()
        .withMessage('Rhesis must be a string')
        .isIn(['P', 'N'])
        .withMessage('Rhesis must be either P (positive) or N (negative)'),
    (0, express_validator_1.body)('bloodQuality')
        .isString()
        .withMessage('Blood quality must be a string')
        .isIn(['Good', 'Moderate', 'Expired'])
        .withMessage('Blood quality must be either Good, Moderate, or Poor'),
    userValidation_1.handleValidationErrors
];
