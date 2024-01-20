import { Router } from "express";
import { authRouter } from "./auth.routes";
import productRouter from "./products.routes";
import addressRouter from "./address.routes";
import cartRouter from "./cart.routes";

// root router configuration
const rootRouter:Router = Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/products', productRouter)
rootRouter.use('/address', addressRouter)
rootRouter.use('/cart', cartRouter)

export default rootRouter;