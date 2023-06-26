import express from 'express';

import GenericController from "../controllers/genericController";
import QuestionService from "./../services/questionService";


const QuestionController = GenericController(new QuestionService())
const questionRouter = express.Router();

questionRouter.get('/', QuestionController.getAll);
questionRouter.get("/:id", QuestionController.getOne);

export default questionRouter;
