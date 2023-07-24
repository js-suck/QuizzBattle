const User = require('../db').User;
const { Op } = require('sequelize');
const {sequelize, Sequelize} = require('../db');

class ScoreboardService {
    async findAll() {
        const users = await User.findAll({
            attributes: [
                'firstname', 
                'lastname', 
                'score', 
                'gamesPlayed',
                [sequelize.col('score'), 'total'],
                [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('score') / sequelize.col('gamesPlayed')), 2), 'average']
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
}

export default ScoreboardService;