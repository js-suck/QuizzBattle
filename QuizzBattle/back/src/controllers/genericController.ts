import QuizzesService from "../services/questionService";

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

  return {
    getAll,
    create,
    getOne,
    replace,
    update,
    deleteOne
  };
}

export default GenericController;
