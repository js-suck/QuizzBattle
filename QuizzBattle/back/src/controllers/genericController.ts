const translateService = require("../services/deeplApiService");
const triviaApiService = require("../services/triviaApiService");

function GenericController(service, options = {}) {
  console.log("im construct", service);

  async function getAll(req, res) {
    const {
      _page = 1,
      _itemsPerPage = 30,
      _sort = {},
      ...criteria
    } = req.query;

    const users = await service.findAll(criteria, {
      itemsPerPage: _itemsPerPage,
      page: _page,
      order: _sort,
    });
    res.json(users);
  }

  async function create(req, res, next) {
    try {
      const user = await service.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async function getOne(req, res) {
    const user = await service.findOne(parseInt(req.params.id, 10));
    if (!user) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  }

  async function getAllTrivia(req, res) {
    const questions = await triviaApiService.getAll(req.body.limit, req.body.categories, req.body.difficulties, req.body.region, req.body.types, req.body.tags);
    if (!questions) {
      res.sendStatus(404);
    } else {
      res.json(questions);
    }
  }

  async function getOneTrivia(req, res) {
    const question = await triviaApiService.getOne(req.params.id);
    if (!question) {
      res.sendStatus(404);
    } else {
      res.json(question);
    }
  }

  async function getAllCategoriesTrivia(req, res) {
    const categories = await triviaApiService.getAllCategories();
    if (!categories) {
      res.sendStatus(404);
    } else {
      res.json(categories);
    }
  }

  async function getAllTagsTrivia(req, res) {
    const tags = await triviaApiService.getAllTags();
    if (!tags) {
      res.sendStatus(404);
    } else {
      res.json(tags);
    }
  }

  async function replace(req, res, next) {
    try {
      const [user, created] = await service.replaceOne(
        parseInt(req.params.id, 10),
        req.body
      );

      if (!user) {
        res.sendStatus(404);
      } else res.status(created ? 201 : 200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async function update(req, res, next) {
    try {
      const user = await service.updateOne(
        parseInt(req.params.id, 10),
        req.body
      );
      if (!user) {
        res.sendStatus(404);
      } else res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async function deleteOne(req, res) {
    const deleted = await service.deleteOne(parseInt(req.params.id, 10));
    if (!deleted) {
      res.sendStatus(404);
    } else res.sendStatus(204);
  }

  async function translate(req, res) {
    const text = req.params.text;
    const translatedText = await translateService.translate(text);
    res.json(translatedText);
  }

  return {
    getAll,
    create,
    getOne,
    replace,
    update,
    deleteOne,
    translate,
    getOneTrivia,
    getAllTrivia,
    getAllCategoriesTrivia,
    getAllTagsTrivia,
  };
}

export default GenericController;
