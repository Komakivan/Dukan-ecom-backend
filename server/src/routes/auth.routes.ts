import { Router } from 'express';
import { loginUser, registerUser, me } from '../controllers/auth.controller';
import { errorHandle } from '../errorHandler';
import authMiddleWare from '../middlewares/auth.middleware';


// routes for authenticating users
const authRouter:Router = Router();

authRouter.post('/register', errorHandle(registerUser))
authRouter.post('/login', errorHandle(loginUser))
authRouter.get('/me', authMiddleWare, errorHandle(me))




export { authRouter }