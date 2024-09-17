import express from 'express';
const hospitalRouter = express.Router();
import { validateRegisterHospital } from '../utils/hospitalValidation';
import { createHospital, deleteHospital, getAllHospitals, getHospital, getInactiveHospitals, updateHospital } from '../controllers/hospital.controller';


hospitalRouter.post('/add', validateRegisterHospital, createHospital);
hospitalRouter.put('/update', updateHospital);
hospitalRouter.delete('/delete', deleteHospital);
hospitalRouter.get('/list', getAllHospitals);
hospitalRouter.get('/inactive', getInactiveHospitals);
hospitalRouter.get('/findById', getHospital);

export default hospitalRouter;

