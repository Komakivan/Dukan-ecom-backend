import HttpException, { ErrorCode } from "./root";


class BadRequestException extends HttpException {
    constructor(message: string, errorCode:ErrorCode) { // order of arguments matters
        super(message, errorCode,400,null);
    }
}


export { BadRequestException }