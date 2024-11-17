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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ErrorHandler_1 = __importDefault(require("../middlewares/ErrorHandler"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
const bloodBank_routes_1 = __importDefault(require("../routes/bloodBank.routes"));
const hospital_routes_1 = __importDefault(require("../routes/hospital.routes"));
const bloodBag_routes_1 = __importDefault(require("../routes/bloodBag.routes"));
const bloodRequest_routes_1 = __importDefault(require("../routes/bloodRequest.routes"));
const notification_routes_1 = __importDefault(require("../routes/notification.routes"));
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({
        origin: [process.env.CLIENT_URL],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }));
    app.get("/health", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send({
            message: "Health OK!"
        });
    }));
    app.use('/api/v1/auth', user_routes_1.default);
    app.use('/api/v1/bloodbanks', bloodBank_routes_1.default);
    app.use('/api/v1/hospitals', hospital_routes_1.default);
    app.use('/api/v1/bloodbags', bloodBag_routes_1.default);
    app.use('/api/v1/bloodrequests', bloodRequest_routes_1.default);
    app.use('/api/v1/notifications', notification_routes_1.default);
    app.use(ErrorHandler_1.default);
    return app;
});
