import express from 'express';
const hospitalRouter = express.Router();
import { validateRegisterHospital } from '../utils/hospitalValidation';
import { createHospital, deleteHospital, getActiveHospitals, getAdminOverviewData, getAllHospitals, getHospital, getInactiveHospitals, getLabTechnitiansOverviewData, labTechnicianReportData, searchHospitalsAndBloodBanksByBlood, updateHospital } from '../controllers/hospital.controller';

hospitalRouter.post('/add', validateRegisterHospital, createHospital);
hospitalRouter.put('/update', updateHospital);
hospitalRouter.delete('/delete', deleteHospital);
hospitalRouter.get('/list', getAllHospitals);
hospitalRouter.get('/inactive', getInactiveHospitals);
hospitalRouter.get('/active', getActiveHospitals);
hospitalRouter.get('/findById', getHospital);
hospitalRouter.post('/search', searchHospitalsAndBloodBanksByBlood);
hospitalRouter.get('/admin-overview', getAdminOverviewData);
hospitalRouter.get('/labtech-overview', getLabTechnitiansOverviewData);
hospitalRouter.get('/pharmacistReportData', labTechnicianReportData);

export default hospitalRouter;

