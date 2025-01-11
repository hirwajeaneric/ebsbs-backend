"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bloodBankRouter = express_1.default.Router();
const bloodBankValidation_1 = require("../utils/bloodBankValidation");
const bloodbank_controller_1 = require("../controllers/bloodbank.controller");
bloodBankRouter.post('/add', bloodBankValidation_1.validateCreateBloodBank, bloodbank_controller_1.createBloodBank);
bloodBankRouter.put('/update', bloodbank_controller_1.updateBloodBank);
bloodBankRouter.delete('/delete', bloodbank_controller_1.deleteBloodBank);
bloodBankRouter.get('/list', bloodbank_controller_1.getAllBloodBanks);
bloodBankRouter.get('/findById', bloodbank_controller_1.getBloodBank);
bloodBankRouter.get('/getAdminOverviewData', bloodbank_controller_1.adminOverviewData);
bloodBankRouter.get('/recorderOverviewData', bloodbank_controller_1.recorderOverviewData);
exports.default = bloodBankRouter;
