import express from 'express';
import { addDoctor, adminLogin, getAdminDashboardStats } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from '../middlewares/authAdmin.js';
import { allDoctors } from '../controllers/adminController.js';
import { changeAvailability } from '../controllers/doctorController.js';
import { appointmentsAdmin } from '../controllers/adminController.js';
import { cancelAppointment } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor); //1st MW -> authenticating Admin, 2nd MW -> helper for receiving img file 
adminRouter.post('/login', adminLogin); 
adminRouter.get('/all-doctors', authAdmin, allDoctors); 
adminRouter.patch('/change-availability/:docId', authAdmin, changeAvailability); 
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, cancelAppointment);
adminRouter.get('/dashboard', authAdmin, getAdminDashboardStats); 


export default adminRouter;