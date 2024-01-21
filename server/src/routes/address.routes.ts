import { Router } from "express";
import { addAddress, deleteAddress, getAllAddresses, updateUser } from "../controllers/users.controllers";
import { errorHandler } from '../errorHandler';
import authMiddleWare from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const addressRouter:Router = Router();

addressRouter.post('/create-address',[authMiddleWare], errorHandler(addAddress))
addressRouter.delete('/delete-address/:id',[authMiddleWare] ,errorHandler(deleteAddress))
addressRouter.get('/all-addresses',[authMiddleWare], errorHandler(getAllAddresses))
addressRouter.post('/update-user',[authMiddleWare], errorHandler(updateUser))


export default addressRouter