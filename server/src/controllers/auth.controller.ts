import { NextFunction, Request, Response} from 'express'
import { prismaClient } from '../server'
import { compareSync, hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../secrets';
import { BadRequestException } from '../exceptions/bad-requests';
import { ErrorCode } from '../exceptions/root';


/**
 * 
 * @param req {Object} Request - Request object
 * @param res {Object} Response - Response object
 */
const registerUser = async  (req: Request, res: Response, next:NextFunction) => {
    try {
        const { name, email, password } = req.body
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
    } catch (error: any) {
        console.log("Problem creating user", error)
    }
}



/**
 * 
 * @param req {object} - Request object
 * @param res {object} - Response object
 */

const loginUser = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const { email, password } = req.body;
        // find the user from the database
        const user = await prismaClient.user.findFirst({where: {email:email}})
        if(!user) {
            return  next(new BadRequestException("User does not exist", ErrorCode.USER_NOT_FOUND))
            // return res.status(404).json({message: "user not found"})
        }
        // compare the password
        const isPasswordMatch = compareSync(password, user.password)
        if(!isPasswordMatch) {
            return next(new BadRequestException("incorrect password", ErrorCode.INCORRECT_PASSWORD))
        }
        // generate a token
        const token = jwt.sign({userId: user.id}, JWT_SECRET_KEY, { expiresIn: "15m"})
        res.status(200).json({user, token})
    } catch (error) {
        res.status(500).json({message: "Error signing in", error})
    }
}




export { loginUser, registerUser }