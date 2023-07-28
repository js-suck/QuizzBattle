import { Game } from '../db/mongo/models/Game';

const ValidationErrorr = require("../errors/ValidationError");
const SequelizeDb = require("sequelize");

class GameService {
  create = async (data) => {
    try {
      console.log(data);
      const game = await Game.create(data);
      return game;
    } catch (error) {
      if (error instanceof SequelizeDb.ValidationError) {
        throw ValidationErrorr.createFromSequelizeValidationError(error);
      }
      throw error;
    }
  }

    findByUser = async (userId) => {
      try {
        const games = await Game.find({ userId: userId }).exec();
        return games;
      } catch (error) {
        throw error;
      }
    }
  
  getUsersWithWinsLast7Days = async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
      const result = await Game.aggregate([
        {
          $match: {
            isWinner: true,
            date: { $gte: oneWeekAgo }
          }
        },
        {
          $group: {
            _id: null,
            users: { $push: '$username' },
            userProfilePictures: { $push: '$userProfilePicture' } ,
            userId: { $push: '$userId' } 
          }
        },
        {
          $project: {
            _id: 0,
            users: 1,
            userProfilePictures: 1 ,
            userId: 1
          }
        }
      ]);

      if (result.length > 0) {
        
        console.log(result)
        // Combine users and userProfilePictures arrays into a single array of objects
        const usersWithProfilePictures = result[0].users.map((user, index) => ({
          username: user,
          userProfilePicture: result[0].userProfilePictures[index],
          userId: result[0].userId[index]
        }));

        return usersWithProfilePictures;
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  }

}

export { GameService };
