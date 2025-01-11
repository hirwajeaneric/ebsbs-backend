"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateBloodBank = void 0;
const express_validator_1 = require("express-validator");
const userValidation_1 = require("./userValidation");
exports.validateCreateBloodBank = [
    (0, express_validator_1.body)('name')
        .isString()
        .withMessage('Name of blood bank is required')
        .isLength({ min: 3 })
        .withMessage('Blood bank name must be at least 3 characters long'),
    (0, express_validator_1.body)('googleLocation')
        .isString()
        .withMessage('Google location of blood bank is required')
        .isLength({ min: 10 })
        .withMessage('Google location must be at least 10 characters long'),
    (0, express_validator_1.body)('phone')
        .isString()
        .withMessage('Phone number of blood bank is required')
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be 10 characters long'),
    (0, express_validator_1.body)('email')
        .isString()
        .withMessage('Email of blood bank is required')
        .isEmail()
        .withMessage('Invalid email'),
    (0, express_validator_1.body)('province')
        .isString()
        .withMessage('Province of blood bank is required')
        .isLength({ min: 3 })
        .withMessage('Province must be at least 3 characters long'),
    (0, express_validator_1.body)('town')
        .isString()
        .withMessage('Town of blood bank is required')
        .isLength({ min: 3 })
        .withMessage('Town must be at least 3 characters long'),
    (0, express_validator_1.body)('POBox')
        .isString()
        .withMessage('PO Box of blood bank is required')
        .isLength({ min: 7 })
        .withMessage('PO Box must be at least 7 characters long'),
    userValidation_1.handleValidationErrors
];
