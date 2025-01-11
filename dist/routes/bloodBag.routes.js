"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bloodBagRouter = express_1.default.Router();
const bloodBagValidation_1 = require("../utils/bloodBagValidation");
const bloodBag_controller_1 = require("../controllers/bloodBag.controller");
bloodBagRouter.post('/add', bloodBagValidation_1.validateBloodBag, bloodBag_controller_1.createBloodBag);
bloodBagRouter.put('/update', bloodBag_controller_1.updateBloodBag);
bloodBagRouter.delete('/delete', bloodBag_controller_1.deleteBloodBag);
bloodBagRouter.get('/list', bloodBag_controller_1.getAllBloodBags);
bloodBagRouter.get('/findById', bloodBag_controller_1.getBloodBag);
bloodBagRouter.get('/listInBloodBank', bloodBag_controller_1.getAllBloodBagsInBloodBank);
bloodBagRouter.get('/listInHospital', bloodBag_controller_1.getAllBloodBagsInHospital);
exports.default = bloodBagRouter;
