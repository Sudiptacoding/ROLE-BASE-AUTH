// // src/middlewares/auth.ts
// import { NextFunction, Response } from "express";
// import { ReqTyp } from "../types/express"; // Adjust the import path according to your structure
// import { prismaClient } from "..";
// import { UnauthorizedException } from "../exceptions/unauthorized";
// import { ErrorCode } from "../exceptions/root";
// import * as jwt from 'jsonwebtoken'
// import { JWT_SECRET } from "../secrets";

// const authMiddleware = async (req: ReqTyp, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization;


//     if (!token) {
//         return next(new UnauthorizedException('Unauthorize', ErrorCode.UNAUTHORIZE_EXCEPTION));
//     }

//     try {

//         const payload = jwt.verify((token as string), JWT_SECRET) as any;
//         console.log(payload, 'unauthorized')

//         const user = await prismaClient.user.findFirst({
//             where: {
//                 id: payload.userId
//             }
//         });

//         console.log(user)

//         if (!user) {
//             return next(new UnauthorizedException('Unauthorize', ErrorCode.UNAUTHORIZE_EXCEPTION));
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         next(new UnauthorizedException('Unauthorize', ErrorCode.UNAUTHORIZE_EXCEPTION));
//     }
// };


// export default authMiddleware;





// src/middlewares/auth.ts
import { NextFunction, Response, Request } from "express";
import { prismaClient } from "..";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";

// Auth Middleware for Token Verification and User Retrieval
const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization;

    if (!token) {
        return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZE_EXCEPTION));
    }

    try {
        const payload = jwt.verify(token as string, JWT_SECRET) as { userId: number };
        
        const user = await prismaClient.user.findFirst({
            where: { id: payload.userId }
        });

        if (!user) {
            return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZE_EXCEPTION));
        }

        // @ts-ignore: attaching custom user property to the request
        req.user = user;
        next();
    } catch (error) {
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZE_EXCEPTION));
    }
};

// Role Authorization Middleware
export const authorizeRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {

        console.log(req.user)

        
        // @ts-ignore: checking user property on the request
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: "Access denied" });
        } else {
            next();
        }
    };
};

export default authMiddleware;

