import express from 'express';
import GenericController from "../controllers/genericController";
import QuizzService from "./../services/questionService";

const quizzServiceInstance = new QuizzService();
const quizzController = GenericController(quizzServiceInstance);

const quizzRouter = express.Router();

quizzRouter.get('/', quizzController.getAll);

export default quizzRouter;
