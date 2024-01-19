import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/auth-exception";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from "../secrets";
import { prismaClient } from "../server";


/**
 * 
 * @param req - Request object
 * @param res - Response object
 * @param next - next Function
 */

// type AuthRequest  = Request & { user?: User}


const authMiddleWare = async (req:Request, res:Response, next:NextFunction) => {
    try {
        // grab the roken
        const token = req.headers.authorization?.split(" ")[1]
        if(!token) {
            return next(new UnauthorizedException("Unauthorized access +++", ErrorCode.UNAUTHORIZED))
        }
        // grab the payload
        const verified = jwt.verify(token, JWT_SECRET_KEY) as any
        const user = await prismaClient.user.findFirst({where: { id: verified.userId}})
        console.log(user)
        if(!user) {
            return next(new UnauthorizedException("Unauthorized access +++", ErrorCode.UNAUTHORIZED))
        }
        // @ts-ignore
        req.user = user
        // res.status(200).json({message: "Access granted"})
        next()
    } catch (error) {
        next(new UnauthorizedException("Unauthorized access ....", ErrorCode.UNAUTHORIZED))
    }
}

export default authMiddleWare