import { Request, Response } from "express";
import user from "../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../types/app";

export const signup = async (req: Request, res: Response) => {
    console.log("signup");
    const {name, email, password} = req.body;

    try {
        const exists = await user.exists({email: email});
        if (exists) {
            return res.status(403).json({message: "User Already Exists!"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = new user({name, email, password: hashedPassword});
        await newUser.save();
        return res.status(201).json({message: "User Created Successfully", data: {name, email}})
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

export const login = async (req: Request, res: Response) => {
    console.log("login", req.body);
    const {email, password} = req.body;

    try {
        const findUser = await user.findOne({email});
        
        if (!findUser) {
            return res.status(404).json({message: "Invalid Credentials!"});
        }

        const check = bcrypt.compare(password, findUser.password as string);

        if (!check) {
            return res.status(404).json({message: "Invalid Credentials!"});
        }

        const token = jwt.sign({ id: findUser._id }, String(process.env.JWT_SECRET_KEY), {
            expiresIn: "3h"
        })

        res.cookie('JWT_HTTPONLY_Cookie', token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(200).json({message: "Logged In Successfully!", data: {name: findUser.name, email: findUser.email}});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Something Went Wrong!"});
    }
}

export const logout = async (req: AuthRequest, res: Response) => {
    res.clearCookie("JWT_HTTPONLY_Cookie");
    return res.status(200).json({message: "Logged Out Successfully!"});
}