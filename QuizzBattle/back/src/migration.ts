

const mode = process.argv[2] ?? "alter";

db.connection
  .sync({ [mode]: true })
  .then(() => {
    console.log("Database synchronized");
    
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

      Promise.all([question1, question2])
        .then(([createdQuestion1, createdQuestion2]) => {
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
              label: "Bleu",
              isCorrect: true,
              questionId: createdQuestion2.id,
            }),
            db.Answer.create({
              label: "Rouge",
              isCorrect: false,
              questionId: createdQuestion2.id,
            }),
          ]);
        })
        .then(() => {
          console.log("Questions et réponses par défaut créées avec succès.");
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
