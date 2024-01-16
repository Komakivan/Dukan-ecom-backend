import { NextFunction, Request, Response } from "express"
import HttpException, { ErrorCode } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-errors"

// custom error handler to wrap all controllers so that "try{} catch(){}" can be skipped in the controllers
// its asynchronou: takes in a controller as an argument and returns a controller
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