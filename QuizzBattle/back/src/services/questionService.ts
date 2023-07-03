import { Op } from "sequelize";
const ValidationError = require("../errors/ValidationError");
const SequelizeDb = require("sequelize");
const Question = require("../db").Question;
const Answer = require("../db").Answer


class QuizzesService {
  async findAll(criteria, { page = null, itemsPerPage = null, order = {} }) {
    return await Question.findAll({
      where: criteria,
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
      order: Object.entries(order),
    });
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
}


export default QuizzesService