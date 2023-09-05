import { Game } from '../db/mongo/models/Game';

const User = require("../db").User;

const getUserDataFromPostgres = async (id) => {
    // Récupérer les nouvelles données de PostgreSQL``

    const newUserData = User.findOne(
        { where: { id } }
    );

    console.log(newUserData)
    return newUserData;
  };

  const updateMongoDBGame = async (id, newData) => {
    try {
      const games = await Game.find({ userId: id });
  
      if (games.length > 0) {
        for (const game of games) {
          Object.assign(game, {
            userId: newData.id,
            username: newData.firstname,
            userProfilePicture: newData.image
          });
          await game.save();
          console.log(`Entité Game avec gameId ${game.id} mise à jour dans MongoDB.`);
        }
      } else {
        console.log(`Aucune entité Game avec userId ${id} n'a été trouvée dans MongoDB.`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'entité Game dans MongoDB :', error);
    }
  };

export { getUserDataFromPostgres, updateMongoDBGame };