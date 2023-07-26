import express from 'express';

import GenericController from "../controllers/genericController";
import CategoryService from "./../services/categoryService";
import usersRouter from "./userRouter";


const CategoryController = GenericController(new CategoryService())
const categoryRouter = express.Router();

categoryRouter.get('/', CategoryController.getAll);
categoryRouter.get("/:name", CategoryController.getByName);
categoryRouter.get('/show/:id', CategoryController.getOne);

export default categoryRouter;
