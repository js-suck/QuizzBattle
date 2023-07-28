import { Op } from "sequelize";
import { formatQuestionsToMimickTrivia } from "../helpers/quizzHelper";
const Category = require('../db').Category;
const ValidationError = require("../errors/ValidationError");
const SequelizeDb = require("sequelize");
const Question = require("../db").Question;
const Answer = require("../db").Answer


class AnswerService {
  async findAll(criteria, { page = null, itemsPerPage = null, order = {} }) {
    const answers = await Answer.findAll({
      where: criteria,
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
      order: Object.entries(order),
    });
  }

  async create(data) {
    try {
      const answer = await Answer.create(data);
      return answer;
    } catch (error) {
      if (error instanceof SequelizeDb.ValidationError) {
        throw ValidationError.createFromSequelizeValidationError(error);
      }
      throw error;
    }
  }
  async findAllBy(categoryId) {
    const answers = await Answer.findAll({
      attributes: ["id", "label", "isCorrect"],
      include: [
        {
          model: Question,
          attributes: ["label"],
          where: {
            id: categoryId
          },
          as: 'question' // On n'a pas besoin des attributs de la table Category dans ce cas
        },
      ],
    });
    const transformedArray = answers.map(item => ({
      "id": item.id,
      "label": item.label,
      "isCorrect": item.isCorrect,
      "labelQuestion": item.question.label
    }));
    return transformedArray;
  }
}
export default AnswerService