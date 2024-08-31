import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt'; 
import { Prisma, PrismaClient } from '@prisma/client';
import { date, z } from 'zod';
import jwt from 'jsonwebtoken'

import dotenv from 'dotenv';
import { PrivateResultType } from '@prisma/client/runtime/library';


dotenv.config();




const userRouter: Router = express.Router();
const prisma = new PrismaClient();


async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}


const signupBody = z.object({
    email: z.string().email(),
    username: z.string().min(8),
    password: z.string().min(8),
});

interface SignupBody {
    username: string;
    password: string;
    email: string;
}

userRouter.post('/signup', async (req: Request<{}, {}, SignupBody>, res: Response) => {
    console.log(req.body)
    const parseResult = signupBody.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({
            msg: "Invalid inputs",
            errors: parseResult.error.format(),
        });
    }
    const existingUser = await prisma.user.findMany({
        where:{
            email:parseResult.data.email
        }
    })
    if(existingUser){
        return res.status(400).json({
            msg:"user already exist"
        })
    }
    const { username, email, password } = parseResult.data; 
    const hash = await hashPassword(password);
    try {
        const createUser = await prisma.user.create({
            data: {
                username,
                email,
                hash, 
            },
        });
        const secretkey = process.env.jwt_secret as string
        const token = jwt.sign(parseResult.data,secretkey)
        localStorage.setItem('token', token);
    
        res.status(201).json({
            msg: "User has been created",
            user: createUser, 
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            msg: "Internal Server Error",
        });
    }
});

interface SigninBody {
    email: string,
    password: string
}

const signinbody = z.object({
    email: z.string().email(),
    password: z.string()
})


userRouter.post('/signin' ,async (req:Request<SigninBody>,res:Response)=>{
    const parseResult = signinbody.safeParse(req.body)
    if(!parseResult.success){
        return res.json({
            msg:"invalid inputs"
        })
    }
    const {email,password} = parseResult.data
    const data = await prisma.user.findUniqueOrThrow({
        select:{
            hash: true,
            username:true,
            email:true
        },
        where:{
            email:email,
        },
    })
    const verified = await bcrypt.compare(password,data.hash)
    if(!verified){
        return res.json({
            msg:"Invalid Email or Password"
        })
    }
})




export default userRouter;
