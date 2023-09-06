import express from 'express';
import path from 'path';

import GameController from '../controllers/gameController';
import GenericController from '../controllers/genericController';
import { adminMiddleware } from '../services/authentifiactionService';
import { GameService } from '../services/gameService';

const gameController = GameController(new GameService());
const UserService = require("../services/userService");
const multer = require('multer');

const userServiceInstance = new UserService();
const userController = GenericController(userServiceInstance);
const usersRouter = express.Router();
const destinationFolder = path.join(__dirname, 'uploads/');

const storage = multer.diskStorage({
    destination: 'src/uploads/',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});
const upload = multer({ storage: storage });

usersRouter.get('/', adminMiddleware, userController.getAll);
usersRouter.get('/:id', (req, res, next) => {
    if (req.params.id != req.user?.id && !req.isAdmin) {
       return res.status(404).send('Unauthorized');
    }
     next()
}, userController.getOne);
usersRouter.get('/:id', (req, res, next) => {
    if (req.params.id != req.user?.id && !req.isAdmin) {
       return res.status(404).send('Unauthorized');
    }
     next()
}, userController.getOne);

usersRouter.put(
    '/:id',
    upload.single('profileImage'),
    (req, res, next) => {
        if(req.body.role === 'admin') {
            res.status(401).send("Petits voyous vous n'aurez pas ce privillège, j'ai pas été au rattrapage pour rien, des bisous, Laïla.")
        }
        delete req.body.role
        if (req.params.id != req.user?.id && !req.isAdmin) {
            return res.status(404).send('Unauthorized');
        }
         next()
    },

    function (req, res, next) {
        //console.log(req.file, req.body);
        req.body.image = req?.file?.filename
        next()
    },
    userController.update
);
usersRouter.put('/updateStats/:id', userController.update);
usersRouter.get('/:id/games', gameController.getByUser)
usersRouter.put(
    '/editIsValidate/:id',
    userController.update
);


export default usersRouter ;
