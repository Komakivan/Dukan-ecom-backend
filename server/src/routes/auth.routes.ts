import { Router } from 'express';
import { loginUser, registerUser, me } from '../controllers/auth.controller';
import { errorHandler } from '../errorHandler';
import authMiddleWare from '../middlewares/auth.middleware';


// routes for authenticating users
const authRouter:Router = Router();

authRouter.post('/register', errorHandler(registerUser))
authRouter.post('/login', errorHandler(loginUser))
authRouter.get('/me', authMiddleWare, errorHandler(me))




export { authRouter }