"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const CustomError_js_1 = __importDefault(require("./CustomError.js"));
/**
 * @class
 * @classdesc Custom error class for 404 Not Found responses.
 * @extends {CustomError}
 */
class NotFoundError extends CustomError_js_1.default {
    /**
     * Creates a new NotFoundError instance.
     * @param {string} message - Error message.
     */
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
