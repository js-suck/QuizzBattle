import axios from "axios";
const translateService = require("./deeplApiService");

export const getAll = async (
  limit: number,
  categories: string,
  difficulties: string,
  region: string,
  types: string,
  tags: string,
  lang: string
) => {
  try {
    const questions = await axios.get(
      "https://the-trivia-api.com/v2/questions" +
        (limit ? "?limit=" + limit : "?limit=10") +
        (categories ? "&categories=" + categories : "") +
        (difficulties ? "&difficulties=" + difficulties : "") +
        (region ? "&region=" + region : "") +
        (types ? "&types=" + types : "") +
        (tags ? "&tags=" + tags : "") 
    );
    if (lang == "fr") {
      const translations = await Promise.all([
        ...questions.data.map((question) =>
          Promise.all([
            translateService.translate(question.category),
            translateService.translate(question.correctAnswer),
            ...question.incorrectAnswers.map((answer) =>
              translateService.translate(answer)
            ),
            translateService.translate(question.question.text),
            translateService.translate(question.difficulty),
            ...question.tags.map((tag) => translateService.translate(tag)),
          ])
        ),
      ]);
      return translations.map((translation, index) => {
        questions.data[index].category = translation[0];
        questions.data[index].correctAnswer = translation[1];
        questions.data[index].incorrectAnswers = translation.slice(
          2,
          2 + questions.data[index].incorrectAnswers.length
        );
        questions.data[index].question.text = translation[
          2 + questions.data[index].incorrectAnswers.length
        ];
        questions.data[index].difficulty = translation[
          3 + questions.data[index].incorrectAnswers.length
        ];
        questions.data[index].tags = translation.slice(
          4 + questions.data[index].incorrectAnswers.length
        );
        return questions.data[index];
      });
    } else {
    return questions.data;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getOne = async (id) => {
  try {
    const question = await axios.get(
      "https://the-trivia-api.com/v2/question/" + id
    );

    const translations = await Promise.all([
        translateService.translate(question.data.category),
        translateService.translate(question.data.correctAnswer),
        ...question.data.incorrectAnswers.map((answer) => translateService.translate(answer)),
        translateService.translate(question.data.question.text),
        translateService.translate(question.data.difficulty),
        ...question.data.tags.map((tag) => translateService.translate(tag))
      ]);
    
      question.data.category = translations[0];
      question.data.correctAnswer = translations[1];
      question.data.incorrectAnswers = translations.slice(2, 2 + question.data.incorrectAnswers.length);
      question.data.question.text = translations[2 + question.data.incorrectAnswers.length];
      question.data.difficulty = translations[3 + question.data.incorrectAnswers.length];
      question.data.tags = translations.slice(4 + question.data.incorrectAnswers.length);

    return question.data;
  } catch (err) {
    console.log(err);
  }
};

export const getAllCategories = () => {
  const categories = {
    music: "Musique",
    sport_and_leisure: "Sport et loisirs",
    film_and_tv: "Cinéma et télévision",
    arts_and_literature: "Arts et littérature",
    history: "Histoire",
    society_and_culture: "Société et culture",
    science: "Science",
    geography: "Géographie",
    food_and_drink: "Nourriture et boisson",
    general_knowledge: "Culture générale",
  };
  return categories;
};

export const getAllTags = async () => {
    try {
        const tags = await axios.get("https://the-trivia-api.com/v2/tags");

        return tags.data;
    } catch (err) {
        console.log(err);
    }
};

