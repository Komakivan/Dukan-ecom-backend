import { Router } from "express";
import { authRouter } from "./auth.routes";

const rootRouter:Router = Router()

rootRouter.use('/auth', authRouter)

export default rootRouter;