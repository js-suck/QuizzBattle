import { Router } from "express";
import quizzRouter from "./quizzRouter"
import questionRouter from "./questionRouter";

console.log(quizzRouter, "router")
const apiRouter = Router();

apiRouter.use("/quizzes", quizzRouter);
apiRouter.use("/questions", questionRouter);


export {
    apiRouter
}  