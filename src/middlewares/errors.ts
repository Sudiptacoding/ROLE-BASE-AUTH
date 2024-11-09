import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/root";

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', error.message); // Logs the error on the server

    // Fallback status code if none provided in the exception
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        message: error.message,
        errorCode: error.errorCode || null,
        errors: error.errors || null
    });
};
