import { Router } from "express";
import quizzRouter from "./quizzRouter"
import questionRouter from "./questionRouter";
import categoryRouter from "./categoryRouter";

const apiRouter = Router();

apiRouter.use("/quizzes", quizzRouter);
apiRouter.use("/questions", questionRouter);
apiRouter.use("/category", categoryRouter)


export {
    apiRouter
}  