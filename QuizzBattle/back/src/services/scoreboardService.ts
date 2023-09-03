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
        const transformedArray = users.map((item, index) => ({
            "score": item.score,
            "gamesPlayed": item.gamesPlayed,
            "nickname": item.nickname,
            "position": index + 1
        }));
        return transformedArray;
    }

    async findAllBy(categoryId) {
        const users = await UserCategory.findAll({
            attributes: ["score", "gamesPlayed"],
            where: {
                categoryId: categoryId
            },
            order: [
                ['score', 'DESC']
            ],
            include: [
              {
                model: User,
                attributes: ["nickname", "image", 'id'],
                as: 'user'
              },
              {
                model: Category,
                attributes: ["name"],
                as: 'category' 
              },
            ],
        });
        const transformedArray = users.map((item, index) => ({
            "score": item.score,
            "gamesPlayed": item.gamesPlayed,
            "nickname": item.user.nickname,
            "category": item.category.name,
            "position": index + 1,
            "image": item.user.image,
            "userId": item.user.id
        }));
        return transformedArray;
    }

    async createOrIncrement(data) {
        try {
          // Recherchez si une ligne existe déjà en fonction de son Id de l'utilisateur et de l'Id de la catégorie
          const result = await UserCategory.findOrCreate({
            where: { userId: data.userId, categoryId: data.categoryId },
            defaults: {
              score: data.score,
              gamesPlayed: data.gamesPlayed,
              categoryId: data.categoryId,
              userId: data.userId,
            },
          });
      
          const user = result[0]; // Récupérer l'utilisateur à partir du premier élément du résultat
          const created = result[1]; // Récupérer la valeur "created" à partir du deuxième élément du résultat
      
          if (!user) {
            throw new Error(`User with id ${data.userId} not found`);
          }
      
          if (!created) {
            // L'utilisateur a été trouvé, incrémente les champs si la ligne existe déjà
            await user.increment({
              score: data.score,
              gamesPlayed: data.gamesPlayed,
            });
          }
          console.log(`Score and gamesPlayed incremented for user with id ${data.userId} and categoryId ${data.categoryId}`);
      
          return [user, created]; // Renvoyer l'utilisateur  et le type mis à jour
        } catch (error) {
          console.error('Error finding or creating user:', error);
          throw error; // N'oubliez pas de propager l'erreur
        }
      }
      
}

export default ScoreboardService;