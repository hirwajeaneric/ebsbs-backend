"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandlerMiddleware = (err, req, res, next) => {
    var _a;
    let errStatus = err.statusCode || 500;
    let errMessage = err.message || "Internal Server Error";
    if (err.name === 'TokenExpiredError') {
        errMessage = "Token expired, please login again";
        errStatus = 401;
    }
    if (err.name === "ValidationError") {
        const errorMessages = (_a = err.details) === null || _a === void 0 ? void 0 : _a.map((detail) => detail.message); // Use optional chaining
        if (errorMessages) { // Check if messages exist before joining
            errMessage = errorMessages.join(",");
        }
        errStatus = 400;
    }
    if (err.code && err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        errMessage = `Duplicate value entered for ${field} field, please choose another value`;
        errStatus = 400;
    }
    if (err.name === "CastError") {
        errMessage = `No item found with id: ${err.value}`;
        errStatus = 404;
    }
    return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
};
exports.default = ErrorHandlerMiddleware;
