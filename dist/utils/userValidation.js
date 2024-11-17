"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordReset = exports.validateEmail = exports.validateOTP = exports.validateUpdateUserInfo = exports.validateUserSignUp = exports.validateUserSignIn = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    next();
});
exports.handleValidationErrors = handleValidationErrors;
exports.validateUserSignIn = [
    (0, express_validator_1.body)('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isStrongPassword()
        .withMessage('Password must be at least 6 characters with an Upper case character, lower case character, symbol and digit.'),
    exports.handleValidationErrors
];
exports.validateUserSignUp = [
    (0, express_validator_1.body)('firstName')
        .isString()
        .withMessage('First name must be a string')
        .isLength({ min: 2 })
        .withMessage('First name is required'),
    (0, express_validator_1.body)('lastName')
        .isString()
        .withMessage('Last name must be a string')
        .isLength({ min: 2 })
        .withMessage('Last name is required'),
    (0, express_validator_1.body)('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('phone')
        .not()
        .isEmpty()
        .withMessage('Phone number is required')
        .isLength({ min: 10, max: 10 })
        .withMessage('Invalid phone number'),
    exports.handleValidationErrors
];
exports.validateUpdateUserInfo = [
    (0, express_validator_1.body)('firstName')
        .isString()
        .withMessage('First name must be a string')
        .isLength({ min: 2 })
        .withMessage('First name is required'),
    (0, express_validator_1.body)('lastName')
        .isString()
        .withMessage('Last name must be a string')
        .isLength({ min: 2 })
        .withMessage('Last name is required'),
    (0, express_validator_1.body)('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('phone')
        .not()
        .isEmpty()
        .withMessage('Phone number is required')
        .isLength({ min: 10, max: 10 })
        .withMessage('Invalid phone number'),
    (0, express_validator_1.body)('code')
        .optional()
        .isString()
        .isLength({ min: 6, max: 6 })
        .withMessage('Invalid code, payment code must be 6 characters long'),
    (0, express_validator_1.body)('province').optional().isString(),
    (0, express_validator_1.body)('district').optional().isString(),
    (0, express_validator_1.body)('sector').optional().isString(),
    exports.handleValidationErrors
];
exports.validateOTP = [
    (0, express_validator_1.body)('otp')
        .isLength({ min: 6, max: 6 })
        .withMessage('Invalid otp'),
    exports.handleValidationErrors
];
exports.validateEmail = [
    (0, express_validator_1.body)('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email'),
    exports.handleValidationErrors
];
exports.validatePasswordReset = [
    (0, express_validator_1.body)('password')
        .not()
        .isEmpty()
        .withMessage('Password must be provided')
        .isStrongPassword()
        .withMessage('Password must be at least 6 characters with an Upper case character, lower case character, symbol and digit.'),
    exports.handleValidationErrors
];
