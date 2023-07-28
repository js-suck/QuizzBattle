import express from 'express';

import GenericController from "../controllers/genericController";
import QuestionService from "./../services/questionService";
import scoreboardRouter from "./scoreboardRouter";


const QuestionController = GenericController(new QuestionService())
const questionRouter = express.Router();

questionRouter.get('', QuestionController.getAll);
questionRouter.get('/one/:id', QuestionController.getOne);
questionRouter.get("/trivia/categories", QuestionController.getAllCategoriesTrivia);
questionRouter.get("/trivia/tags", QuestionController.getAllTagsTrivia);
questionRouter.get("/trivia/:id", QuestionController.getOneTrivia);
questionRouter.post("/trivia", QuestionController.getAllTrivia);
questionRouter.get('/translate/:text', QuestionController.translate);
questionRouter.get('/:categoryId', QuestionController.getAllBy);
questionRouter.post('/add', QuestionController.create);
questionRouter.put('/edit/:id', QuestionController.update);

export default questionRouter;
