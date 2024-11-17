"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userValidation_1 = require("../utils/userValidation");
const user_controllers_1 = require("../controllers/user.controllers");
const userRouter = express_1.default.Router();
userRouter.get('/test', user_controllers_1.test);
userRouter.get('/list', user_controllers_1.listUsers);
userRouter.get('/findByHospitalId', user_controllers_1.findUserByHospitalId);
userRouter.get('/listHospitalEmployees', user_controllers_1.listHospitalEmployees);
userRouter.get('/listBloodBankEmployees', user_controllers_1.listBloodBankEmployees);
userRouter.get('/findAdminById', user_controllers_1.getBloodBankAdminById);
userRouter.get('/findBloodBankRecorderById', user_controllers_1.getBloodBankRecorderById);
userRouter.get('/findHospitalPharmacistById', user_controllers_1.getHospitalPharmacistById);
userRouter.get('/findHospitalAdminById', user_controllers_1.getHospitalAdminById);
userRouter.post('/bloodbank-sign-in', userValidation_1.validateUserSignIn, user_controllers_1.bloodBankSignIn);
userRouter.post('/hospital-sign-in', userValidation_1.validateUserSignIn, user_controllers_1.hospitalSignIn);
userRouter.post('/add', userValidation_1.validateUserSignUp, user_controllers_1.addNewUser);
userRouter.post('/hospital-sign-up', userValidation_1.validateUserSignUp, user_controllers_1.hospitalSignUp);
userRouter.post('/admin-sign-up', userValidation_1.validateUserSignUp, user_controllers_1.adminSignUp);
userRouter.post('/forgot-password', userValidation_1.validateEmail, user_controllers_1.forgotPassword);
userRouter.post('/reset-password', userValidation_1.validatePasswordReset, user_controllers_1.resetPassword);
userRouter.put('/update-account', user_controllers_1.updateAccount);
userRouter.delete('/delete-account', user_controllers_1.deleteUser);
userRouter.post('/verify-token', userValidation_1.validateOTP, user_controllers_1.verifyToken);
exports.default = userRouter;
