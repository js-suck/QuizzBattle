import { initMongo } from './db/mongo/db';
const db = require("./db");
const mode = process.argv[2] ?? "alter";
const SequelizeInstance = require("sequelize");
const SequelizeConnection = new SequelizeInstance("postgres://root:password@localhost:5432/app", {
  dialect: "postgres",
});

initMongo();

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
    await SequelizeConnection.query(createRoutineSQL);
    console.log('Routine (stored function) created successfully in PostgreSQL.');
    await SequelizeConnection.query(createTriggerSQL);
    console.log('Trigger created successfully in PostgreSQL.');
  } catch (error) {
    console.error('Error creating the routine (stored function) with the trigger:', error);
  }
}

async function createDefaultCategories() {
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
  ];

  try {
    return await Promise.all(
        initialCategories.map(async (category) => {
          return await db.Category.create({
            name: category,
            description: 'Description for ' + category,
            image_url: `${category}.jpeg`,
          });
        })
    );
  } catch (error) {
    console.error('An error occurred while creating default categories:', error);
    throw error;
  }
}

async function createDefaultUsersAndQuestions() {
  try {
    console.log("Database synchronized");

    // Generate user data using a for loop
    const usersData = [];
    const numberOfUsers = 50;

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

    const users = await db.User.bulkCreate(usersData);

    // Create default categories and users
    const [categoryCreated, userCreated] = await Promise.all([
      createDefaultCategories(),
      users,
    ]);

    // Store the created questions in variables
    const question1 = await db.Question.create({
      label: "What is the color of the sky?",
      categoryId: categoryCreated[0].id,
    });

    const question2 = await db.Question.create({
      label: "What is the capital of France?",
      categoryId: categoryCreated[0].id,
    });

    const question3 = await db.Question.create({
      label: "What is Angelology the study of?",
      categoryId: categoryCreated[5].id,
    });

    // Create answers using the IDs of the created questions
    await Promise.all([
      db.Answer.create({
        label: "Paris",
        isCorrect: true,
        questionId: question2.id,
      }),
      db.Answer.create({
        label: "Lyon",
        isCorrect: false,
        questionId: question2.id,
      }),
      db.Answer.create({
        label: "Marseille",
        isCorrect: false,
        questionId: question1.id,
      }),
      db.Answer.create({
        label: "Grenoble",
        isCorrect: false,
        questionId: question1.id,
      }),
      db.Answer.create({
        label: "Angels",
        isCorrect: true,
        questionId: question3.id,
      }),
      db.Answer.create({
        label: "numbers",
        isCorrect: false,
        questionId: question3.id,
      }),

      // Add more answers here
    ]);

    // Bulk create UserCategory records
    const userCategoryData = [];
    for (let i = 0; i < userCreated.length; i++) {
      userCategoryData.push({
        score: Math.random() * 100000,
        gamesPlayed: Math.random() * 10,
        userId: userCreated[i].dataValues.id,
        categoryId: categoryCreated[i % categoryCreated.length].dataValues.id,
      });
    }
    await db.UserCategory.bulkCreate(userCategoryData);

    console.log("Default questions and answers created successfully.");
    await createRoutineWithTrigger();

    db.connection.close();
  } catch (error) {
    console.error("An error occurred while creating default questions and answers:", error);
    db.connection.close();
    throw error;
  }
}

async function synchronizeDatabase() {
  try {
    await db.connection.sync({ [mode]: true });
    await createDefaultUsersAndQuestions();
  } catch (error) {
    console.error("An error occurred during database synchronization:", error);
    db.connection.close();
    throw error;
  }
}

synchronizeDatabase().catch((error) => {
  console.error('An error occurred during database synchronization:', error);
});
