import HttpException from "./root"

export class UnprocessableEntity extends HttpException {
    constructor(error:any,message:string,errorCode:number) { // order matters of arguments
        super(message,errorCode,422,error)
    }
}