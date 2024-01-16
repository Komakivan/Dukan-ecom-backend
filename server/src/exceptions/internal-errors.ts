import HttpException from "./root";


export class InternalException extends HttpException {
    constructor(message: string, errors:any, errorCode: number) {
        // message, errorCode, statusCode, errors -> this is the order from HttpException
        super(message, errorCode,500,errors)
    }
}