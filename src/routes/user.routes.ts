import express from 'express';
import { validateEmail, validateOTP, validatePasswordReset, validateUpdateUserInfo, validateUserSignIn, validateUserSignUp } from '../utils/userValidation';
import { adminSignUp, bloodBankSignIn, forgotPassword, hospitalSignIn, hospitalSignUp, listBloodBankEmployees, listHospitalEmployees, listUsers, resetPassword, test, updateAccount, verifyToken } from '../controllers/user.controllers';
const userRouter = express.Router();

userRouter.get('/test', test);

userRouter.get('/list', listUsers);
userRouter.get('/listHospitalEmployees', listHospitalEmployees);
userRouter.get('/listBloodBankEmployees', listBloodBankEmployees);

userRouter.post('/bloodbank-sign-in', validateUserSignIn, bloodBankSignIn);
userRouter.post('/hospital-sign-in', validateUserSignIn, hospitalSignIn);

userRouter.post('/hospital-sign-up', validateUserSignUp, hospitalSignUp);
userRouter.post('/admin-sign-up', validateUserSignUp, adminSignUp);

userRouter.post('/forgot-password', validateEmail, forgotPassword);
userRouter.post('/reset-password', validatePasswordReset, resetPassword);

userRouter.put('/update-account', validateUpdateUserInfo, updateAccount);

userRouter.post('/verify-token', validateOTP, verifyToken);

export default userRouter;