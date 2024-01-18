import { Router } from "express";
import { addAddress, deleteAddress, getAllAddresses } from "../controllers/addresses.controllers";
import { errorHandler } from '../errorHandler';
import authMiddleWare from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const addressRouter:Router = Router();

addressRouter.post('/create-address',[authMiddleWare, adminMiddleware], errorHandler(addAddress))
addressRouter.post('/delete-address',[authMiddleWare, adminMiddleware] ,errorHandler(deleteAddress))
addressRouter.get('all-addresses',[authMiddleWare, adminMiddleware], errorHandler(getAllAddresses))


export default addressRouter