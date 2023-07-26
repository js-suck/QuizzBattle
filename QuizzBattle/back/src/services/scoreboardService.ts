const User = require('../db').User;
const UserCategory = require('../db').UserCategory;
const Category = require('../db').Category;
const { Op } = require('sequelize');
const {sequelize, Sequelize} = require('../db');

class ScoreboardService {
    async findAll() {
        const users = await User.findAll({
            attributes: [
                'nickname',
                'score', 
                'gamesPlayed',
            ],
            where: {
                score: {
                    [Op.not]: null
                }
            },
            order: [
                ['score', 'DESC']
            ]
        });
        return users;
    }

    async findAllBy(categoryId) {
        const users = await UserCategory.findAll({
            attributes: ["score", "gamesPlayed"],
            include: [
              {
                model: User,
                attributes: ["nickname"],
                where: { // Filtrer les utilisateurs qui sont associés à la catégorie spécifiée
                  id: categoryId,
                },
                as: 'user'
              },
              {
                model: Category,
                attributes: ["name"],
                as: 'category' // On n'a pas besoin des attributs de la table Category dans ce cas
              },
            ],
        });
        const transformedArray = users.map(item => ({
            "score": item.score,
            "gamesPlayed": item.gamesPlayed,
            "nickname": item.user.nickname,
            "category": item.category.name
        }));
        return transformedArray;
    }
}

export default ScoreboardService;