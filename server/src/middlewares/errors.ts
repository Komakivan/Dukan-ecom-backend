import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/root";

// this enables express to pick up the custom errors
export const errorMiddleWare = (error: HttpException, req:Request, res:Response,next:NextFunction) => {
    res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode,
        errors: error.errors
    })

    next()
}