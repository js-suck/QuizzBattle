import express from 'express';

import * as UsersController from '../controllers/usersController';

const usersRouter = express.Router();

usersRouter.get('users', function (req, res) {

})

export { usersRouter };
