import express from 'express';

import GameController from '../controllers/gameController';
import { GameService } from '../services/gameService';

const GameServiceInstance = new GameService();
const GameControllerInstance = GameController(GameServiceInstance);

const gameRouter = express.Router();

gameRouter.post('/', GameControllerInstance.create);
gameRouter.get('/win/:categoryId', GameControllerInstance.getUsersWithWinsLast7Days);

export default gameRouter;
