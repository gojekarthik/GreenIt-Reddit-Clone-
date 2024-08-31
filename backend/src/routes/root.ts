import express, { Router } from 'express'
import userRouter from './user';

const rootRouter:Router = express.Router();

rootRouter.use('/user',userRouter)


export = rootRouter