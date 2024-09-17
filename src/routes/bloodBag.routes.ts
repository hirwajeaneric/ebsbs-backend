import express from 'express';
const bloodBagRouter = express.Router();
import { validateBloodBag } from '../utils/bloodBagValidation';
import { createBloodBag, deleteBloodBag, getAllBloodBags, getBloodBag, getAllBloodBagsInBloodBank, getAllBloodBagsInHospital} from '../controllers/bloodBag.controller';


bloodBagRouter.post('/add', validateBloodBag, createBloodBag);
bloodBagRouter.delete('/delete', deleteBloodBag);
bloodBagRouter.get('/list', getAllBloodBags);
bloodBagRouter.get('/findById', getBloodBag);
bloodBagRouter.get('/listInBloodBank', getAllBloodBagsInBloodBank);
bloodBagRouter.get('/listInHospital', getAllBloodBagsInHospital);

export default bloodBagRouter;
