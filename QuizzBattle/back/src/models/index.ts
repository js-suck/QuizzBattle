import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    answer: {
      type: String,
      required: true
    }
  });
  
  const quizSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    questions: [questionSchema]
  });
  

const Quiz = mongoose.model('Quiz', quizSchema);

Quiz.exists({})
.then((exists) => {
if (exists) {
    console.log('Le schéma Quiz existe déjà. Aucun nouveau quiz ne sera créé.');
} else {

const newQuiz = new Quiz({
    title: 'Quiz de géographie',
    questions: [
    {
        question: 'Quelle est la capitale de la France ?',
        options: ['Paris', 'Londres', 'Berlin'],
        answer: 'Paris'
    },
    {
        question: 'Quel est le plus grand océan du monde ?',
        options: ['Atlantique', 'Pacifique', 'Indien'],
        answer: 'Pacifique'
    },
    {
        question: 'Quel est le plus grand pays du monde ?',
        options: ['Canada', 'Russie', 'Chine'],
        answer: 'Russie'
    },
    {
        question: 'Quel est le plus grand pays d\'Afrique ?',
        options: ['Algérie', 'Soudan', 'Nigeria'],
        answer: 'Algérie'
    },
    ]
});

newQuiz.save()
    .then(() => {
    console.log('Quiz enregistré avec succès');
    })
    .catch((error) => {
    console.error('Erreur lors de l\'enregistrement du quiz', error);
    });
}
});
