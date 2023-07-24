import express from 'express';
import GenericController from "../controllers/genericController";
import UserService from "./../services/userService";

const userServiceInstance = new UserService();
const userController = GenericController(userServiceInstance);

const usersRouter = express.Router();

usersRouter.get('/', userController.getAll);
usersRouter.get('/show/:id', userController.getOne);
usersRouter.put('/edit/:id', userController.update);

export default usersRouter ;
