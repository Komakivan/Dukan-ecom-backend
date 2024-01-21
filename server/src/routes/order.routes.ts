import { Router } from "express";
import authMiddleWare from "../middlewares/auth.middleware";
import { errorHandler } from "../errorHandler";
import { createOrder, listOrders, cancelOrder, getOderById } from "../controllers/order";

const orderRouter:Router = Router();

orderRouter.post("/create-order", authMiddleWare, errorHandler(createOrder))
orderRouter.get('/get-orders', authMiddleWare, errorHandler(listOrders));
orderRouter.post('/cancel-order/:id', authMiddleWare, errorHandler(cancelOrder));
orderRouter.get('/get-single-order/:id', authMiddleWare, errorHandler(getOderById))


export default orderRouter;
