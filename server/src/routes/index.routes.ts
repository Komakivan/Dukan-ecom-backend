import { Router } from "express";
import { authRouter } from "./auth.routes";

// root router configuration
const rootRouter:Router = Router()

rootRouter.use('/auth', authRouter)

export default rootRouter;