import { Router } from "express";
import quizzRouter from "./quizzRouter"
import questionRouter from "./questionRouter";
import categoryRouter from "./categoryRouter";
import scoreboardRouter from "./scoreboardRouter";
import userRouter from "./userRouter";

const apiRouter = Router();

apiRouter.use("/quizzes", quizzRouter);
apiRouter.use("/questions", questionRouter);
apiRouter.use("/category", categoryRouter)
apiRouter.use("/scoreboard", scoreboardRouter);
apiRouter.use("/users", userRouter);



export {
    apiRouter
}  