import { Router } from "express";
import quizzRouter from "./quizzRouter"
import questionRouter from "./questionRouter";
import bodyParser from "body-parser";
import userRouter from "./userRouter";

console.log(quizzRouter, "router")
const apiRouter = Router();

apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({ extended: true }));

apiRouter.use("/quizzes", quizzRouter);
apiRouter.use("/questions", questionRouter);


export {
    apiRouter
}  