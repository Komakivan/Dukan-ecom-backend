import HttpException, { ErrorCode } from "./root";


class BadRequestException extends HttpException {
    constructor(message: string, errorCode:ErrorCode) {
        super(message, errorCode,400,null);
    }
}


export { BadRequestException }