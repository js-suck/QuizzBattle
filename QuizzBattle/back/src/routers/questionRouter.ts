import express from 'express';

import GenericController from "../controllers/genericController";
import QuestionService from "./../services/questionService";


const QuestionController = GenericController(new QuestionService())
const questionRouter = express.Router();

questionRouter.get('', QuestionController.getAll);
questionRouter.get('/:id', QuestionController.getOne);
questionRouter.get("/trivia/categories", QuestionController.getAllCategoriesTrivia);
questionRouter.get("/trivia/tags", QuestionController.getAllTagsTrivia);
questionRouter.get("/trivia/:id", QuestionController.getOneTrivia);
questionRouter.post("/trivia", QuestionController.getAllTrivia);
questionRouter.get('/translate/:text', QuestionController.translate);

export default questionRouter;
