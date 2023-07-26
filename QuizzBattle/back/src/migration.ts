import { initMongo } from './db/mongo/db';

const db = require("./db");
const mode = process.argv[2] ?? "alter";
const SequelizeInstance = require("sequelize");

const SequelizeConnection = new SequelizeInstance("postgres://root:password@localhost:5432/app", {
  dialect: "postgres", // Specify the dialect as 'postgres'
});



initMongo()

const createRoutineSQL = `
CREATE OR REPLACE FUNCTION notify_user_update()
RETURNS TRIGGER AS $$
DECLARE
  new_data TEXT;
BEGIN
  new_data := NEW.id || ',' || NEW.firstname;
  PERFORM pg_notify('user_update', new_data);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;
  const createTriggerSQL = `
  CREATE TRIGGER user_update_trigger
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION notify_user_update();
`;

async function createRoutineWithTrigger() {
  try {
    // Créer la fonction stockée (routine)
    await SequelizeConnection.query(createRoutineSQL);
    console.log('Routine (fonction stockée) créée avec succès dans PostgreSQL.');

    // Créer le déclencheur (trigger) associé à la fonction stockée
    await SequelizeConnection.query(createTriggerSQL);
    console.log('Déclencheur (trigger) créé avec succès dans PostgreSQL.');
  } catch (error) {
    console.error('Erreur lors de la création de la routine (fonction stockée) avec le déclencheur (trigger) :', error);
  }
}


db.connection
  .sync({ [mode]: true })
  .then(() => {
    console.log("Database synchronized");

    // Génération des données des utilisateurs à l'aide d'une boucle for
    const usersData = [];
    const numberOfUsers = 50; // Nombre d'utilisateurs à générer

    for (let i = 1; i <= numberOfUsers; i++) {
      const userData = {
        lastname: `Doe ${i}`,
        firstname: `John ${i}`,
        nickname: `John Doe-${i}`,
        email: `john.doe${i}@example.com`,
        password: `password${i}`,
        profilePicturePath: "defaultUser.png",
        score: Math.random() * 100000,
        gamesPlayed: Math.random() * 10,
      };
      usersData.push(userData);
    }

    // Create multiple users
    const users = db.User.bulkCreate(usersData);
    
    // Création d'un quiz test
    try {
      const question1 = db.Question.create({
        label: "Quelle est la capitale de la France ?",
        quizzId: 1,
      });

      const question2 = db.Question.create({
        label: "Quelle est la couleur du ciel ?",
        quizzId: 1,
      });

  
      const initialCategories = [
        'music',
        'sport_and_leisure',
        'film_and_tv',
        'arts_and_literature',
        'history',
        'society_and_culture',
        'science',
        'geography',
        'food_and_drink',
        'general_knowledge'
      ]
      
      const categories =  Promise.all(
        initialCategories.map(async (category) => {
          return await db.Category.create({
            name: category,
            description: 'Description for ' + category,
            image_url: `${category}.jpeg`,
          });
        })
      );
  
   

      Promise.all([question1, question2, categories, users])
        .then(([createdQuestion1, createdQuestion2, categoryCreated, userCreated]) => {
          // Création des réponses associées aux questions
          return Promise.all([
            db.Answer.create({
              label: "Paris",
              isCorrect: true,
              questionId: createdQuestion1.id,
            }),
            db.Answer.create({
              label: "Lyon",
              isCorrect: false,
              questionId: createdQuestion1.id,
            }),
            db.Answer.create({
              label: "Marseille",
              isCorrect: false,
              questionId: createdQuestion1.id,
            }),
            db.Answer.create({
              label: "Grenoble",
              isCorrect: false,
              questionId: createdQuestion1.id,
            }),
            db.Answer.create({
              label: "Bleu",
              isCorrect: true,
              questionId: createdQuestion2.id,
            }),
            db.Answer.create({
              label: "Rouge",
              isCorrect: false,
              questionId: createdQuestion2.id,
            }),
            db.Answer.create({
              label: "Vert",
              isCorrect: false,
              questionId: createdQuestion2.id,
            }),
            db.Answer.create({
              label: "Jaune",
              isCorrect: false,
              questionId: createdQuestion2.id,
            }),
            db.UserCategory.bulkCreate([{
              score: Math.random() * 100000,
              gamesPlayed: Math.random() * 10,
              UserId:userCreated[0].dataValues.id,
              CategoryId: 2,
            },
            {
              score: Math.random() * 100000,
              gamesPlayed: Math.random() * 10,
              UserId:userCreated[1].dataValues.id,
              CategoryId: 1,
            },
            {
              score: Math.random() * 100000,
              gamesPlayed: Math.random() * 10,
              UserId:userCreated[2].dataValues.id,
              CategoryId: 1,
            },
            {
              score: Math.random() * 100000,
              gamesPlayed: Math.random() * 10,
              UserId:userCreated[3].dataValues.id,
              CategoryId: 3,
            },
            {
              score: Math.random() * 100000,
              gamesPlayed: Math.random() * 10,
              UserId:userCreated[4].dataValues.id,
              CategoryId: 4,
            },
            {
              score: Math.random() * 100000,
              gamesPlayed: Math.random() * 10,
              UserId:userCreated[5].dataValues.id,
              CategoryId: 5,
            },
          ]
            ),
          ]);
        })
        .then(() => {
          console.log("Questions et réponses par défaut créées avec succès.");
          createRoutineWithTrigger()

          db.connection.close();
        })
        .catch((error) => {
          console.error("Une erreur s'est produite lors de la création des questions et des réponses :", error);
          db.connection.close();
        });
    } catch (error) {
      console.error("Une erreur s'est produite lors de la création des questions et des réponses :", error);
      db.connection.close();
    }
  })
  .catch((error) => {
    console.error("Une erreur s'est produite lors de la synchronisation de la base de données :", error);
    db.connection.close();
  });
