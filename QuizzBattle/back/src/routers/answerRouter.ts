import express from 'express';

import GenericController from "../controllers/genericController";
import AnswerService from "./../services/answerService";


const AnswerController = GenericController(new AnswerService())
const answerRouter = express.Router();

answerRouter.post('/add', AnswerController.create);
answerRouter.put('/edit/:id', AnswerController.update);
answerRouter.get('/:categoryId', AnswerController.getAllBy);
export default answerRouter;
