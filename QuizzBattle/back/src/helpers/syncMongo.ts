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
      // Recherchez l'entité Game dans MongoDB par gameId
      const game = await Game.find({ gameId: newData.gameId });
  
      console.log(game, "game")
      if (game) {
        // Si l'entité Game est trouvée, mettez à jour ses données avec newData
        // newData doit être un objet contenant les champs à mettre à jour
        Object.assign(game, newData);
        await game.save();
        console.log(`Entité Game avec gameId ${newData.gameId} mise à jour dans MongoDB.`);
      } else {
        console.log(`L'entité Game avec gameId ${newData.gameId} n'existe pas dans MongoDB.`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'entité Game dans MongoDB :', error);
    }
  };

export { getUserDataFromPostgres, updateMongoDBGame };