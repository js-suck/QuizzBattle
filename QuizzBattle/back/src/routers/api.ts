import { Router } from "express";
import { quizzRouter } from "./quizzRouter"

const apiRouter = Router();

apiRouter.use("/quizz", quizzRouter);

export {
    apiRouter
}