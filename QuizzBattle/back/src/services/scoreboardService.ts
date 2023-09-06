import { Game } from '../db/mongo/models/Game';
const Category = require("../db").Category

class ScoreboardService {
  async findAll() {
    const result = await Game.aggregate([
      {
        $match: {
          score: { $ne: null } // Filtrez les jeux avec un score non nul
        }
      },
      {
        $group: {
          _id: '$userId',
          score: { $sum: '$score' },
          gamesPlayed: { $sum: 1 },
          userProfilePicture: { $first: '$userProfilePicture' },
          nickname: { $first: '$username' }


        }
      },
      {
        $sort: {
          score: -1 // Triez par score décroissant
        }
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          score: 1,
          gamesPlayed: 1,
          userProfilePicture: 1, 
          nickname: 1
        }
      }
    ]);
    console.log(result[0])
    
    const transformedArray = result.map((item, index) => ({
      userId: item.userId,
      score: item.score,
      userProfilePicture: item.userProfilePicture, // Ajoutez userProfilePicture à votre objet résultat
      gamesPlayed: item.gamesPlayed,
      position: index + 1,
      nickname: item.nickname
    }));
    

      return transformedArray;
    } catch (error) {
      console.error('Error finding leaderboard:', error);
      throw error;
    }


  async findAllBy(categoryId) {
    console.log(categoryId);

    const categoryName = await Category.findOne({
      where: { id: categoryId }
    })

    if(!categoryName) {
      throw new Error('Category not found');
    }

    try {
      const result = await Game.aggregate([
        {
          $match: {
            score: { $ne: null },
            quizzName: categoryName.name 
          }
        },
        {
          $group: {
            _id: '$userId',
            score: { $sum: '$score' },
            gamesPlayed: { $sum: 1 },
            userProfilePicture: { $first: '$userProfilePicture' },
            nickname: { $first: '$username' }
          }
        },
        {
          $sort: {
            score: -1
          }
        },
        {
          $project: {
            _id: 0,
            userId: '$_id',
            score: 1,
            gamesPlayed: 1,
            userProfilePicture: 1,
            nickname: 1
          }
        }
      ]);

      console.log(result);
      const transformedArray = result.map((item, index) => ({
        userId: item.userId,
        score: item.score,
        gamesPlayed: item.gamesPlayed,
        position: index + 1,
        userProfilePicture: item.userProfilePicture,
        nickname: item.nickname
      }));
      console.log(transformedArray)

      return transformedArray;
    } catch (error) {
      console.error('Error finding category leaderboard:', error);
      throw error;
    }
  }

  async findAllByUserId(userId) {
    try {
      const result = await Game.aggregate([
        {
          $match: {
            score: { $ne: null },
            userId: userId 
          }
        },
        {
          $group: {
            _id: '$categoryId',
            score: { $sum: '$score' },
            gamesPlayed: { $sum: 1 }
          }
        },
        {
          $sort: {
            score: -1
          }
        },
        {
          $project: {
            _id: 0,
            categoryId: '$_id',
            score: 1,
            gamesPlayed: 1
          }
        }
      ]);

      const transformedArray = result.map((item, index) => ({
        categoryId: item.categoryId,
        score: item.score,
        gamesPlayed: item.gamesPlayed,
        position: index + 1
      }));

      return transformedArray;
    } catch (error) {
      console.error('Error finding user leaderboard:', error);
      throw error;
    }
  }

  async createOrIncrement(data) {
    try {
      // Recherchez si une ligne existe déjà en fonction de l'Id de l'utilisateur et de l'Id de la catégorie
      const result = await Game.aggregate([
        {
          $match: {
            userId: data.userId,
            categoryId: data.categoryId
          }
        }
      ]);

      const existingGame = result[0]; // Récupérer le premier résultat

      if (existingGame) {
        // La partie existe déjà, mettez à jour les scores
        existingGame.score += data.score;
        existingGame.gamesPlayed += data.gamesPlayed;

        // Enregistrez la mise à jour dans la base de données
        await Game.findByIdAndUpdate(existingGame._id, {
          $set: {
            score: existingGame.score,
            gamesPlayed: existingGame.gamesPlayed
          }
        });
      } else {
        // La partie n'existe pas, créez une nouvelle entrée
        const newGame = new Game({
          userId: data.userId,
          categoryId: data.categoryId,
          score: data.score,
          gamesPlayed: data.gamesPlayed
        });

        // Enregistrez la nouvelle entrée dans la base de données
        await newGame.save();
      }

      console.log(`Score and gamesPlayed updated for userId ${data.userId} and categoryId ${data.categoryId}`);
    } catch (error) {
      console.error('Error updating score and gamesPlayed:', error);
      throw error;
    }
  }
}

export default ScoreboardService;
