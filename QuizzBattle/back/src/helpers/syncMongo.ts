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
      // Search games in MongoDB where userId = id 
      const games = await Game.find({ userId: id });
  
      if (games.length > 0) {
        // If games are found, update each game with newData
        for (const game of games) {
          // newData must be an object containing the fields to update
          Object.assign(game, {
            userId: newData.id,
            username: newData.firstname
            
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