import express, { type CookieOptions, type Request, type Response } from "express";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(cookieParser());

app.post("/signup",async (req: Request, res: Response) => {
    try{
        const {username, password} = req.body;

        if(!username || !password) {
            return res.status(403).json({
                message:"Al fields are required",
                success: false
            })
        }

        const response = await prismaClient.user.create({
            data:{
                username,
                password
            }
        })

        if(!response){
            return res.status(404).json({
                message:"Error while signup",
                success:false
            })
        }

        return res.status(200).json({
            message:"Signup successfull",
            success:true
        })
    }catch(error){
        console.log(error);
    }
})



app.post("/signin",async (req: Request, res: Response) => {
    try{
        const {username, password} = req.body;

        if(!username || !password) {
            return res.status(403).json({
                message:"Al fields are required",
                success: false
            })
        }

        const response = await prismaClient.user.findUnique({
            where:{
                username
            }
        })

        if(!response){
            return res.status(404).json({
                message:"user signup in",
                response
            })
        }

        const checkPassword = password == response.password;

        if(!checkPassword){
            return res.status(404).json({
                message:"Incorrect password",
                success:false
            })
        }

        const token = jwt.sign({
            id: response.id
        }, "secret", {
            expiresIn: "24h"
        })

        const options: CookieOptions  = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }

        return res.cookie("token", token, options).status(200).json({
            message:"user signin successfully",
            success:true,
            response
        })

    }catch(error){
        console.log(error);
    }
})


app.post("/createTodo", middleware, async (req: Request, res: Response) => {
    try{
        const {title} = req.body;
        const id = req.userId;

        if(!id){
            return res.status(404).json({
                message:"middlware id not found"
            })
        }
        if(!title){
            return res.status(404).json({
                message:"Title is required"
            })
        }

        const todo = await prismaClient.todo.create({
            data:{
                todo:title,
                userId: id as string
            }
        })

        if(!todo){
            return res.status(404).json({
                message:"Error while creating todo"
            })
        }

        return res.status(200).json({
            message:"Todo is created",
            success:true,
            todo
        })
    }catch(error){
        console.log(error);
    }
})

app.get("/getAllUserTodos", async (req: Request, res: Response) => {
    try{
        // const id = req.userId;

        // if(!id){
        //     return res.status(404).json({
        //         message:"middlware id not found"
        //     })
        // }

        const todo = await prismaClient.todo.findMany({
            orderBy:{
                createdAt: "desc"
            }
        });

        if(todo.length === 0){
            return res.status(402).json({
                message:"No todo found"
            })
        }

        return res.status(200).json({
            message:"All todos",
            todo,
            success: true
        })
    }catch(error){
        console.log(error);
    }
})

app.post("/updateTodo",middleware, async (req: Request, res: Response) => {
    try{
        const id = req.userId;
        const {todoId} = req.body;
        if(!id){
            return res.status(404).json({
                message:"Middleware error"
            })
        }

        const response = await prismaClient.todo.update({
            where:{
                id: todoId
            },
            data:{
                done: true
            }
        })

        if(!response) {
            return res.status(404).json({
                message:"Error while updating todo"
            })
        }

        return res.status(200).json({
            message:"Todo updated",
            success:true
        })
    }catch(error){
        console.log(error);
    }
})


app.listen(3001);