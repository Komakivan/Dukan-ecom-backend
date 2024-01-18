import { Router } from "express";
import { authRouter } from "./auth.routes";
import productRouter from "./products.routes";

// root router configuration
const rootRouter:Router = Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/products', productRouter)

export default rootRouter;