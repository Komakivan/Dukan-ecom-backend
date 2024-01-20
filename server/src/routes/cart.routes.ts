import { Router } from "express";
import authMiddleWare from "../middlewares/auth.middleware";
import { errorHandler } from "../errorHandler";
import { addItemToCart, changeQuantity, getCart, removeItemFromCart } from "../controllers/cart.controller";

const cartRouter:Router = Router();

cartRouter.post('/add-to-cart/:id', authMiddleWare, errorHandler(addItemToCart))
cartRouter.delete('/remove-from-cart/:id', authMiddleWare, errorHandler(removeItemFromCart))
cartRouter.get('/cart-items', authMiddleWare, errorHandler(getCart))
cartRouter.post('/update-quantity/:id', authMiddleWare, errorHandler(changeQuantity))


export default cartRouter