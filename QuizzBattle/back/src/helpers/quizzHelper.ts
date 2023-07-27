
const formatQuestionsToMimickTrivia = (questions) => {

   const newQuestions = questions.map((question) => {
        let correctAnswer = ""
        let incorrectAnswers = []

        question.answers.forEach((answer) => {
            if (answer.isCorrect === false) {
                return incorrectAnswers.push(answer.label);
            }
            return correctAnswer = answer.label
          });   

        return {
            incorrectAnswers,
            correctAnswer,
            question: {
                text: question.label,
                id: question.id
            }
        }
    })

    return newQuestions;
}
export {
    formatQuestionsToMimickTrivia
}