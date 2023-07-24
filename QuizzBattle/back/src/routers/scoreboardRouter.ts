import express from 'express';
import GenericController from "../controllers/genericController";
import ScoreboardService from "./../services/scoreboardService";

const scoreboardServiceInstance = new ScoreboardService();
const quizzController = GenericController(scoreboardServiceInstance);

const quizzRouter = express.Router();

quizzRouter.get('/', quizzController.getAll);

export default quizzRouter;
