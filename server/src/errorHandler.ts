import { NextFunction, Request, Response } from "express"
import HttpException, { ErrorCode } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-errors"


 export const errorHandle = (method: Function) => {
    return async (req:Request, res:Response, next:NextFunction) => {
        try {
            await method(req, res, next)
        } catch (error:any) {
            let exception:HttpException;
            if(error instanceof HttpException) {
                exception = error
            } else {
                exception = new InternalException("something went wrong!",ErrorCode.INTERNAL_EXCEPTION, error)
            }
            next(exception)
        }
    }
}