import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller";
import { errorHandler } from '../errorHandler';
import authMiddleWare from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const productRouter:Router = Router();

productRouter.post('/create-product',[authMiddleWare, adminMiddleware], errorHandler(createProduct))
productRouter.post('/update-product/:id',[authMiddleWare, adminMiddleware], errorHandler(updateProduct))
productRouter.delete('/delete-product/:id',[authMiddleWare, adminMiddleware], errorHandler(deleteProduct))
productRouter.get('/get-product/:id', errorHandler(getProductById))
productRouter.get('/all-products',errorHandler(getAllProducts))

export default productRouter