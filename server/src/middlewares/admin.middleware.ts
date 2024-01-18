import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/auth-exception";
import { ErrorCode } from "../exceptions/root";
import { InternalException } from "../exceptions/internal-errors";


export const adminMiddleware = (req:Request, res:Response, next:NextFunction) => {
    try {
        // @ts-ignore
        const user = req.user
        if(user?.role === "ADMIN") {
            next()
        } else {
            return next(new UnauthorizedException("Unauthorized access", ErrorCode.UNAUTHORIZED))
        }
    } catch (error:any) {
        return next(new InternalException("Something went wrong", ErrorCode.INTERNAL_EXCEPTION, error))
    }
}