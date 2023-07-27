import { Router } from "express";
import quizzRouter from "./quizzRouter"
import questionRouter from "./questionRouter";
import categoryRouter from "./categoryRouter";
import scoreboardRouter from "./scoreboardRouter";
import userRouter from "./userRouter";
import gameRouter from "./gameRouter";

const apiRouter = Router();

apiRouter.use("/quizzes", quizzRouter);
apiRouter.use("/questions", questionRouter);
apiRouter.use("/category", categoryRouter)
apiRouter.use("/scoreboard", scoreboardRouter);
apiRouter.use("/users", userRouter);
apiRouter.use('/game', gameRouter)

export {
    apiRouter
}  