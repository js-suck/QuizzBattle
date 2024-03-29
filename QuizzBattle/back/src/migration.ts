import { initMongo } from './db/mongo/db';
import faker from 'faker'; 

const db = require("./db");
const mode = process.argv[2] ?? "force";
const SequelizeInstance = require("sequelize");
const SequelizeConnection = new SequelizeInstance("postgres://root:password@localhost:5432/app", {
  dialect: "postgres",
});


const createRoutineSQL = `
CREATE OR REPLACE FUNCTION notify_user_update()
RETURNS TRIGGER AS $$
DECLARE
  new_data TEXT;
BEGIN
  new_data := NEW.id || ',' || NEW.firstname || ',' || NEW.image ;
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

    // const adminData = {
    //   lastname: `admin`,
    //   firstname: `administrator`,
    //   nickname: `adminos`,
    //   email: `admin@example.com`,
    //   password: `password`,
    //   image: "defaultUser.png",
    //   score: Math.random() * 100000,
    //   gamesPlayed: Math.random() * 10,
    // }

    for (let i = 1; i <= numberOfUsers; i++) {
      const userData = {
        lastname: faker.name.lastName(),
        firstname: faker.name.firstName(),
        nickname: faker.internet.userName(),
        email: faker.internet.email(),
        password: `password${i}`,
        image: "defaultUser.png",
        score: Math.random() * 100000,
        gamesPlayed: Math.random() * 10,
      };
      usersData.push(userData);
    }

    
    const users = await db.User.bulkCreate(usersData);

    const adminData = {
      lastname: "Admin",
      firstname: "Admin",
      nickname: "Admin",
      email: "admin@admin.fr",
      password: "Test1234",
      image: "defaultUser.png",
      score: 0,
      gamesPlayed: 0,
      role: "admin",
    };

    const admin = await db.User.create(adminData);

    // Create default categories and users
    const [categoryCreated, userCreated] = await Promise.all([
      createDefaultCategories(),
      users,
      admin,
    ]);

    const question2 = await db.Question.create({
      label: "What is the capital of France?",
      categoryId: categoryCreated[5].id,
    });

    const question4 = await db.Question.create({
      label: "A heavenly body moving under the attraction of the Sun and consisting of a nucleus and a tail is a(n) _______.",
      categoryId: categoryCreated[6].id,
    });

    const question5 = await db.Question.create({
      label:
        "What gas, discovered in 1774, gets its name from the Greek words for 'acid' and 'forming'?",
      categoryId: categoryCreated[6].id,
    });

    const question6 = await db.Question.create({
      label: "What is Aerobiology the study of?",
      categoryId: categoryCreated[6].id,
    });

    const question7 = await db.Question.create({
      label: "Which of these numbers is not a factor of 15?",
      categoryId: categoryCreated[6].id,
    });

    const question8 = await db.Question.create({
      label: "What is Dermatopathology the study of?",
      categoryId: categoryCreated[6].id,
    });

    const question9 = await db.Question.create({
      label: "What is Gynaecology or Gynecology the study of?",
      categoryId: categoryCreated[6].id,
    });

    const question10 = await db.Question.create({
      label: "Which type of animal are the Sea Wasp and Cubozoa?",
      categoryId: categoryCreated[6].id,
    });

    const question11 = await db.Question.create({
      label: "What is Sarcology the study of?",
      categoryId: categoryCreated[6].id,
    });

    const question12 = await db.Question.create({
      label: "Which of these elements is found in salt?",
      categoryId: categoryCreated[6].id,
    });

    const question13 = await db.Question.create({
      label: "What is Arachnology the study of?",
      categoryId: categoryCreated[6].id,
    });

    const question14 = await db.Question.create({
      label:
        "Which British recording artist, singer, songwriter, musician and record producer released the studio album 'The Sensual World'?",
      categoryId: categoryCreated[0].id,
    });

    const question15 = await db.Question.create({
      label: "Which band was Charlie Watts a member of?",
      categoryId: categoryCreated[0].id,
    });

    const question16 = await db.Question.create({
      label:
        "According to a song by Harry Nilsson, which fruit is put in the coconut?",
      categoryId: categoryCreated[0].id,
    });

    const question17 = await db.Question.create({
      label:
        'Which band is responsible for performing the "South Park" theme song?',
      categoryId: categoryCreated[0].id,
    });

    const question18 = await db.Question.create({
      label: "Who Released The 70's Album 'Superfly'?",
      categoryId: categoryCreated[0].id,
    });

    const question19 = await db.Question.create({
      label: "Which American singer released the song 'Drunk in Love'?",
      categoryId: categoryCreated[0].id,
    });

    const question20 = await db.Question.create({
      label: "Who Composed The Pastoral Symphony?",
      categoryId: categoryCreated[0].id,
    });

    const question21 = await db.Question.create({
      label: "Which musician released the album '\"Heroes\"'?",
      categoryId: categoryCreated[0].id,
    });

    const question22 = await db.Question.create({
      label: "Which musician released the album 'The Rise and Fall of Ziggy Stardust and the Spiders from Mars'?",
      categoryId: categoryCreated[0].id,
    });

    const question23 = await db.Question.create({
      label: "Which English rock band released the song 'Creep'?",
      categoryId: categoryCreated[0].id,
    });

    const question24 = await db.Question.create({
      label:
        "Which word is defined as 'of, pertaining to, or resembling a hedgehog'?",
      categoryId: categoryCreated[1].id,
    });

    const question25 = await db.Question.create({
      label: "What Is A Male Witch Known As?",
      categoryId: categoryCreated[1].id,
    });

    const question26 = await db.Question.create({
      label: "What does the Latin abbreviation term 'e.g.' mean?",
      categoryId: categoryCreated[1].id,
    });

    const question27 = await db.Question.create({
      label: "In phonetics, which of these is an example of an approximant sound?",
      categoryId: categoryCreated[1].id,
    });

    const question28 = await db.Question.create({
      label: "What colour do you get when you mix yellow with red?",
      categoryId: categoryCreated[1].id,
    });

    const question29 = await db.Question.create({
      label: "Which director directed Apollo 13?",
      categoryId: categoryCreated[2].id,
    });

    const question30 = await db.Question.create({
      label:
        "Which character was accompanied by a wizard named Akiro in two 1980s movies?",
      categoryId: categoryCreated[2].id,
    });

    const question31 = await db.Question.create({
      label:
        "In which 1999 film does Bruce Willis meet a boy who can see dead people?",
      categoryId: categoryCreated[2].id,
    });

    const question32 = await db.Question.create({
      label: "Which of these quotes is from the film 'Titanic'?",
      categoryId: categoryCreated[2].id,
    });

    const question33 = await db.Question.create({
      label:
        "Which actor has starred in films including Avengers: Endgame and No Country for Old Men?",
      categoryId: categoryCreated[2].id,
    });

    const question34 = await db.Question.create({
      label:
        "According To The Christmas Song, How Many Drummers Drumming Were There?",
      categoryId: categoryCreated[3].id,
    });

    const question35 = await db.Question.create({
      label:
        "Which 2007 video game by MTV Games lets players form their own band and tour the world, using a number of plastic instruments as controllers?",
      categoryId: categoryCreated[3].id,
    });

    const question36 = await db.Question.create({
      label: "In phonetics, which of these is an example of a plosive sound?",
      categoryId: categoryCreated[3].id,
    });

    const question37 = await db.Question.create({
      label:
        "Which archaic imperial unit of measure is equivalent to 54 gallons?",
      categoryId: categoryCreated[3].id,
    });

    const question38 = await db.Question.create({
      label: "What 3-letter word can precede cord, current, off, and saw?",
      categoryId: categoryCreated[3].id,
    });

    const question39 = await db.Question.create({
      label: "Which US President had the first name 'Calvin'?",
      categoryId: categoryCreated[4].id,
    });

    const question40 = await db.Question.create({
      label:
        "What was the name of the major uprising led by Toussaint L'Ouverture in the 18th century?",
      categoryId: categoryCreated[4].id,
    });

    const question41 = await db.Question.create({
      label:
        "When did the United States transfer the Panama Canal to Panamanian control?",
      categoryId: categoryCreated[4].id,
    });

    const question42 = await db.Question.create({
      label: "Who was the first First Lady to be received privately by the Pope?",
      categoryId: categoryCreated[4].id,
    });

    const question43 = await db.Question.create({
      label: 'Who is reputed to have said: "Let them eat cake"?',
      categoryId: categoryCreated[4].id,
    });

    const question44 = await db.Question.create({
      label: "What organization was Dag Hammarskjold once the leader of?",
      categoryId: categoryCreated[5].id,
    });

    const question45 = await db.Question.create({
      label:
        "Which philosopher famously said 'Whatever is reasonable is true, and whatever is true is reasonable'?",
      categoryId: categoryCreated[5].id,
    });

    const question46 = await db.Question.create({
      label: "On which day of the week does Lent begin?",
      categoryId: categoryCreated[5].id,
    });

    const question47 = await db.Question.create({
      label: "Who is the Greek equivalent of the Roman god Neptune?",
      categoryId: categoryCreated[5].id,
    });

    const question48 = await db.Question.create({
      label:
        "What is the name of the strictly protected bird, about the size of a chicken, that is native to New Zealand?",
      categoryId: categoryCreated[5].id,
    });

    const question49 = await db.Question.create({
      label: "What organization was Dag Hammarskjold once the leader of?",
      categoryId: categoryCreated[7].id,
    });

    const question50 = await db.Question.create({
      label:
        "Which philosopher famously said 'Whatever is reasonable is true, and whatever is true is reasonable'?",
      categoryId: categoryCreated[7].id,
    });

    const question51 = await db.Question.create({
      label: "On which day of the week does Lent begin?",
      categoryId: categoryCreated[7].id,
    });

    const question52 = await db.Question.create({
      label: "Who is the Greek equivalent of the Roman god Neptune?",
      categoryId: categoryCreated[7].id,
    });

    const question53 = await db.Question.create({
      label:
        "What is the name of the strictly protected bird, about the size of a chicken, that is native to New Zealand?",
      categoryId: categoryCreated[7].id,
    });

    const question54 = await db.Question.create({
      label:
        "What is the name of the Japanese food made from the gonads of sea urchins?",
      categoryId: categoryCreated[8].id,
    });

    const question55 = await db.Question.create({
      label: "What type of pasta is cavatelli?",
      categoryId: categoryCreated[8].id,
    });

    const question56 = await db.Question.create({
      label:
        "Cou Cou and Flying Fish is a dish that is most associated with which part of the world?",
      categoryId: categoryCreated[8].id,
    });

    const question57 = await db.Question.create({
      label: "Which of these fruits is a drupe?",
      categoryId: categoryCreated[8].id,
    });

    const question58 = await db.Question.create({
      label: "What is the main ingredient in Meringue?",
      categoryId: categoryCreated[8].id,
    });

    const question59 = await db.Question.create({
      label: "Which word is defined as 'the day before yesterday'?",
      categoryId: categoryCreated[9].id,
    });

    const question60 = await db.Question.create({
      label:
        "Which term meaning 'to rigidly categorize' comes from small desk compartments?",
      categoryId: categoryCreated[9].id,
    });

    const question61 = await db.Question.create({
      label: "Which word is defined as 'a great deal of fuss or trouble'?",
      categoryId: categoryCreated[9].id,
    });

    const question62 = await db.Question.create({
      label: "What is the meaning of the word 'Vostok' in Russian?",
      categoryId: categoryCreated[9].id,
    });

    const question63 = await db.Question.create({
      label: "Which word is defined as 'having an unfriendly disposition'?",
      categoryId: categoryCreated[9].id,
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
        questionId: question2.id,
      }),
      db.Answer.create({
        label: "Grenoble",
        isCorrect: false,
        questionId: question2.id,
      }),
      db.Answer.create({
        label: "Comet",
        isCorrect: true,
        questionId: question4.id,
      }),
      db.Answer.create({
        label: "Moon",
        isCorrect: false,
        questionId: question4.id,
      }),
      db.Answer.create({
        label: "Meteor",
        isCorrect: false,
        questionId: question4.id,
      }),
      db.Answer.create({
        label: "Satellite",
        isCorrect: false,
        questionId: question4.id,
      }),
      db.Answer.create({
        label: "Carbon dioxide",
        isCorrect: true,
        questionId: question5.id,
      }),
      db.Answer.create({
        label: "Oxygen",
        isCorrect: false,
        questionId: question5.id,
      }),
      db.Answer.create({
        label: "Hydrogen",
        isCorrect: false,
        questionId: question5.id,
      }),
      db.Answer.create({
        label: "Nitrogen",
        isCorrect: false,
        questionId: question5.id,
      }),
      db.Answer.create({
        label: "Organic particles",
        isCorrect: true,
        questionId: question6.id,
      }),
      db.Answer.create({
        label: "Existence",
        isCorrect: false,
        questionId: question6.id,
      }),
      db.Answer.create({
        label: "Ticks and mites",
        isCorrect: false,
        questionId: question6.id,
      }),
      db.Answer.create({
        label: "Sleep",
        isCorrect: false,
        questionId: question6.id,
      }),
      db.Answer.create({
        label: "4",
        isCorrect: true,
        questionId: question7.id,
      }),
      db.Answer.create({
        label: "3",
        isCorrect: false,
        questionId: question7.id,
      }),
      db.Answer.create({
        label: "5",
        isCorrect: false,
        questionId: question7.id,
      }),
      db.Answer.create({
        label: "1",
        isCorrect: false,
        questionId: question7.id,
      }),
      db.Answer.create({
        label: "Skin diseases",
        isCorrect: true,
        questionId: question8.id,
      }),
      db.Answer.create({
        label: "Bones",
        isCorrect: false,
        questionId: question8.id,
      }),
      db.Answer.create({
        label: "Eyes",
        isCorrect: false,
        questionId: question8.id,
      }),
      db.Answer.create({
        label: "Teeth",
        isCorrect: false,
        questionId: question8.id,
      }),
      db.Answer.create({
        label: "medicine relating to women, or of women in general",
        isCorrect: true,
        questionId: question9.id,
      }),
      db.Answer.create({
        label: "prehistoric climates",
        isCorrect: false,
        questionId: question9.id,
      }),
      db.Answer.create({
        label: "the study of the history of the Earth",
        isCorrect: false,
        questionId: question9.id,
      }),
      db.Answer.create({
        label: "fungus + -ology, see mycology",
        isCorrect: false,
        questionId: question9.id,
      }),
      db.Answer.create({
        label: "Jellyfish",
        isCorrect: true,
        questionId: question10.id,
      }),
      db.Answer.create({
        label: "Fish",
        isCorrect: false,
        questionId: question10.id,
      }),
      db.Answer.create({
        label: "Crustaceans",
        isCorrect: false,
        questionId: question10.id,
      }),
      db.Answer.create({
        label: "Mammals",
        isCorrect: false,
        questionId: question10.id,
      }),
      db.Answer.create({
        label: "a subsection of anatomy that studies the soft parts",
        isCorrect: true,
        questionId: question11.id,
      }),
      db.Answer.create({
        label: "the belief system/cult religion founded by L",
        isCorrect: false,
        questionId: question11.id,
      }),
      db.Answer.create({
        label: "the study of the history of the Earth",
        isCorrect: false,
        questionId: question11.id,
      }),
      db.Answer.create({
        label: "cancer",
        isCorrect: false,
        questionId: question11.id,
      }),
      db.Answer.create({
        label: "Sodium",
        isCorrect: true,
        questionId: question12.id,
      }),
      db.Answer.create({
        label: "Chlorine",
        isCorrect: false,
        questionId: question12.id,
      }),
      db.Answer.create({
        label: "Calcium",
        isCorrect: false,
        questionId: question12.id,
      }),
      db.Answer.create({
        label: "Magnesium",
        isCorrect: false,
        questionId: question12.id,
      }),
      db.Answer.create({
        label: "Spiders",
        isCorrect: true,
        questionId: question13.id,
      }),
      db.Answer.create({
        label: "Birds",
        isCorrect: false,
        questionId: question13.id,
      }),
      db.Answer.create({
        label: "Fish",
        isCorrect: false,
        questionId: question13.id,
      }),
      db.Answer.create({
        label: "Mammals",
        isCorrect: false,
        questionId: question13.id,
      }),
      db.Answer.create({
        label: "Kate Bush",
        isCorrect: true,
        questionId: question14.id,
      }),
      db.Answer.create({
        label: "David Bowie",
        isCorrect: false,
        questionId: question14.id,
      }),
      db.Answer.create({
        label: "George Michael",
        isCorrect: false,
        questionId: question14.id,
      }),
      db.Answer.create({
        label: "Elton John",
        isCorrect: false,
        questionId: question14.id,
      }),
      db.Answer.create({
        label: "The Rolling Stones",
        isCorrect: true,
        questionId: question15.id,
      }),
      db.Answer.create({
        label: "The Beatles",
        isCorrect: false,
        questionId: question15.id,
      }),
      db.Answer.create({
        label: "The Who",
        isCorrect: false,
        questionId: question15.id,
      }),
      db.Answer.create({
        label: "The Kinks",
        isCorrect: false,
        questionId: question15.id,
      }),
      db.Answer.create({
        label: "The Lime",
        isCorrect: true,
        questionId: question16.id,
      }),
      db.Answer.create({
        label: "The Mango",
        isCorrect: false,
        questionId: question16.id,
      }),
      db.Answer.create({
        label: "The Pineapple",
        isCorrect: false,
        questionId: question16.id,
      }),
      db.Answer.create({
        label: "The Orange",
        isCorrect: false,
        questionId: question16.id,
      }),
      db.Answer.create({
        label: "Primus",
        isCorrect: true,
        questionId: question17.id,
      }),
      db.Answer.create({
        label: "Metallica",
        isCorrect: false,
        questionId: question17.id,
      }),
      db.Answer.create({
        label: "Megadeth",
        isCorrect: false,
        questionId: question17.id,
      }),
      db.Answer.create({
        label: "Slayer",
        isCorrect: false,
        questionId: question17.id,
      }),
      db.Answer.create({
        label: "Curtis Mayfield",
        isCorrect: true,
        questionId: question18.id,
      }),
      db.Answer.create({
        label: "Marvin Gaye",
        isCorrect: false,
        questionId: question18.id,
      }),
      db.Answer.create({
        label: "Stevie Wonder",
        isCorrect: false,
        questionId: question18.id,
      }),
      db.Answer.create({
        label: "Isaac Hayes",
        isCorrect: false,
        questionId: question18.id,
      }),
      db.Answer.create({
        label: "Beyoncé",
        isCorrect: true,
        questionId: question19.id,
      }),
      db.Answer.create({
        label: "Rihanna",
        isCorrect: false,
        questionId: question19.id,
      }),
      db.Answer.create({
        label: "Alicia Keys",
        isCorrect: false,
        questionId: question19.id,
      }),
      db.Answer.create({
        label: "Ariana Grande",
        isCorrect: false,
        questionId: question19.id,
      }),
      db.Answer.create({
        label: "Beethoven",
        isCorrect: true,
        questionId: question20.id,
      }),
      db.Answer.create({
        label: "Mozart",
        isCorrect: false,
        questionId: question20.id,
      }),
      db.Answer.create({
        label: "Bach",
        isCorrect: false,
        questionId: question20.id,
      }),
      db.Answer.create({
        label: "Chopin",
        isCorrect: false,
        questionId: question20.id,
      }),
      db.Answer.create({
        label: "David Bowie",
        isCorrect: true,
        questionId: question21.id,
      }),
      db.Answer.create({
        label: "Elton John",
        isCorrect: false,
        questionId: question21.id,
      }),
      db.Answer.create({
        label: "Queen",
        isCorrect: false,
        questionId: question21.id,
      }),
      db.Answer.create({
        label: "The Rolling Stones",
        isCorrect: false,
        questionId: question21.id,
      }),
      db.Answer.create({
        label: "David Bowie",
        isCorrect: true,
        questionId: question22.id,
      }),
      db.Answer.create({
        label: "Elton John",
        isCorrect: false,
        questionId: question22.id,
      }),
      db.Answer.create({
        label: "Queen",
        isCorrect: false,
        questionId: question22.id,
      }),
      db.Answer.create({
        label: "The Rolling Stones",
        isCorrect: false,
        questionId: question22.id,
      }),
      db.Answer.create({
        label: "Radiohead",
        isCorrect: true,
        questionId: question23.id,
      }),
      db.Answer.create({
        label: "The Beatles",
        isCorrect: false,
        questionId: question23.id,
      }),
      db.Answer.create({
        label: "The Who",
        isCorrect: false,
        questionId: question23.id,
      }),
      db.Answer.create({
        label: "The Kinks",
        isCorrect: false,
        questionId: question23.id,
      }),
      // db.Answer.create({
      //   label: "Comet",
      //   isCorrect: true,
      //   questionId: question4.id,
      // }),
      // db.Answer.create({
      //   label: "Moon",
      //   isCorrect: false,
      //   questionId: question4.id,
      // }),
      // db.Answer.create({
      //   label: "Meteor",
      //   isCorrect: false,
      //   questionId: question4.id,
      // }),
      // db.Answer.create({
      //   label: "Satellite",
      //   isCorrect: false,
      //   questionId: question4.id,
      // }),
      // db.Answer.create({
      //   label: "Carbon dioxide",
      //   isCorrect: true,
      //   questionId: question5.id,
      // }),
      // db.Answer.create({
      //   label: "Oxygen",
      //   isCorrect: false,
      //   questionId: question5.id,
      // }),
      // db.Answer.create({
      //   label: "Hydrogen",
      //   isCorrect: false,
      //   questionId: question5.id,
      // }),
      // db.Answer.create({
      //   label: "Nitrogen",
      //   isCorrect: false,
      //   questionId: question5.id,
      // }),
      // db.Answer.create({
      //   label: "Organic particles",
      //   isCorrect: true,
      //   questionId: question6.id,
      // }),
      // db.Answer.create({
      //   label: "Existence",
      //   isCorrect: false,
      //   questionId: question6.id,
      // }),
      // db.Answer.create({
      //   label: "Ticks and mites",
      //   isCorrect: false,
      //   questionId: question6.id,
      // }),
      // db.Answer.create({
      //   label: "Sleep",
      //   isCorrect: false,
      //   questionId: question6.id,
      // }),
      // db.Answer.create({
      //   label: "4",
      //   isCorrect: true,
      //   questionId: question7.id,
      // }),
      // db.Answer.create({
      //   label: "3",
      //   isCorrect: false,
      //   questionId: question7.id,
      // }),
      // db.Answer.create({
      //   label: "5",
      //   isCorrect: false,
      //   questionId: question7.id,
      // }),
      // db.Answer.create({
      //   label: "1",
      //   isCorrect: false,
      //   questionId: question7.id,
      // }),
      // db.Answer.create({
      //   label: "Skin diseases",
      //   isCorrect: true,
      //   questionId: question8.id,
      // }),
      // db.Answer.create({
      //   label: "Bones",
      //   isCorrect: false,
      //   questionId: question8.id,
      // }),
      // db.Answer.create({
      //   label: "Eyes",
      //   isCorrect: false,
      //   questionId: question8.id,
      // }),
      // db.Answer.create({
      //   label: "Teeth",
      //   isCorrect: false,
      //   questionId: question8.id,
      // }),
      // db.Answer.create({
      //   label: "medicine relating to women, or of women in general",
      //   isCorrect: true,
      //   questionId: question9.id,
      // }),
      // db.Answer.create({
      //   label: "prehistoric climates",
      //   isCorrect: false,
      //   questionId: question9.id,
      // }),
      // db.Answer.create({
      //   label: "the study of the history of the Earth",
      //   isCorrect: false,
      //   questionId: question9.id,
      // }),
      // db.Answer.create({
      //   label: "fungus + -ology, see mycology",
      //   isCorrect: false,
      //   questionId: question9.id,
      // }),
      // db.Answer.create({
      //   label: "Jellyfish",
      //   isCorrect: true,
      //   questionId: question10.id,
      // }),
      // db.Answer.create({
      //   label: "Fish",
      //   isCorrect: false,
      //   questionId: question10.id,
      // }),
      // db.Answer.create({
      //   label: "Crustaceans",
      //   isCorrect: false,
      //   questionId: question10.id,
      // }),
      // db.Answer.create({
      //   label: "Mammals",
      //   isCorrect: false,
      //   questionId: question10.id,
      // }),
      // db.Answer.create({
      //   label: "a subsection of anatomy that studies the soft parts",
      //   isCorrect: true,
      //   questionId: question11.id,
      // }),
      // db.Answer.create({
      //   label: "the belief system/cult religion founded by L",
      //   isCorrect: false,
      //   questionId: question11.id,
      // }),
      // db.Answer.create({
      //   label: "the study of the history of the Earth",
      //   isCorrect: false,
      //   questionId: question11.id,
      // }),
      // db.Answer.create({
      //   label: "cancer",
      //   isCorrect: false,
      //   questionId: question11.id,
      // }),
      // db.Answer.create({
      //   label: "Sodium",
      //   isCorrect: true,
      //   questionId: question12.id,
      // }),
      // db.Answer.create({
      //   label: "Chlorine",
      //   isCorrect: false,
      //   questionId: question12.id,
      // }),
      // db.Answer.create({
      //   label: "Calcium",
      //   isCorrect: false,
      //   questionId: question12.id,
      // }),
      // db.Answer.create({
      //   label: "Magnesium",
      //   isCorrect: false,
      //   questionId: question12.id,
      // }),
      // db.Answer.create({
      //   label: "Spiders",
      //   isCorrect: true,
      //   questionId: question13.id,
      // }),
      // db.Answer.create({
      //   label: "Birds",
      //   isCorrect: false,
      //   questionId: question13.id,
      // }),
      // db.Answer.create({
      //   label: "Fish",
      //   isCorrect: false,
      //   questionId: question13.id,
      // }),
      // db.Answer.create({
      //   label: "Mammals",
      //   isCorrect: false,
      //   questionId: question13.id,
      // }),
      // db.Answer.create({
      //   label: "Kate Bush",
      //   isCorrect: true,
      //   questionId: question14.id,
      // }),
      // db.Answer.create({
      //   label: "David Bowie",
      //   isCorrect: false,
      //   questionId: question14.id,
      // }),
      // db.Answer.create({
      //   label: "George Michael",
      //   isCorrect: false,
      //   questionId: question14.id,
      // }),
      // db.Answer.create({
      //   label: "Elton John",
      //   isCorrect: false,
      //   questionId: question14.id,
      // }),
      // db.Answer.create({
      //   label: "The Rolling Stones",
      //   isCorrect: true,
      //   questionId: question15.id,
      // }),
      // db.Answer.create({
      //   label: "The Beatles",
      //   isCorrect: false,
      //   questionId: question15.id,
      // }),
      // db.Answer.create({
      //   label: "The Who",
      //   isCorrect: false,
      //   questionId: question15.id,
      // }),
      // db.Answer.create({
      //   label: "The Kinks",
      //   isCorrect: false,
      //   questionId: question15.id,
      // }),
      // db.Answer.create({
      //   label: "The Lime",
      //   isCorrect: true,
      //   questionId: question16.id,
      // }),
      // db.Answer.create({
      //   label: "The Mango",
      //   isCorrect: false,
      //   questionId: question16.id,
      // }),
      // db.Answer.create({
      //   label: "The Pineapple",
      //   isCorrect: false,
      //   questionId: question16.id,
      // }),
      // db.Answer.create({
      //   label: "The Orange",
      //   isCorrect: false,
      //   questionId: question16.id,
      // }),
      // db.Answer.create({
      //   label: "Primus",
      //   isCorrect: true,
      //   questionId: question17.id,
      // }),
      // db.Answer.create({
      //   label: "Metallica",
      //   isCorrect: false,
      //   questionId: question17.id,
      // }),
      // db.Answer.create({
      //   label: "Megadeth",
      //   isCorrect: false,
      //   questionId: question17.id,
      // }),
      // db.Answer.create({
      //   label: "Slayer",
      //   isCorrect: false,
      //   questionId: question17.id,
      // }),
      // db.Answer.create({
      //   label: "Curtis Mayfield",
      //   isCorrect: true,
      //   questionId: question18.id,
      // }),
      // db.Answer.create({
      //   label: "Marvin Gaye",
      //   isCorrect: false,
      //   questionId: question18.id,
      // }),
      // db.Answer.create({
      //   label: "Stevie Wonder",
      //   isCorrect: false,
      //   questionId: question18.id,
      // }),
      // db.Answer.create({
      //   label: "Isaac Hayes",
      //   isCorrect: false,
      //   questionId: question18.id,
      // }),
      // db.Answer.create({
      //   label: "Beyoncé",
      //   isCorrect: true,
      //   questionId: question19.id,
      // }),
      // db.Answer.create({
      //   label: "Rihanna",
      //   isCorrect: false,
      //   questionId: question19.id,
      // }),
      // db.Answer.create({
      //   label: "Alicia Keys",
      //   isCorrect: false,
      //   questionId: question19.id,
      // }),
      // db.Answer.create({
      //   label: "Ariana Grande",
      //   isCorrect: false,
      //   questionId: question19.id,
      // }),
      // db.Answer.create({
      //   label: "Beethoven",
      //   isCorrect: true,
      //   questionId: question20.id,
      // }),
      // db.Answer.create({
      //   label: "Mozart",
      //   isCorrect: false,
      //   questionId: question20.id,
      // }),
      // db.Answer.create({
      //   label: "Bach",
      //   isCorrect: false,
      //   questionId: question20.id,
      // }),
      // db.Answer.create({
      //   label: "Chopin",
      //   isCorrect: false,
      //   questionId: question20.id,
      // }),
      // db.Answer.create({
      //   label: "David Bowie",
      //   isCorrect: true,
      //   questionId: question21.id,
      // }),
      // db.Answer.create({
      //   label: "Elton John",
      //   isCorrect: false,
      //   questionId: question21.id,
      // }),
      // db.Answer.create({
      //   label: "Queen",
      //   isCorrect: false,
      //   questionId: question21.id,
      // }),
      // db.Answer.create({
      //   label: "The Rolling Stones",
      //   isCorrect: false,
      //   questionId: question21.id,
      // }),
      // db.Answer.create({
      //   label: "David Bowie",
      //   isCorrect: true,
      //   questionId: question22.id,
      // }),
      // db.Answer.create({
      //   label: "Elton John",
      //   isCorrect: false,
      //   questionId: question22.id,
      // }),
      // db.Answer.create({
      //   label: "Queen",
      //   isCorrect: false,
      //   questionId: question22.id,
      // }),
      // db.Answer.create({
      //   label: "The Rolling Stones",
      //   isCorrect: false,
      //   questionId: question22.id,
      // }),
      // db.Answer.create({
      //   label: "Radiohead",
      //   isCorrect: true,
      //   questionId: question23.id,
      // }),
      // db.Answer.create({
      //   label: "The Beatles",
      //   isCorrect: false,
      //   questionId: question23.id,
      // }),
      // db.Answer.create({
      //   label: "The Who",
      //   isCorrect: false,
      //   questionId: question23.id,
      // }),
      // db.Answer.create({
      //   label: "The Kinks",
      //   isCorrect: false,
      //   questionId: question23.id,
      // }),

      db.Answer.create({
        label: "Erinaceous",
        isCorrect: true,
        questionId: question24.id,
      }),
      db.Answer.create({
        label: "Sprunt",
        isCorrect: false,
        questionId: question24.id,
      }),
      db.Answer.create({
        label: "Whippersnapper",
        isCorrect: false,
        questionId: question24.id,
      }),
      db.Answer.create({
        label: "Frankenfood",
        isCorrect: false,
        questionId: question24.id,
      }),

      db.Answer.create({
        label: "Warlock",
        isCorrect: true,
        questionId: question25.id,
      }),
      db.Answer.create({
        label: "Mage",
        isCorrect: false,
        questionId: question25.id,
      }),
      db.Answer.create({
        label: "Magus",
        isCorrect: false,
        questionId: question25.id,
      }),
      db.Answer.create({
        label: "Magician",
        isCorrect: false,
        questionId: question25.id,
      }),

      db.Answer.create({
        label: "For example",
        isCorrect: true,
        questionId: question26.id,
      }),
      db.Answer.create({
        label: "And another thing",
        isCorrect: false,
        questionId: question26.id,
      }),
      db.Answer.create({
        label: "In other words",
        isCorrect: false,
        questionId: question26.id,
      }),
      db.Answer.create({
        label: "And so on",
        isCorrect: false,
        questionId: question26.id,
      }),
      db.Answer.create({
        label: "The r in 'red'",
        isCorrect: true,
        questionId: question27.id,
      }),
      db.Answer.create({
        label: "The ch in 'cheese'",
        isCorrect: false,
        questionId: question27.id,
      }),
      db.Answer.create({
        label: "The t in 'train'",
        isCorrect: false,
        questionId: question27.id,
      }),
      db.Answer.create({
        label: "The sh in 'shop'",
        isCorrect: false,
        questionId: question27.id,
      }),

      db.Answer.create({
        label: "Orange",
        isCorrect: true,
        questionId: question28.id,
      }),
      db.Answer.create({
        label: "Red",
        isCorrect: false,
        questionId: question28.id,
      }),
      db.Answer.create({
        label: "Blue",
        isCorrect: false,
        questionId: question28.id,
      }),
      db.Answer.create({
        label: "Purple",
        isCorrect: false,
        questionId: question28.id,
      }),

      db.Answer.create({
        label: "Ron Howard",
        isCorrect: true,
        questionId: question29.id,
      }),
      db.Answer.create({
        label: "Steven Spielberg",
        isCorrect: false,
        questionId: question29.id,
      }),
      db.Answer.create({
        label: "Woody Allen",
        isCorrect: false,
        questionId: question29.id,
      }),
      db.Answer.create({
        label: "Martin Scorsese",
        isCorrect: false,
        questionId: question29.id,
      }),

      db.Answer.create({
        label: "Conan",
        isCorrect: true,
        questionId: question30.id,
      }),
      db.Answer.create({
        label: "Hercules",
        isCorrect: false,
        questionId: question30.id,
      }),
      db.Answer.create({
        label: "Thor",
        isCorrect: false,
        questionId: question30.id,
      }),
      db.Answer.create({
        label: "Xena",
        isCorrect: false,
        questionId: question30.id,
      }),

      db.Answer.create({
        label: "The Sixth Sense",
        isCorrect: true,
        questionId: question31.id,
      }),
      db.Answer.create({
        label: "The Others",
        isCorrect: false,
        questionId: question31.id,
      }),
      db.Answer.create({
        label: "The Ring",
        isCorrect: false,
        questionId: question31.id,
      }),
      db.Answer.create({
        label: "The Grudge",
        isCorrect: false,
        questionId: question31.id,
      }),

      db.Answer.create({
        label: '"I\'m the king of the world!"',
        isCorrect: true,
        questionId: question32.id,
      }),
      db.Answer.create({
        label: '"That is so fetch."',
        isCorrect: false,
        questionId: question32.id,
      }),
      db.Answer.create({
        label:
          '"This is the day you will always remember as the day you almost caught Captain Jack Sparrow!"',
        isCorrect: false,
        questionId: question32.id,
      }),
      db.Answer.create({
        label: "\"Wait a minute, wait a minute. You ain't heard nothin' yet!\"",
        isCorrect: false,
        questionId: question32.id,
      }),

      db.Answer.create({
        label: "Josh Brolin",
        isCorrect: true,
        questionId: question33.id,
      }),
      db.Answer.create({
        label: "Michael Douglas",
        isCorrect: false,
        questionId: question33.id,
      }),
      db.Answer.create({
        label: "Ben Kingsley",
        isCorrect: false,
        questionId: question33.id,
      }),
      db.Answer.create({
        label: "Kiefer Sutherland",
        isCorrect: false,
        questionId: question33.id,
      }),

      db.Answer.create({
        label: "12",
        isCorrect: true,
        questionId: question34.id,
      }),
      db.Answer.create({
        label: "11",
        isCorrect: false,
        questionId: question34.id,
      }),
      db.Answer.create({
        label: "10",
        isCorrect: false,
        questionId: question34.id,
      }),
      db.Answer.create({
        label: "9",
        isCorrect: false,
        questionId: question34.id,
      }),

      db.Answer.create({
        label: "Rock Band",
        isCorrect: true,
        questionId: question35.id,
      }),
      db.Answer.create({
        label: "Guitar Hero",
        isCorrect: false,
        questionId: question35.id,
      }),
      db.Answer.create({
        label: "Dance Dance Revolution",
        isCorrect: false,
        questionId: question35.id,
      }),
      db.Answer.create({
        label: "SingStar",
        isCorrect: false,
        questionId: question35.id,
      }),

      db.Answer.create({
        label: "The g in 'green'",
        isCorrect: true,
        questionId: question36.id,
      }),
      db.Answer.create({
        label: "The v in 'village'",
        isCorrect: false,
        questionId: question36.id,
      }),
      db.Answer.create({
        label: "The r in 'red'",
        isCorrect: false,
        questionId: question36.id,
      }),
      db.Answer.create({
        label: "The m in 'mother'",
        isCorrect: false,
        questionId: question36.id,
      }),

      db.Answer.create({
        label: "A Hogshead",
        isCorrect: true,
        questionId: question37.id,
      }),
      db.Answer.create({
        label: "An Alekeg",
        isCorrect: false,
        questionId: question37.id,
      }),
      db.Answer.create({
        label: "A Bogteen",
        isCorrect: false,
        questionId: question37.id,
      }),
      db.Answer.create({
        label: "A Grond",
        isCorrect: false,
        questionId: question37.id,
      }),

      db.Answer.create({
        label: "Rip",
        isCorrect: true,
        questionId: question38.id,
      }),
      db.Answer.create({
        label: "Cut",
        isCorrect: false,
        questionId: question38.id,
      }),
      db.Answer.create({
        label: "Dry",
        isCorrect: false,
        questionId: question38.id,
      }),
      db.Answer.create({
        label: "Fly",
        isCorrect: false,
        questionId: question38.id,
      }),

      db.Answer.create({
        label: "Calvin Coolidge",
        isCorrect: true,
        questionId: question39.id,
      }),
      db.Answer.create({
        label: "Calvin Reagan",
        isCorrect: false,
        questionId: question39.id,
      }),
      db.Answer.create({
        label: "Calvin Nixon",
        isCorrect: false,
        questionId: question39.id,
      }),
      db.Answer.create({
        label: "Calvin Benington",
        isCorrect: false,
        questionId: question39.id,
      }),

      db.Answer.create({
        label: "Haitian Revolution",
        isCorrect: true,
        questionId: question40.id,
      }),
      db.Answer.create({
        label: "Liberian Revolution",
        isCorrect: false,
        questionId: question40.id,
      }),
      db.Answer.create({
        label: "American Revolution",
        isCorrect: false,
        questionId: question40.id,
      }),
      db.Answer.create({
        label: "French Revolution",
        isCorrect: false,
        questionId: question40.id,
      }),

      db.Answer.create({
        label: "1999",
        isCorrect: true,
        questionId: question41.id,
      }),
      db.Answer.create({
        label: "1987",
        isCorrect: false,
        questionId: question41.id,
      }),
      db.Answer.create({
        label: "1991",
        isCorrect: false,
        questionId: question41.id,
      }),
      db.Answer.create({
        label: "1979",
        isCorrect: false,
        questionId: question41.id,
      }),

      db.Answer.create({
        label: "Jackie Kennedy",
        isCorrect: true,
        questionId: question42.id,
      }),
      db.Answer.create({
        label: "Michelle Obama",
        isCorrect: false,
        questionId: question42.id,
      }),
      db.Answer.create({
        label: "Mary Todd Lincoln",
        isCorrect: false,
        questionId: question42.id,
      }),
      db.Answer.create({
        label: "Barbara Bush",
        isCorrect: false,
        questionId: question42.id,
      }),

      db.Answer.create({
        label: "Marie Antoinette",
        isCorrect: true,
        questionId: question43.id,
      }),
      db.Answer.create({
        label: "Queen Victoria",
        isCorrect: false,
        questionId: question43.id,
      }),
      db.Answer.create({
        label: "Abraham Lincoln",
        isCorrect: false,
        questionId: question43.id,
      }),
      db.Answer.create({
        label: "Cleopatra",
        isCorrect: false,
        questionId: question43.id,
      }),

      db.Answer.create({
        label: "United Nations",
        isCorrect: true,
        questionId: question44.id,
      }),
      db.Answer.create({
        label: "World Health Organization",
        isCorrect: false,
        questionId: question44.id,
      }),
      db.Answer.create({
        label: "World Bank",
        isCorrect: false,
        questionId: question44.id,
      }),
      db.Answer.create({
        label: "International Monetary Fund",
        isCorrect: false,
        questionId: question44.id,
      }),

      db.Answer.create({
        label: "G. W. F. Hegel",
        isCorrect: true,
        questionId: question45.id,
      }),
      db.Answer.create({
        label: "Jean-Paul Sartre",
        isCorrect: false,
        questionId: question45.id,
      }),
      db.Answer.create({
        label: "Spinoza",
        isCorrect: false,
        questionId: question45.id,
      }),
      db.Answer.create({
        label: "Ludwig Wittgenstein",
        isCorrect: false,
        questionId: question45.id,
      }),

      db.Answer.create({
        label: "Ash Wednesday",
        isCorrect: true,
        questionId: question46.id,
      }),
      db.Answer.create({
        label: "Palm Sunday",
        isCorrect: false,
        questionId: question46.id,
      }),
      db.Answer.create({
        label: "Good Friday",
        isCorrect: false,
        questionId: question46.id,
      }),
      db.Answer.create({
        label: "Easter Sunday",
        isCorrect: false,
        questionId: question46.id,
      }),

      db.Answer.create({
        label: "Poseidon",
        isCorrect: true,
        questionId: question47.id,
      }),
      db.Answer.create({
        label: "Athena",
        isCorrect: false,
        questionId: question47.id,
      }),
      db.Answer.create({
        label: "Hades",
        isCorrect: false,
        questionId: question47.id,
      }),
      db.Answer.create({
        label: "Demeter",
        isCorrect: false,
        questionId: question47.id,
      }),

      db.Answer.create({
        label: "Kiwi",
        isCorrect: true,
        questionId: question48.id,
      }),
      db.Answer.create({
        label: "Emu",
        isCorrect: false,
        questionId: question48.id,
      }),
      db.Answer.create({
        label: "Penguin",
        isCorrect: false,
        questionId: question48.id,
      }),
      db.Answer.create({
        label: "Ostrich",
        isCorrect: false,
        questionId: question48.id,
      }),

      db.Answer.create({
        label: "United Nations",
        isCorrect: true,
        questionId: question49.id,
      }),
      db.Answer.create({
        label: "World Health Organization",
        isCorrect: false,
        questionId: question49.id,
      }),
      db.Answer.create({
        label: "World Bank",
        isCorrect: false,
        questionId: question49.id,
      }),
      db.Answer.create({
        label: "International Monetary Fund",
        isCorrect: false,
        questionId: question49.id,
      }),

      db.Answer.create({
        label: "G. W. F. Hegel",
        isCorrect: true,
        questionId: question50.id,
      }),
      db.Answer.create({
        label: "Jean-Paul Sartre",
        isCorrect: false,
        questionId: question50.id,
      }),
      db.Answer.create({
        label: "Spinoza",
        isCorrect: false,
        questionId: question50.id,
      }),
      db.Answer.create({
        label: "Ludwig Wittgenstein",
        isCorrect: false,
        questionId: question50.id,
      }),

      db.Answer.create({
        label: "Ash Wednesday",
        isCorrect: true,
        questionId: question51.id,
      }),
      db.Answer.create({
        label: "Palm Sunday",
        isCorrect: false,
        questionId: question51.id,
      }),
      db.Answer.create({
        label: "Good Friday",
        isCorrect: false,
        questionId: question51.id,
      }),
      db.Answer.create({
        label: "Easter Sunday",
        isCorrect: false,
        questionId: question51.id,
      }),

      db.Answer.create({
        label: "Poseidon",
        isCorrect: true,
        questionId: question52.id,
      }),
      db.Answer.create({
        label: "Athena",
        isCorrect: false,
        questionId: question52.id,
      }),
      db.Answer.create({
        label: "Hades",
        isCorrect: false,
        questionId: question52.id,
      }),
      db.Answer.create({
        label: "Demeter",
        isCorrect: false,
        questionId: question52.id,
      }),

      db.Answer.create({
        label: "Kiwi",
        isCorrect: true,
        questionId: question53.id,
      }),
      db.Answer.create({
        label: "Emu",
        isCorrect: false,
        questionId: question53.id,
      }),
      db.Answer.create({
        label: "Penguin",
        isCorrect: false,
        questionId: question53.id,
      }),
      db.Answer.create({
        label: "Ostrich",
        isCorrect: false,
        questionId: question53.id,
      }),

      db.Answer.create({
        label: "Uni",
        isCorrect: true,
        questionId: question54.id,
      }),
      db.Answer.create({
        label: "Ika",
        isCorrect: false,
        questionId: question54.id,
      }),
      db.Answer.create({
        label: "Ebi",
        isCorrect: false,
        questionId: question54.id,
      }),
      db.Answer.create({
        label: "Ahi",
        isCorrect: false,
        questionId: question54.id,
      }),

      db.Answer.create({
        label: "Shaped pasta",
        isCorrect: true,
        questionId: question55.id,
      }),
      db.Answer.create({
        label: "Soup pasta",
        isCorrect: false,
        questionId: question55.id,
      }),
      db.Answer.create({
        label: "Stuffed pasta",
        isCorrect: false,
        questionId: question55.id,
      }),
      db.Answer.create({
        label: "Ribbon pasta",
        isCorrect: false,
        questionId: question55.id,
      }),

      db.Answer.create({
        label: "Barbados",
        isCorrect: true,
        questionId: question56.id,
      }),
      db.Answer.create({
        label: "Bahrain",
        isCorrect: false,
        questionId: question56.id,
      }),
      db.Answer.create({
        label: "Thailand",
        isCorrect: false,
        questionId: question56.id,
      }),
      db.Answer.create({
        label: "Benin",
        isCorrect: false,
        questionId: question56.id,
      }),

      db.Answer.create({
        label: "Coconut",
        isCorrect: true,
        questionId: question57.id,
      }),
      db.Answer.create({
        label: "Grape",
        isCorrect: false,
        questionId: question57.id,
      }),
      db.Answer.create({
        label: "Star Fruit",
        isCorrect: false,
        questionId: question57.id,
      }),
      db.Answer.create({
        label: "Apple",
        isCorrect: false,
        questionId: question57.id,
      }),

      db.Answer.create({
        label: "Egg Whites",
        isCorrect: true,
        questionId: question58.id,
      }),
      db.Answer.create({
        label: "Butter",
        isCorrect: false,
        questionId: question58.id,
      }),
      db.Answer.create({
        label: "Bread",
        isCorrect: false,
        questionId: question58.id,
      }),
      db.Answer.create({
        label: "Flour",
        isCorrect: false,
        questionId: question58.id,
      }),

      db.Answer.create({
        label: "Nudiustertian",
        isCorrect: true,
        questionId: question59.id,
      }),
      db.Answer.create({
        label: "Poppycock",
        isCorrect: false,
        questionId: question59.id,
      }),
      db.Answer.create({
        label: "Widdershins",
        isCorrect: false,
        questionId: question59.id,
      }),
      db.Answer.create({
        label: "Erinaceous",
        isCorrect: false,
        questionId: question59.id,
      }),

      db.Answer.create({
        label: "Pigeonhole",
        isCorrect: true,
        questionId: question60.id,
      }),
      db.Answer.create({
        label: "Dovetail",
        isCorrect: false,
        questionId: question60.id,
      }),
      db.Answer.create({
        label: "Crowstuff",
        isCorrect: false,
        questionId: question60.id,
      }),
      db.Answer.create({
        label: "Owlnook",
        isCorrect: false,
        questionId: question60.id,
      }),

      db.Answer.create({
        label: "Bobsy-die",
        isCorrect: true,
        questionId: question61.id,
      }),
      db.Answer.create({
        label: "Groke",
        isCorrect: false,
        questionId: question61.id,
      }),
      db.Answer.create({
        label: "Whippersnapper",
        isCorrect: false,
        questionId: question61.id,
      }),
      db.Answer.create({
        label: "Tittynope",
        isCorrect: false,
        questionId: question61.id,
      }),

      db.Answer.create({
        label: "East",
        isCorrect: true,
        questionId: question62.id,
      }),
      db.Answer.create({
        label: "North",
        isCorrect: false,
        questionId: question62.id,
      }),
      db.Answer.create({
        label: "West",
        isCorrect: false,
        questionId: question62.id,
      }),
      db.Answer.create({
        label: "South",
        isCorrect: false,
        questionId: question62.id,
      }),

      db.Answer.create({
        label: "Ill-willie",
        isCorrect: true,
        questionId: question63.id,
      }),
      db.Answer.create({
        label: "Fipple",
        isCorrect: false,
        questionId: question63.id,
      }),
      db.Answer.create({
        label: "Oxter",
        isCorrect: false,
        questionId: question63.id,
      }),
      db.Answer.create({
        label: "Octothorpe",
        isCorrect: false,
        questionId: question63.id,
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

    db.Badge.create({
      label: "Jouer 10 parties",
      image: "tenGamesPlayed.png",
      description: 'Bravo continuez de jouer, vous êtes un expert !'
    })
    
    db.Badge.create({
      label: "Jouer 100 parties",
      image: 'oneThousandGamesPlayed.png',
      description: 'Bravo continuez de jouer, vous êtes un super expert !'
    })

    categoryCreated.forEach((created) =>
    {
      db.Badge.create({
        label: `Jouer 10 parties de ${created.name}`,
        image: `${created.name}10GamesPlayed.png` ,
        description: "Bravo vous avez beaucoup joué dans cette catégorie"
      })
    }
    )

    db.Badge.create({
      label: "3 bonnes réponses à la suite !",
      image: 'strikes3.png',
      description: "Vous avez répondu 3 fois de suite à une bonne réponse !"
    })

    db.Badge.create({
      label: "5 bonnes réponses à la suite !",
      description: "Vous avez répondu 5 fois de suite à une bonne réponse !",
      image: 'strikes5.png'
    })
    
    db.Emote.create({
      name: 'Adrien King',
      src: `AdrienKing.png`,
      price: 50,
      price_id: 'price_1Nm1adLmxrb9sP3WLbH4tWjs'
    })

    db.Emote.create({
      name: 'Adrien BG',
      src: `adrienBG.png`,
      price: 15,
      price_id: 'price_1Nlvz6Lmxrb9sP3WcsOo7gNl'
    })

    db.Emote.create({
      name: 'Karl super Js',
      src: `KarlSuperJs.png`,
      price: 4,
      price_id: 'price_1Nm2O4Lmxrb9sP3WA1cyiRCg'
    })

    db.Emote.create({
      name: 'Kamal',
      src: `Kamal.png`,
      price: 300,
      price_id: 'price_1Nm2M3Lmxrb9sP3WB9JIzem1'
    })

    db.Emote.create({
      name: 'Steve Jobs',
      src: `SteveJobs.png`,
      price: 2,
      price_id: 'price_1Nm2IALmxrb9sP3W27ZgBipx'
    })

    db.Emote.create({
      name: 'Elon Musk',
      src: `ElonMusk.png`,
      price: 1000,
      price_id: 'price_1Nm2Q9Lmxrb9sP3WntnWsRIE'
    })

    db.Emote.create({
      name: 'Karl nul',
      src: `KarlNul.png`,
      price: 1,
      price_id: 'price_1NlHhGLmxrb9sP3WPRYwpjmS'
    })

    initMongo(db);

    
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
