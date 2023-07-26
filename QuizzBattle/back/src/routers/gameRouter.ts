import express from 'express';
import GenericController from "../controllers/genericController";
import {GameService} from "./../services/gameService";

const GameServiceInstance = new GameService();
const GameController = GenericController(GameServiceInstance);

const gameRouter = express.Router();

gameRouter.post('/', GameController.create);

export default gameRouter;
