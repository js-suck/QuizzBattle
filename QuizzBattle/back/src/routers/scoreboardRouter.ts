import express from 'express';
import GenericController from "../controllers/genericController";
import ScoreboardService from "./../services/scoreboardService";

const scoreboardServiceInstance = new ScoreboardService();
const scoreboardController = GenericController(scoreboardServiceInstance);

const scoreboardRouter = express.Router();

scoreboardRouter.get('/', scoreboardController.getAll);
scoreboardRouter.get('/:categoryId', scoreboardController.getAllBy);
scoreboardRouter.put('/updateStats', scoreboardController.createOrIncrement);

export default scoreboardRouter;
