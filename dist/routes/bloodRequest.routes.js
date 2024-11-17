"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bloodRequest_controller_1 = require("../controllers/bloodRequest.controller");
const bloodRequestRouter = express_1.default.Router();
bloodRequestRouter.post('/add', bloodRequest_controller_1.createRequest);
bloodRequestRouter.put('/update', bloodRequest_controller_1.updateBloodRequest);
bloodRequestRouter.delete('/delete', bloodRequest_controller_1.deleteRequest);
bloodRequestRouter.get('/list', bloodRequest_controller_1.listAllRequests);
bloodRequestRouter.get('/findById', bloodRequest_controller_1.findRequestById);
bloodRequestRouter.get('/findByHospital', bloodRequest_controller_1.findRequestsByHospitalId);
bloodRequestRouter.get('/findReceivedByHospital', bloodRequest_controller_1.findReceivedRequestsByHospitalId);
bloodRequestRouter.get('/findByBloodBank', bloodRequest_controller_1.findRequestsByBloodBankId);
exports.default = bloodRequestRouter;
