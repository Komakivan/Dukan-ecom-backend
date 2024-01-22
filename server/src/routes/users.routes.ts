import { Router } from "express";
import { 
    addAddress,
    changeUserRole,
    deleteAddress,
    getAllAddresses, 
    getUserById, 
    listAllUser,
    updateUser } from "../controllers/users.controllers";
import { errorHandler } from '../errorHandler';
import authMiddleWare from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { changeStatus, listAllOrders, listOrderByUser } from "../controllers/order";

const usersRouter:Router = Router();

usersRouter.post('/create-address',[authMiddleWare], errorHandler(addAddress))
usersRouter.delete('/delete-address/:id',[authMiddleWare] ,errorHandler(deleteAddress))
usersRouter.get('/all-addresses',[authMiddleWare], errorHandler(getAllAddresses))
usersRouter.post('/update-user',[authMiddleWare], errorHandler(updateUser))
usersRouter.get('/all-users', [authMiddleWare, adminMiddleware], errorHandler(listAllUser))
usersRouter.post('/role/:id', [authMiddleWare, adminMiddleware], errorHandler(changeUserRole))
usersRouter.get('/get-user/:id', [authMiddleWare, adminMiddleware], errorHandler(getUserById))
usersRouter.get('/all-orders', [authMiddleWare, adminMiddleware], errorHandler(listAllOrders))
usersRouter.post('/change-status/:id', [authMiddleWare, adminMiddleware], errorHandler(changeStatus))
usersRouter.get('/orders-by-user/:id', [authMiddleWare, adminMiddleware], errorHandler(listOrderByUser))

export default usersRouter