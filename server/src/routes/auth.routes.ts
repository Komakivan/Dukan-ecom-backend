import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { errorHandle } from '../errorHandler';


// routes for authenticating users
const authRouter:Router = Router();

authRouter.post('/register', errorHandle(registerUser))
authRouter.post('/login', errorHandle(loginUser))


export { authRouter }