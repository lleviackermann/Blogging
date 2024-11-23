import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { AuthRequest } from "../../types/app";

export const verifyJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("verify jwt");
    const token = req.cookies.JWT_HTTPONLY_Cookie;

    jwt.verify(
        token,
        String(process.env.JWT_SECRET_KEY),
        (err: any, decoded: any) => {
            if (err) return res.status(401).json({message: "Not Authorized!"});
            req.id = decoded.id;
            next();
        }
    )
}