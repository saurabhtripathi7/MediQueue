import express from 'express';
import { addDoctor, adminLogin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from '../middlewares/authAdmin.js';
import { allDoctors } from '../controllers/adminController.js';
import { changeAvailability } from '../controllers/doctorController.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor); //1st MW -> authenticating Admin, 2nd MW -> helper for receiving img file 
adminRouter.post('/login', adminLogin); // Admin login route
adminRouter.get('/all-doctors', authAdmin, allDoctors); // Protected route to get all doctors list
adminRouter.patch('/change-availability/:docId', authAdmin, changeAvailability); // Protected route to change doctor's availability

export default adminRouter;