import express from 'express';

import GenericController from "../controllers/genericController";
import CategoryService from "./../services/categoryService";
const multer = require('multer');
import path from 'path';

const storage = multer.diskStorage({
    destination: 'src/uploads/',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});
const upload = multer({ storage: storage });

const CategoryController = GenericController(new CategoryService())
const categoryRouter = express.Router();

categoryRouter.get('/', CategoryController.getAll);
categoryRouter.get("/:name", CategoryController.getByName);
categoryRouter.get('/show/:id', CategoryController.getOne);
categoryRouter.post(
    '/add',
    upload.single('profileImage'),
    function (req, res, next) {
        //console.log(req.file, req.body);
        req.body.profilePicturePath = req.file.filename
        next()
    },
    CategoryController.create
);

export default categoryRouter;
