import { Router } from "express";
import { authRouter } from "./auth.routes";
import productRouter from "./products.routes";
import addressRouter from "./address.routes";

// root router configuration
const rootRouter:Router = Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/products', productRouter)
rootRouter.use('/address', addressRouter)

export default rootRouter;