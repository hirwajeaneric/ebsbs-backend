import express from 'express';
import { createRequest, deleteRequest, findReceivedRequestsByHospitalId, findRequestById, findRequestsByBloodBankId, findRequestsByHospitalId, listAllRequests, updateBloodRequest } from '../controllers/bloodRequest.controller';
const bloodRequestRouter = express.Router();

bloodRequestRouter.post('/add', createRequest);
bloodRequestRouter.put('/update', updateBloodRequest);
bloodRequestRouter.delete('/delete', deleteRequest);
bloodRequestRouter.get('/list', listAllRequests);
bloodRequestRouter.get('/findById', findRequestById);
bloodRequestRouter.get('/findByHospital', findRequestsByHospitalId);
bloodRequestRouter.get('/findReceivedByHospital', findReceivedRequestsByHospitalId);
bloodRequestRouter.get('/findByBloodBank', findRequestsByBloodBankId);

export default bloodRequestRouter;