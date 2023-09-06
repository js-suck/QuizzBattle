import mongoose from 'mongoose';
import { mongoURI } from '../../config/db';
import { Game } from './models/Game';

export const initMongo = async (db ?: any) => {
  try {
    // Connexion réussie à MongoDB
    await mongoose.connect(mongoURI);
    console.log('Connexion à MongoDB réussie');

    if (db) {

      // drop tous les games
      await Game.deleteMany({});

      // Récupérez les utilisateurs existants de la base de données
      const existingUsers = await db.User.findAll({});
      const existingCategories = await db.Category.findAll({});

      if (existingUsers.length < 2) {
        console.log('Il n\'y a pas suffisamment d\'utilisateurs pour créer des jeux fictifs.');
        return;
      }

      if (existingCategories.length === 0) {
        console.log('Aucune catégorie existante pour créer des quizz fictifs.');
        return;
      }

      // Créez des jeux fictifs en utilisant les données des utilisateurs et des catégories
      const fakeGames = [];
      for (const user1 of existingUsers) {
        for (const user2 of existingUsers) {
          if (user1.id !== user2.id) { // Évitez de créer des jeux pour le même utilisateur
            // Sélectionnez aléatoirement une catégorie existante
            const randomCategory = existingCategories[Math.floor(Math.random() * existingCategories.length)];

            fakeGames.push({
              username: user1.nickname,
              quizzName: randomCategory.name, // Utilisez le nom de la catégorie comme quizzName
              userId: user1.id,
              quizzId: randomCategory.id, // Utilisez l'ID de la catégorie comme quizzId (si cela a du sens dans votre modèle)
              score: Math.floor(Math.random() * 100),
              date: new Date(),
              isWinner: Math.random() > 0.5,
              isDraw: Math.random() > 0.5,
              userVsID: user2.id,
              userVsName: user2.nickname,
              userVsScore: Math.floor(Math.random() * 100),
              userProfilePicture: user1.image,
            });
          }
        }
      }

      // Utilisez Mongoose pour insérer les données fictives dans la base de données
      await Game.insertMany(fakeGames);

      console.log('Données de jeux fictives créées avec succès.');
    }
  } catch (error) {
    console.error('Erreur de connexion à MongoDB', error);
  }
};
