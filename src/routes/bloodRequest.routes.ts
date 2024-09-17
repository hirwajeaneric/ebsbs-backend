import express from 'express';
import { createRequest, deleteRequest, findRequestById, findRequestsByHospitalId, listAllRequests, updateBloodRequest } from '../controllers/bloodRequest';
const bloodRequestRouter = express.Router();

bloodRequestRouter.post('/add', createRequest);
bloodRequestRouter.put('/update', updateBloodRequest);
bloodRequestRouter.delete('/delete', deleteRequest);
bloodRequestRouter.get('/list', listAllRequests);
bloodRequestRouter.get('/findById', findRequestById);
bloodRequestRouter.get('/findByHospital', findRequestsByHospitalId);

export default bloodRequestRouter;