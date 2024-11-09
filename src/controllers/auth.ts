import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";

// import { ReqTyp } from "../types/express";
import { NotFoundException } from "../exceptions/not-found";



export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;
        let user = await prismaClient.user.findFirst({ where: { email } });

        if (user) {
            return next(new BadRequestsException('User already exists', ErrorCode.USER_ALREADY_EXISTS));
        }

        user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10)
            }
        });
        console.log(user)
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);

        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: false,
            maxAge: 60 * 60 * 1000, // 1 hour
            sameSite: 'lax' // Prevents CSRF by only sending the cookie to the same site
        });





        res.json({ user, token }); // Optionally send user info
    } catch (error) {
        next(error); // Pass any unexpected errors to the middleware
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    try {
        const { email, password } = req.body;

        let user = await prismaClient.user.findFirst({ where: { email } });

        if (!user) {
            return next(new BadRequestsException('User does not exist', ErrorCode.USER_NOT_FOUND));
        }

        if (!compareSync(password, user.password)) {
            return next(new BadRequestsException('Incorrect password', ErrorCode.INCORRECT_PASSWORD));
        }

        // const token = jwt.sign({ userId: user.id }, JWT_SECRET);

        // Change this


        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);


        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        });

        res.json({ message: 'Logged in successfully', token });
    } catch (error) {
        next(error); // Pass any unexpected errors to the middleware
    }
};

// Current user endpoint
export const me = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        res.json(req.user); // Return the authenticated user's information
    } else {
        return next(new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND));
    }
};


// Current user endpoint
export const allUser = async (req: Request, res: Response, next: NextFunction) => {
    const users = await prismaClient.user.findMany()
    res.json({ users })
};
