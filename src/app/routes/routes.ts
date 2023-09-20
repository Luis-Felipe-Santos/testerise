import { Router } from "express";
import userRouter from "../controllers/UserController";
import planRouter from "../controllers/PlanController";

const routers = Router();

routers.use('/users', userRouter);
routers.use('/plans', planRouter);



export default routers;