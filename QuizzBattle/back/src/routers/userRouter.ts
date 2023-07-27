import express from 'express';
import GenericController from "../controllers/genericController";
const UserService = require("../services/userService");
const multer = require('multer');
import path from 'path';

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

usersRouter.get('/', userController.getAll);
usersRouter.get('/show/:id', userController.getOne);
usersRouter.put(
    '/edit/:id',
    upload.single('profileImage'),
    function (req, res, next) {
        //console.log(req.file, req.body);
        req.body.profilePicturePath = req.file.filename
        next()
    },
    userController.update
);

export default usersRouter ;
