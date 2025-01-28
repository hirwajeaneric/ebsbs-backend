import express from 'express';
const bloodBankRouter = express.Router();
import { validateCreateBloodBank } from '../utils/bloodBankValidation';
import { adminOverviewData, createBloodBank, deleteBloodBank, getAllBloodBanks, getBloodBank, recorderOverviewData, recorderReportData, updateBloodBank } from '../controllers/bloodbank.controller';


bloodBankRouter.post('/add', validateCreateBloodBank, createBloodBank);
bloodBankRouter.put('/update', updateBloodBank);
bloodBankRouter.delete('/delete', deleteBloodBank);
bloodBankRouter.get('/list', getAllBloodBanks);
bloodBankRouter.get('/findById', getBloodBank);
bloodBankRouter.get('/getAdminOverviewData', adminOverviewData);
bloodBankRouter.get('/recorderOverviewData', recorderOverviewData);
bloodBankRouter.get('/recorderReportData', recorderReportData);

export default bloodBankRouter;

