import express from 'express';

import GenericController from "../controllers/genericController";
import CategoryService from "./../services/categoryService";


const CategoryController = GenericController(new CategoryService())
const categoryRouter = express.Router();

categoryRouter.get('/', CategoryController.getAll);
categoryRouter.get("/:name", CategoryController.getByName);

export default categoryRouter;
