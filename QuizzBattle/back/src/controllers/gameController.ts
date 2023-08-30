
function GameController(service, options = {}) {


    async function getByUser(req, res) {
        const games = await service.findByUser(parseInt(req.params.id, 10));
        if (!games) {
            res.sendStatus(404);
        } else {
            res.json(games);
        }
    }

    async function getAll(req, res) {
        const {
            _page = 1,
                _itemsPerPage = 100,
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

    async function getUsersWithWinsLast7Days(req, res) {
        const {
            _page = 1,
                _itemsPerPage = 100,
                _sort = {},
                ...criteria
        } = req.query;

        const users = await service.getUsersWithWinsLast7Days(criteria, {
            itemsPerPage: _itemsPerPage,
            page: _page,
            order: _sort,
        });
        res.json(users);
    }

    async function getStatsByUser(req, res) {
        const {userId} = req.params;

        const stats = await service.getStatsByUser(userId);
        res.json(stats);
    }

    

    async function getAllBy(req, res) {
        const users = await service.findAllBy(req.params.categoryId);
        if (!users) {
            res.sendStatus(404);
        } else {
            res.json(users);
        }
    }

    async function create(req, res, next) {
        try {
            const game = await service.create(req.body);
            res.status(201).json(game);
        } catch (error) {
            next(error);
        }
    }

    async function getOne(req, res) {
        const game = await service.findOne(parseInt(req.params.id, 10));
        if (!game) {
            res.sendStatus(404);
        } else {
            res.json(game);
        }
    }

    async function getByName(req, res) {
        const entity = await service.findByName(req.params.name);
        if (!entity) {
            res.sendStatus(404);
        } else {
            res.json(entity);
        }
    }
    async function replace(req, res, next) {
        try {
            const [game, created] = await service.replaceOne(
                parseInt(req.params.id, 10),
                req.body
            );

            if (!game) {
                res.sendStatus(404);
            } else res.status(created ? 201 : 200).json(game);
        } catch (error) {
            next(error);
        }
    }

    async function update(req, res, next) {
        try {
            const game = await service.updateOne(
                parseInt(req.params.id, 10),
                req.body
            );
            if (!game) {
                res.sendStatus(404);
            } else res.json(game);
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
        create,
        deleteOne,
        getAll,
        getAllBy,
        getByName,
        getByUser,
        getStatsByUser,
        getOne,
        replace,
        update,
        getUsersWithWinsLast7Days
    };
}

export default GameController;