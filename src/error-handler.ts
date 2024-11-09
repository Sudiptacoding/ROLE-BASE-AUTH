import { NextFunction, Request, Response } from "express"
import { ErrorCode, HttpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-exception"

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
           await method(req, res, next)
        } catch (error: any) {
            let exceptions: HttpException;
            if (error instanceof HttpException) {
                exceptions = error;
            }else{
                exceptions = new InternalException('Something want wrong !' , error , ErrorCode.INTERNAL_EXCEPTION)
            }
            next(exceptions)
        }
    }
}