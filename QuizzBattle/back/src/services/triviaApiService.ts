import axios from "axios";
const translateService = require("./deeplApiService");

export const getAll = async (
  limit: number,
  categories: string,
  difficulties: string,
  region: string,
  types: string,
  tags: string,
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
    return questions.data;
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

