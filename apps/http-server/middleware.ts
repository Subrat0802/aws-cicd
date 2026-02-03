import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";


export const middleware = async (req: Request,res: Response, next: NextFunction) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(404).json({
                message:"Error while fetching token"
            })
        }

        const decode = jwt.verify(token, "secret") as JwtPayload;

        req.userId = decode.id

        next();
    }catch(error){
        console.log("error while getting token, middleware")
    }
}