"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const CustomError_js_1 = __importDefault(require("./CustomError.js"));
/**
 * Custom error class for handling bad request errors.
 * @extends {CustomError} - Extends the CustomError class.
 */
class BadRequestError extends CustomError_js_1.default {
    /**
     * Constructor for the BadRequestError class.
     * @param {string} message - The error message to be displayed.
     */
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}
exports.BadRequestError = BadRequestError;
