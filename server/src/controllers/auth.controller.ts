import { NextFunction, Request, Response} from 'express'
import { prismaClient } from '../server'
import { compareSync, hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../secrets';
import { BadRequestException } from '../exceptions/bad-requests';
import { ErrorCode } from '../exceptions/root';
import { loginSchema, registerSchema } from '../schema/users.validation';
import { NotFoundException } from '../exceptions/404.exception';
import { User } from '@prisma/client';


/**
 * 
 * @param req {Object} Request - Request object
 * @param res {Object} Response - Response object
 */
const registerUser = async  (req: Request, res: Response, next:NextFunction) => {
        const { name, email, password } = req.body
        // perform an input validatio
        registerSchema.parse(req.body)
        // check if user is already registered
        let user = await prismaClient.user.findFirst({ where: { email: email}})
        if(user) {
          return  next(new BadRequestException("User Already exists", ErrorCode.USER_ALREADY_EXIST))
            // return res.send(400).json({ message:"Already registered user"})
        }

        // create new user
        user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: hashSync(password,12)
            }
        })
        res.json(user)
}



/**
 * 
 * @param req {object} - Request object
 * @param res {object} - Response object
 */

const loginUser = async (req:Request, res:Response, next:NextFunction) => {
        const { email, password } = req.body;
        // validate the user input
        loginSchema.parse(req.body)
        // find the user from the database
        const user = await prismaClient.user.findFirst({where: {email:email}})
        if(!user) {
            return  next(new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND))
            // return res.status(404).json({message: "user not found"})
        }
        // compare the password
        const isPasswordMatch = compareSync(password, user.password)
        if(!isPasswordMatch) {
            return next(new BadRequestException("incorrect password", ErrorCode.INCORRECT_PASSWORD))
        }
        // generate a token
        const token = jwt.sign({userId: user.id}, JWT_SECRET_KEY, { expiresIn: "24h"})
        res.status(200).json({user, token})
    
}


/**
 * 
 * @param req {object} - Request object
 * @param res {object} - Response object
 */

// type AuthRequest = Request & { user?:User}

// returns the logged in user
const me = async (req:Request, res:Response, next:NextFunction) => {
    // @ts-ignore
    res.json(req.user)
    // res.json(req.user)

}




export { loginUser, registerUser, me }