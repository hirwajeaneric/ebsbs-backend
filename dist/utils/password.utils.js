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
exports.ValidateAdmin = exports.isTokenValid = exports.ValidateToken = exports.GenerateToken = exports.GeneratePassword = exports.GenerateSalt = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY;
;
/**
 * This function generates a salt to be used to generate passwords.
 * @returns salt string
 */
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.genSalt();
});
exports.GenerateSalt = GenerateSalt;
/**
 *
 * @param password new password
 * @param salt given salt number
 * @returns a password in form of a hashed password.
 */
const GeneratePassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.hash(password, salt);
});
exports.GeneratePassword = GeneratePassword;
/**
 * Generates a signature token to be used to let a user logged in or do a specific activity once logged in.
 * @param payload an object that contains some information about the logged in user.
 * @returns signature string of text (a jwt token)
 */
const GenerateToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: "1d" }); // Other possible time of expiration formats are: 30m, 1h, 1d,...
});
exports.GenerateToken = GenerateToken;
/**
 * Validates a user signature to determind if a user sending a request is authorized.
 * It recieves the server request and returns a boolean value indicating whether the user is authorized or not.
 * @param req
 * @returns true | false
 */
const ValidateToken = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.get('Authorization');
    if (signature) {
        const token = signature.split(' ')[1];
        if (token === undefined || !token || token === '') {
            return false;
        }
        else {
            const payload = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            if (payload.accountStatus === "Inactive") {
                return false;
            }
            req.user = payload;
            return true;
        }
    }
});
exports.ValidateToken = ValidateToken;
const isTokenValid = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.get('Authorization');
    if (signature) {
        const payload = jsonwebtoken_1.default.verify(signature.split(' ')[1], SECRET_KEY);
        req.user = payload;
        const now = Date.now() / 1000; // Convert to seconds for consistency
        if (payload.exp < now) {
            return false;
        }
        return true;
    }
});
exports.isTokenValid = isTokenValid;
const ValidateAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.get('Authorization');
    if (signature) {
        const payload = jsonwebtoken_1.default.verify(signature.split(' ')[1], SECRET_KEY);
        req.user = payload;
        return true;
    }
});
exports.ValidateAdmin = ValidateAdmin;
