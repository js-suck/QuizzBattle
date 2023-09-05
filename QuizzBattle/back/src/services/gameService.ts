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


const checkBadgeAlreadyExistByUser =  async (label, userId) => {
  const existingBadge = await Badge.findOne({
    include: [{
      model: User,
      as: "users",
      where: {
          id: userId
      }
  }],
    where: {
      label,
    }
  });

  if(existingBadge)
  {
  return {
    userObtain: true,
    label: existingBadge.label,
    description: existingBadge.description,
    image: existingBadge.image,
    isNew: false,
  }
} else 
return false
}
const getBadgeByLabel = async (userIdString, label, description, image, gamesNeeds) => {
  const user = await User.findByPk(userIdString);

  const existingBadge = await checkBadgeAlreadyExistByUser(label, user.id)

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
    console.log("creation du badge", label)

    // recherche du badge 
    const badge = await Badge.findOne({
      where: {
        label: label,
      }
    });
    
    if(!badge){
      throw new Error("Badge not found")
    }

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



getStrikesBadges = (userId, correctAnswersStrike) => {
  const badges = []
  if(correctAnswersStrike > 3){
    return getBadgeByLabel(userId, '3 bonnes réponses à la suite !', '3 bonnes réponses à la suite !', 'oneThousandGamesPlayed.png', undefined)
  } else {
    const existingBadge = checkBadgeAlreadyExistByUser('3 bonnes réponses à la suite !',userId)
    return existingBadge
    badges.push(existingBadge)

  }


}

 getStatsByUser = async ({userId, correctAnswersStrike} : {
  userId: string,
  correctAnswersStrike: number
 }) => {
  const userIdString = userId.toString();
  const createdBadges = [];

  const calculateCategoryBadge = async (userIdString, categorie) => {
 
    if (categorie.gamesWon > 10) {
      const existingBadge = await checkBadgeAlreadyExistByUser(`Jouer 10 parties de ${categorie.name}`, userIdString)

      if (existingBadge) {
        return existingBadge;
      } else {
        const badge = await Badge.findOne({
          where: {
            label: `Jouer 10 parties de ${categorie.label}`,
          }
        });

        await user.addCategory(badge);
        createdBadges.push(badge);

        return {
          userObtain: true,
          label: badge.label,
          description: badge.description,
          image: badge.image,
          isNew: false,
        }
      }
    } else {
      return;
    }
  };

  const result = await Game.aggregate([
    {
      $match: {
        userId: userIdString,
      },
    },
    {
      $group: {
        _id: { quizzName: "$quizzName" },
        totalScore: { $sum: "$score" },
        gamesPlayed: { $sum: 1 },
        gamesWon: {
          $sum: { $cond: [{ $eq: ["$isWinner", true] }, 1, 0] },
        },
      },
    },
    {
      $sort: {
        totalScore: -1,
      },
    },
    {
      $group: {
        _id: null,
        categories: {
          $push: {
            label: "$_id.quizzName",
            gamesPlayed: "$gamesPlayed",
            gamesWon: "$gamesWon",
            successRate: {
              $multiply: [
                { $divide: ["$gamesWon", "$gamesPlayed"] },
                100,
              ],
            },
            totalScore: "$totalScore"
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

  if (!result[0]) {
    return {
      categoriesStats: [],
      totalGamesStatsAndBadge: [],
      totalGamesPlayed: 0,
      bestCategory: null,
    };
  }

  const stats = [];
  const user = await User.findByPk(userIdString);
  let totalGamesStatsAndBadge = {
    label: "totalGames",
    bestScore: 0,
    gamePlayed: result[0].totalGames,
    badges: [],
  };  

  let bestCategory = null;
  let highestScore = 0;

  console.log(result[0]?.categories, "testing")


  for (const categorie of result[0]?.categories) {
    const categoryBadge = await calculateCategoryBadge(userIdString, categorie);
    if (categoryBadge) {
      totalGamesStatsAndBadge.badges.push(categoryBadge)
      stats.push({
        categorie,
        badges: categoryBadge,
      });
      createdBadges.push(categoryBadge);
    } else {
      stats.push({
        categorie,
      });
    }

    console.log(categorie)
    if (categorie.totalScore > highestScore) {
      bestCategory = categorie.label;
      highestScore = categorie.totalScore;
    }
  }

  // Logique pour déterminer les badges en fonction du nombre de jeux joués
  const gamesNeedBadges = BADGES.filter((badge) => badge.gamesNeeds != undefined);

  for (const badge of gamesNeedBadges) {
    console.log("game need", totalGamesStatsAndBadge.gamePlayed)
    if (result[0].totalGamesPlayed >= badge.gamesNeeds) {
      const newBadge = await getBadgeByLabel(
        userIdString,
        badge.label,
        badge.description,
        badge.image,
        badge.gamesNeeds
      );
      totalGamesStatsAndBadge.badges.push(newBadge);
    } else {

      const existingBadge = await Badge.findOne({
        where: {
          label: badge.label,
        },
      });
      

      if (existingBadge) {
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

  const strikesBadges = await this.getStrikesBadges(userIdString, correctAnswersStrike)

  if(strikesBadges)
  totalGamesStatsAndBadge.badges.push(strikesBadges);
  if (result) {
    return {
      user,
      categoriesStats: stats,
      totalGamesStatsAndBadge,
      totalGamesPlayed: result[0].totalGamesPlayed,
      bestCategory,
      strikesBadges
    };
  } else {
    return null;
  }
};
}

export { GameService };
