import { BADGES } from '../constants';
import { Game } from '../db/mongo/models/Game';

const Badge = require("../db").Badge;
const User = require("../db").User;

const ValidationErrorr = require("../errors/ValidationError");
const SequelizeDb = require("sequelize");


type TCategory = {
  label: string;
  bestScore: number;
  gamePlayed: number;
  playedOver10: boolean;
}

type TCategories = TCategory[]

type TStats = {
  categories : TCategories;
  totalGames: number;
  adversaires: string;
}

const getBadgeByLabel = async (userIdString, label, description, image, gamesNeeds) => {
  const user = await User.findByPk(userIdString);

  const existingBadge = await Badge.findOne({
    include: [{
      model: User,
      as: "users",
      where: {
          id: userIdString
      }
  }],
    where: {
      label: label,
    }
  });

  if (existingBadge) {
    console.log("L'utilisateur a déjà le badge:", label);
    return {
      userObtain: true,
      label: existingBadge.label,
      description: existingBadge.description,
      image: existingBadge.image,
      gamesNeeds: gamesNeeds,
      isNew: false,
    };
  } else {
    console.log("creation du badge")
    const badge = await Badge.create({
      label: label,
      description: description,
      image: image,
    });

    await user.addCategory(badge);
    return {
      userObtain: true,
      label: badge.label,
      description: badge.description,
      image: badge.image,
      gamesNeeds: gamesNeeds,
      isNew: true,
    };
  }
};


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


// /**
//    generic fonction with required stats can determine if user has won a new badges
//   send if badge is newer or old 
//   with that way we can get badges just for reading or to alert user and create new badges */
//   hasWonABadge({
//     categories,
//     totalGames,
//     adversaires,
//   } : TStats)

getStatsByUser = async (userId: number) => {
      const userIdString = userId.toString();
      const createdBadges = []

     const result = await Game.aggregate([
        {
          $match: {
            userId: userIdString,
          },
        },
        {
          $group: {
            _id: { quizzName: "$quizzName" }, // Grouping by quiz name
            gamesPlayed: { $sum: 1 }, // Counting the number of games played in each category
            gamesWon: {
              $sum: { $cond: [{ $eq: ["$isWinner", true] }, 1, 0] }, // Counting the number of games won in each category
            },
          },
        },
        {
          $group: {
            _id: null, // Grouping all categories together
            categories: {
              $push: {
                label: "$_id.quizzName",
                gamesPlayed: "$gamesPlayed",
                gamesWon: "$gamesWon",
              },
            },
            totalGamesPlayed: { $sum: "$gamesPlayed" },
            totalGamesWon: { $sum: "$gamesWon" },
          },
        },
        {
          $project: {
            _id: 0,
            categories: 1,
            totalGamesPlayed: 1,
            totalGamesWon: 1,
          },
        },
      ]);
      
    
    console.log(result)
    if(!result[0])
    return {
      categoriesStats : [],
      totalGamesStatsAndBadge: [],
      totalGamesPlayed: 0,
    }
    
    const stats = [];
    const user = await User.findByPk(userIdString);

    for (const categorie of result[0]?.categories) {
          console.log(categorie, "categorie.totalGamesWon")

      if (categorie.gamesWon > 10) {
        const existingBadge = await Badge.findOne({
          include: [
            {
              model: User,
              as: "users",
              where: {
                id: userIdString
              }
            }
          ],
          where: {
            label: `${BADGES[0].label} ${categorie.label}`
          }
        });

        if (existingBadge) {
          console.log("L'utilisateur a déjà le badge");
          stats.push({
            badges: existingBadge,
            categorie
          });
        } else {
          const badge = await Badge.create({
            label: `${BADGES[0].label}-${categorie.label}`,
            description: BADGES[0].description,
            image: `tenGamesWins${categorie.label}`,
            userId: userIdString,
            isNew: true,
          });

          await user.addCategory(badge);
          createdBadges.push(badge)
          stats.push({
            categorie,
            badges: badge,
          });
        }
      }
    }

    let totalGamesStatsAndBadge = {
      label: "totalGames",
      bestScore: 0,
      gamePlayed: result[0].totalGames,
      badges: []
    };


    const gamesNeedBadges = BADGES.filter(badge => badge.gamesNeeds != undefined)
    for (const badge of gamesNeedBadges) {
      console.log(result[0],badge.gamesNeeds )

        if (result[0].totalGamesPlayed >= badge.gamesNeeds)
        {
          const newBadge = await getBadgeByLabel(
            userIdString,
            badge.label,
            badge.description, 
            badge.image,
            badge.gamesNeeds
          );
          totalGamesStatsAndBadge.badges.push(newBadge);
          
        }
        else
        {
          const existingBadge = await Badge.findOne({
            where: {
              label: badge.label,
            }
          });

          if(existingBadge)
          {
          totalGamesStatsAndBadge.badges.push({
            userObtain: false,
            label: existingBadge.label,
            description: existingBadge.description,
            image: existingBadge.image,
            gamesNeeds: badge.gamesNeeds,
            isNew: false,
          });
        }
        }
      }      

    if (result) {
      return {
        categoriesStats : stats,
        totalGamesStatsAndBadge,
        totalGamesPlayed: result[0].totalGamesPlayed,


      };
    } else {
      return null;
    }
 
};

}

export { GameService };
