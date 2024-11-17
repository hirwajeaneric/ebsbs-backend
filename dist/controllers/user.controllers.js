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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.verifyToken = exports.updateAccount = exports.resetPassword = exports.forgotPassword = exports.getHospitalAdminById = exports.getHospitalPharmacistById = exports.getBloodBankAdminById = exports.getBloodBankRecorderById = exports.listBloodBankEmployees = exports.findUserByHospitalId = exports.listHospitalEmployees = exports.listUsers = exports.addNewUser = exports.hospitalSignUp = exports.adminSignUp = exports.hospitalSignIn = exports.bloodBankSignIn = exports.test = void 0;
const AsyncWrapper_1 = __importDefault(require("../middlewares/AsyncWrapper"));
const client_1 = __importDefault(require("../db/client"));
const password_utils_1 = require("../utils/password.utils");
const notification_utils_1 = require("../utils/notification.utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.test = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Hello World');
}));
exports.bloodBankSignIn = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var existingUser = {};
    existingUser = yield client_1.default.admin.findFirst({ where: { email: req.body.email } });
    if (!existingUser) {
        existingUser = yield client_1.default.bloodBankRecorder.findFirst({ where: { email: req.body.email } });
    }
    if (!existingUser) {
        return res.status(404).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(req.body.password, existingUser.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (existingUser.accountStatus === "Inactive") {
        return res.status(401).json({ error: 'Account is inactive' });
    }
    const token = yield (0, password_utils_1.GenerateToken)({
        _id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        hospitalId: "None",
        accountStatus: existingUser.accountStatus,
        verified: existingUser.verified
    });
    const user = {
        id: existingUser.id,
        email: existingUser.email,
        phone: existingUser.phone,
        role: existingUser.role,
        accountStatus: existingUser.accountStatus,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        bloodBankId: existingUser.bloodBankId,
    };
    const cookieName = existingUser.role === "admin" ? "admin-access-token" : "recorder-access-token";
    res
        .cookie(cookieName, token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
        .status(200)
        .json({ message: 'Login successful', user, token });
}));
exports.hospitalSignIn = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var existingUser = {};
    existingUser = yield client_1.default.hospitalAdmin.findFirst({ where: { email: req.body.email } });
    if (!existingUser) {
        existingUser = yield client_1.default.hospitalWorker.findFirst({ where: { email: req.body.email } });
    }
    if (!existingUser) {
        return res.status(404).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(req.body.password, existingUser.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (existingUser.accountStatus === "Inactive") {
        return res.status(401).json({ message: 'Account is currently not active' });
    }
    const hospital = yield client_1.default.hospital.findUnique({ where: { id: existingUser.hospitalId } });
    const token = yield (0, password_utils_1.GenerateToken)({
        _id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        hospitalId: existingUser.hospitalId,
        accountStatus: existingUser.accountStatus,
        verified: existingUser.verified
    });
    const user = {
        id: existingUser.id,
        email: existingUser.email,
        phone: existingUser.phone,
        role: existingUser.role,
        hospitalId: existingUser.hospitalId,
        accountStatus: existingUser.accountStatus,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        hospitalName: hospital === null || hospital === void 0 ? void 0 : hospital.name
    };
    const cookieName = existingUser.role === "Hospital Admin" ? "hospital-admin-access-token" : "pharmacist-access-token";
    res
        .cookie(cookieName, token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
        .status(200)
        .json({ message: 'Login successful', user, token });
}));
exports.adminSignUp = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield client_1.default.admin.findFirst({
        where: {
            email: req.body.email
        }
    });
    if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
    }
    const hashedPassword = yield (0, password_utils_1.GeneratePassword)(req.body.password, 10);
    const user = yield client_1.default.admin.create({
        data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
        }
    });
    res.status(201).json({ message: 'Account created successfully', user });
}));
exports.hospitalSignUp = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield client_1.default.hospitalAdmin.findFirst({
        where: {
            email: req.body.email
        }
    });
    if (existingUser) {
        return res.status(409).json({ message: 'User account already exists' });
    }
    const hashedPassword = yield (0, password_utils_1.GeneratePassword)(req.body.password, 10);
    const user = yield client_1.default.hospitalAdmin.create({
        data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
        }
    });
    res.status(201).json({ message: 'Account created successfully', userId: user.id });
}));
exports.addNewUser = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var user = {};
    if (req.body.role === "Hospital Worker") {
        let existingUser = yield client_1.default.hospitalWorker.findFirst({
            where: {
                email: req.body.email
            }
        });
        if (existingUser) {
            return res.status(409).json({ message: 'User account already exists' });
        }
        const hashedPassword = yield (0, password_utils_1.GeneratePassword)(req.body.email, 10);
        user = yield client_1.default.hospitalWorker.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword,
                hospitalId: req.body.hospitalId
            }
        });
    }
    else if (req.body.role === "Blood Bank Recorder") {
        let existingUser = yield client_1.default.bloodBankRecorder.findFirst({
            where: {
                email: req.body.email
            }
        });
        if (existingUser) {
            return res.status(409).json({ message: 'User account already exists' });
        }
        const hashedPassword = yield (0, password_utils_1.GeneratePassword)(req.body.email, 10);
        user = yield client_1.default.bloodBankRecorder.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword,
                bloodBankId: req.body.bloodBankId
            }
        });
    }
    const token = yield (0, password_utils_1.GenerateToken)({
        _id: user.id,
        email: user.email,
        role: user.role,
        accountStatus: "Active"
    });
    yield client_1.default.token.create({
        data: {
            user: user.id,
            token,
            expirationDate: new Date(Date.now() + (1000 * 60 * 60))
        }
    });
    var emailBody = ``;
    if (user.role === "Hospital Worker") {
        emailBody = `Dear ${user.firstName} ${user.lastName},\n\nYour account has been created successfully. \n\nHere are your account credentials: \n\nEmail: ${user.email}\nClick this link to finish setting up your account: ${process.env.CLIENT_URL}/hauth/reset-password/${token}/${user.id}\n\nBest Regards,\nAdmin`;
    }
    else if (user.role === "Blood Bank Recorder") {
        emailBody = `Dear ${user.firstName} ${user.lastName},\n\nYour account has been created successfully. \n\nHere are your account credentials: \n\nEmail: ${user.email}\nClick this link to finish setting up your account: ${process.env.CLIENT_URL}/bauth/reset-password/${token}/${user.id}\n\nBest Regards,\nAdmin`;
    }
    yield (0, notification_utils_1.sendEmail)(req.body.email, 'Your account credentials', emailBody);
    res.status(201).json({ message: 'Account created successfully' });
}));
exports.listUsers = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hospitalAdmins = yield client_1.default.hospitalAdmin.findMany({ select: { email: true, firstName: true, lastName: true, role: true, id: true, accountStatus: true, hospitalId: true } });
    const hospitalWorkers = yield client_1.default.hospitalWorker.findMany({ select: { email: true, firstName: true, lastName: true, role: true, id: true, accountStatus: true, hospitalId: true } });
    const bloodBankRecorders = yield client_1.default.bloodBankRecorder.findMany({ select: { email: true, firstName: true, lastName: true, role: true, id: true, accountStatus: true } });
    const users = [...hospitalAdmins, ...hospitalWorkers, ...bloodBankRecorders];
    res.status(200).json({ users });
}));
exports.listHospitalEmployees = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hospitalWorkers = yield client_1.default.hospitalWorker.findMany({
        where: {
            hospitalId: req.query.hospitalId
        }
    });
    res.status(200).json({ hospitalWorkers });
}));
exports.findUserByHospitalId = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hospitalAdmin = yield client_1.default.hospitalAdmin.findFirst({
        where: {
            hospitalId: req.query.hospitalId
        }
    });
    res.status(200).json({ hospitalAdmin });
}));
exports.listBloodBankEmployees = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bloodBankRecorders = yield client_1.default.bloodBankRecorder.findMany({
        where: {
            bloodBankId: req.query.bloodBankId
        }
    });
    res.status(200).json({ bloodBankRecorders });
}));
exports.getBloodBankRecorderById = (0, AsyncWrapper_1.default)(((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.default.bloodBankRecorder.findFirst({
        where: {
            id: req.query.id
        }
    });
    res.status(200).json({ user });
})));
exports.getBloodBankAdminById = (0, AsyncWrapper_1.default)(((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.default.admin.findFirst({
        where: {
            id: req.query.id
        }
    });
    res.status(200).json({ user });
})));
exports.getHospitalPharmacistById = (0, AsyncWrapper_1.default)(((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.default.hospitalWorker.findFirst({
        where: {
            id: req.query.id
        }
    });
    res.status(200).json({ user });
})));
exports.getHospitalAdminById = (0, AsyncWrapper_1.default)(((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.default.hospitalAdmin.findFirst({
        where: {
            id: req.query.id
        }
    });
    res.status(200).json({ user });
})));
exports.forgotPassword = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var user = {};
    user = yield client_1.default.hospitalAdmin.findFirst({ where: { email: req.body.email } });
    if (!user) {
        user = yield client_1.default.admin.findFirst({ where: { email: req.body.email } });
    }
    if (!user) {
        user = yield client_1.default.hospitalWorker.findFirst({ where: { email: req.body.email } });
    }
    if (!user) {
        user = yield client_1.default.bloodBankRecorder.findFirst({ where: { email: req.body.email } });
    }
    if (!user) {
        return res.status(404).json({ message: 'User with this email not found' });
    }
    const token = yield (0, password_utils_1.GenerateToken)({
        _id: user.id,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus
    });
    yield client_1.default.token.create({
        data: {
            user: user.id,
            token,
            expirationDate: new Date(Date.now() + (1000 * 60 * 60))
        }
    });
    var url = ``;
    if (user.role === "Hospital Worker") {
        url = `${process.env.CLIENT_URL}/hauth/reset-password/${token}/${user.id}`;
    }
    else if (user.role === "Blood Bank Recorder") {
        url = `${process.env.CLIENT_URL}/bauth/reset-password/${token}/${user.id}`;
    }
    else if (user.role === "Hospital Admin") {
        url = `${process.env.CLIENT_URL}/hauth/reset-password/${token}/${user.id}`;
    }
    else if (user.role === "Blood Bank Admin") {
        url = `${process.env.CLIENT_URL}/bauth/reset-password/${token}/${user.id}`;
    }
    yield (0, notification_utils_1.sendEmail)(user.email, 'Reset Password', `Click here to reset your password: ${url}`);
    console.log(url);
    res.status(200).json({ message: 'Password reset link sent to your email' });
}));
exports.resetPassword = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const isTokenValid = yield (0, password_utils_1.ValidateToken)(req);
    if (!isTokenValid) {
        return res.status(401).json({ message: 'Access Denied, Invalid or expired token.' });
    }
    var foundUser = {};
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "Hospital Worker") {
        foundUser = yield client_1.default.hospitalWorker.findFirst({ where: { id: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id } });
        foundUser.password = yield (0, password_utils_1.GeneratePassword)(req.body.password, 10);
        delete foundUser.id;
        yield client_1.default.hospitalWorker.update({
            where: { id: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id },
            data: foundUser
        });
        yield client_1.default.token.deleteMany({ where: { user: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id } });
        yield (0, notification_utils_1.sendEmail)(foundUser.email, 'Password Reset', `Your password has been reset.`);
        res.status(200).json({ message: 'Password reset successfully' });
    }
    else if (((_e = req.user) === null || _e === void 0 ? void 0 : _e.role) === "Blood Bank Recorder") {
        foundUser = yield client_1.default.bloodBankRecorder.findFirst({ where: { id: (_f = req.user) === null || _f === void 0 ? void 0 : _f._id } });
        foundUser.password = yield (0, password_utils_1.GeneratePassword)(req.body.password, 10);
        delete foundUser.id;
        yield client_1.default.bloodBankRecorder.update({
            where: { id: (_g = req.user) === null || _g === void 0 ? void 0 : _g._id },
            data: foundUser
        });
        yield client_1.default.token.deleteMany({ where: { user: (_h = req.user) === null || _h === void 0 ? void 0 : _h._id } });
        yield (0, notification_utils_1.sendEmail)(foundUser.email, 'Password Reset', `Your password has been reset.`);
        res.status(200).json({ message: 'Password reset successfully' });
    }
    else if (((_j = req.user) === null || _j === void 0 ? void 0 : _j.role) === "Hospital Admin") {
        foundUser = yield client_1.default.hospitalAdmin.findFirst({ where: { id: (_k = req.user) === null || _k === void 0 ? void 0 : _k._id } });
        foundUser.password = yield (0, password_utils_1.GeneratePassword)(req.body.password, 10);
        delete foundUser.id;
        yield client_1.default.hospitalAdmin.update({
            where: { id: (_l = req.user) === null || _l === void 0 ? void 0 : _l._id },
            data: foundUser
        });
        yield client_1.default.token.deleteMany({ where: { user: (_m = req.user) === null || _m === void 0 ? void 0 : _m._id } });
        yield (0, notification_utils_1.sendEmail)(foundUser.email, 'Password Reset', `Your password has been reset.`);
        res.status(200).json({ message: 'Password reset successfully' });
    }
    else if (((_o = req.user) === null || _o === void 0 ? void 0 : _o.role) === "Blood Bank Admin") {
        foundUser = yield client_1.default.admin.findUnique({ where: { id: (_p = req.user) === null || _p === void 0 ? void 0 : _p._id } });
        foundUser.password = yield (0, password_utils_1.GeneratePassword)(req.body.password, 10);
        delete foundUser.id;
        yield client_1.default.admin.update({
            where: { id: (_q = req.user) === null || _q === void 0 ? void 0 : _q._id },
            data: foundUser
        });
        yield client_1.default.token.deleteMany({ where: { user: (_r = req.user) === null || _r === void 0 ? void 0 : _r._id } });
        yield (0, notification_utils_1.sendEmail)(foundUser.email, 'Password Reset', `Your password has been reset.`);
        res.status(200).json({ message: 'Password reset successfully' });
    }
    if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
    }
}));
exports.updateAccount = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var updatedUser = {};
    var toBeUpdated = {};
    var hospital = {};
    if (req.body.role === "Hospital Worker") {
        toBeUpdated = yield client_1.default.hospitalWorker.findUnique({
            where: { id: req.query.id }
        });
        if (!toBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }
        toBeUpdated.firstName = req.body.firstName || toBeUpdated.firstName;
        toBeUpdated.lastName = req.body.lastName || toBeUpdated.lastName;
        toBeUpdated.phone = req.body.phone || toBeUpdated.phone;
        toBeUpdated.email = req.body.email || toBeUpdated.email;
        toBeUpdated.accountStatus = req.body.accountStatus || toBeUpdated.accountStatus;
        delete toBeUpdated.id;
        updatedUser = yield client_1.default.hospitalWorker.update({
            where: { id: req.query.id },
            data: toBeUpdated
        });
        hospital = yield client_1.default.hospital.findUnique({
            where: { id: toBeUpdated.hospitalId }
        });
    }
    if (req.body.role === "Blood Bank Recorder") {
        toBeUpdated = yield client_1.default.bloodBankRecorder.findUnique({
            where: { id: req.query.id }
        });
        if (!toBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }
        toBeUpdated.firstName = req.body.firstName || toBeUpdated.firstName;
        toBeUpdated.lastName = req.body.lastName || toBeUpdated.lastName;
        toBeUpdated.phone = req.body.phone || toBeUpdated.phone;
        toBeUpdated.email = req.body.email || toBeUpdated.email;
        toBeUpdated.accountStatus = req.body.accountStatus || toBeUpdated.accountStatus;
        delete toBeUpdated.id;
        updatedUser = yield client_1.default.bloodBankRecorder.update({
            where: { id: req.query.id },
            data: toBeUpdated
        });
    }
    if (req.body.role === "Hospital Admin") {
        toBeUpdated = yield client_1.default.hospitalAdmin.findUnique({
            where: { id: req.query.id }
        });
        if (!toBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }
        toBeUpdated.firstName = req.body.firstName || toBeUpdated.firstName;
        toBeUpdated.lastName = req.body.lastName || toBeUpdated.lastName;
        toBeUpdated.phone = req.body.phone || toBeUpdated.phone;
        toBeUpdated.email = req.body.email || toBeUpdated.email;
        toBeUpdated.accountStatus = req.body.accountStatus || toBeUpdated.accountStatus;
        delete toBeUpdated.id;
        updatedUser = yield client_1.default.hospitalAdmin.update({
            where: { id: req.query.id },
            data: toBeUpdated
        });
        hospital = yield client_1.default.hospital.findUnique({
            where: { id: toBeUpdated.hospitalId }
        });
    }
    if (req.body.role === "Blood Bank Admin") {
        toBeUpdated = yield client_1.default.admin.findUnique({
            where: { id: req.query.id }
        });
        if (!toBeUpdated) {
            return res.status(404).json({ message: 'User not found' });
        }
        toBeUpdated.firstName = req.body.firstName || toBeUpdated.firstName;
        toBeUpdated.lastName = req.body.lastName || toBeUpdated.lastName;
        toBeUpdated.phone = req.body.phone || toBeUpdated.phone;
        toBeUpdated.email = req.body.email || toBeUpdated.email;
        toBeUpdated.accountStatus = req.body.accountStatus || toBeUpdated.accountStatus;
        delete toBeUpdated.id;
        updatedUser = yield client_1.default.admin.update({
            where: { id: req.query.id },
            data: toBeUpdated
        });
    }
    res.status(200).json({
        message: 'Account Updated successfully',
        user: {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            accountStatus: updatedUser.accountStatus,
            role: updatedUser.role,
            id: updatedUser.id,
            hospitalId: updatedUser.hospitalId,
            bloodBankId: updatedUser.bloodBankId,
            hospitalName: hospital.name
        }
    });
}));
exports.verifyToken = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validToken = yield (0, password_utils_1.isTokenValid)(req);
    if (!validToken) {
        return res.status(401).json({ message: 'Access Denied' });
    }
    res.status(200).json({ message: 'Token is valid' });
}));
exports.deleteUser = (0, AsyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.query.id;
    const role = (_a = req.query) === null || _a === void 0 ? void 0 : _a.role;
    if (role === "Hospital Worker") {
        yield client_1.default.hospitalWorker.delete({ where: { id: userId } });
    }
    if (role === "Blood Bank Recorder") {
        yield client_1.default.bloodBankRecorder.delete({ where: { id: userId } });
    }
    if (role === "Hospital Admin") {
        yield client_1.default.hospitalAdmin.delete({ where: { id: userId } });
    }
    if (role === "Blood Bank Admin") {
        yield client_1.default.admin.delete({ where: { id: userId } });
    }
    res.status(200).json({ message: 'User deleted successfully' });
}));
