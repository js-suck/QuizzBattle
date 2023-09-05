const User = require("../db").User;

const ValidationErrorInstance = require("../errors/ValidationError");
const Sequelize = require("sequelize");
const Badge = require("../db").Badge;


class BadgeService {
    async findAllBy(userId) {
        try {
            const badges = await Badge.findAll({
                include: [{
                    model: User,
                    as: "users",
                    where: {
                        id: 54
                    }
                }]
            });
            return badges;
        } catch (error) {
            throw error;
        }
    }
    async create(data) {
        console.log(data, "data")
        try {
            const badge = await Badge.create(data);
            return badge;
        } catch (error) {
           
            throw error;
        }
    }

    async addTenWinningGamesBadgeToUser(userId) {
        try {
            // Récupérer l'utilisateur par ID
            const user = await User.findByPk(54);
            if (!user) {
              throw new Error('Utilisateur non trouvé');
            }
        
            // Vérifier si l'utilisateur a déjà le badge
            const tenWinsBadgeName = 'tenGamesWins';
            const hasBadge = await Badge.findOne({
                include: [{
                    model: User,
                    as: "users",
                    where: {
                        id: 54,
                    }
                }]
            });
            if (hasBadge) {
              console.log('L\'utilisateur a déjà le badge');
              return;
            }

              const tenWinsBadge = await Badge.findOne({
                where: { label: tenWinsBadgeName }
            });

           
        
              if (tenWinsBadge) {
                // Associer le badge à l'utilisateur
                await user.addCategory(tenWinsBadge);
                console.log('Badge ajouté avec succès');
              }
            
          } catch (error) {
            console.error('Une erreur est survenue :', error.message);
          }

    }

}
export default BadgeService