import express from 'express';

import GenericController from "../controllers/genericController";
import AnswerService from "./../services/answerService";


const AnswerController = GenericController(new AnswerService())
const answerRouter = express.Router();

answerRouter.post('/', AnswerController.create);
answerRouter.put('/:id', AnswerController.update);
answerRouter.get('/:categoryId', AnswerController.getAllBy);
export default answerRouter;
