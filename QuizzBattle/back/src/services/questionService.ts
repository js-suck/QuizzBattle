import { Op } from "sequelize";
import { formatQuestionsToMimickTrivia } from "../helpers/quizzHelper";
const Category = require('../db').Category;
const ValidationError = require("../errors/ValidationError");
const SequelizeDb = require("sequelize");
const Question = require("../db").Question;
const Answer = require("../db").Answer


class QuestionsService {
  async findAll(criteria, { page = null, itemsPerPage = null, order = {} }) {
    console.log(criteria)
    const questions = await Question.findAll({
      where: criteria,
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
      order: Object.entries(order),
      include: { model: Answer, as: 'answers' } 
    });
    
    return formatQuestionsToMimickTrivia(questions);
  }

  async create(data) {
    try {
      const question = await Question.create(data);
      return question;
    } catch (error) {
      if (error instanceof SequelizeDb.ValidationError) {
        throw ValidationError.createFromSequelizeValidationError(error);
      }
      throw error;
    }
  }

  async findOne(id) {
    const question = await Question.findByPk(id, {
      include: { model: Answer, as: 'answers' } 
    });

    if (!question) {
      return null;
    }

    const nextQuestion = await Question.findOne({
      where: { quizzId: question.quizzId, id: { [Op.gt]: question.id } },
      order: [['id', 'ASC']],
      include: { model: Answer, as: 'answers' } 
    });

    return { question, nextQuestion };
  }

  async replaceOne(id, newData) {
    try {
      const deleted = await this.deleteOne(id);
      const question = await this.create({ ...newData, id });

      return [question, !deleted];
    } catch (error) {
      if (error instanceof SequelizeDb.ValidationError) {
        throw ValidationError.createFromSequelizeValidationError(error);
      }
      throw error;
    }
  }

  async updateOne(id, newData) {
    try {
      const [nbUpdated, newValues] = await Question.update(newData, {
        where: { id },
        returning: true,
      });
      if (nbUpdated === 0) {
        return null;
      }
      return newValues[0];
    } catch (error) {
      if (error instanceof SequelizeDb.ValidationError) {
        throw ValidationError.createFromSequelizeValidationError(error);
      }
      throw error;
    }
  }

  async deleteOne(id) {
    const nbDeleted = await Question.destroy({ where: { id } });
    return nbDeleted === 1;
  }
  async findAllBy(categoryId) {
    const questions = await Question.findAll({
      attributes: ["label"],
      include: [
        {
          model: Category,
          attributes: ["name", "description", "image_url"],
          as: 'category' // On n'a pas besoin des attributs de la table Category dans ce cas
        },
      ],
    });
    const transformedArray = questions.map(item => ({
      "label": item.label,
      "name": item.category.name,
      "description": item.category.description,
      "image_url": item.category.image_url
    }));
    return transformedArray;
  }
}


export default QuestionsService