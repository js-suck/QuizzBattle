import express from 'express';
import GenericController from "../controllers/genericController";
import CategoryService from "./../services/categoryService";
const multer = require('multer');
import path from 'path';
import usersRouter from "./userRouter";
const storage = multer.diskStorage({
    destination: 'dist/uploads/',
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
categoryRouter.get("/:name/label", CategoryController.getByName);
categoryRouter.get('/:id', CategoryController.getOne);
categoryRouter.post(
    '/',
    upload.single('profileImage'),
    function (req, res, next) {
        //console.log(req.file, req.body);
        req.body.image_url = req.file.filename
        next()
    },
    CategoryController.create
);
categoryRouter.put(
    '/:id',
    CategoryController.update
);

export default categoryRouter;
