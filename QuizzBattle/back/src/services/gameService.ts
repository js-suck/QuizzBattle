import { Game } from "../db/mongo/models/Game";

const ValidationErrorr = require("../errors/ValidationError");

const SequelizeDb = require("sequelize");


class GameService {
create = async (data) => {
    try {
        console.log(data)
        const game = await Game.create(data);
        return game;
    
    } catch (error) {
      if (error instanceof SequelizeDb.ValidationError) {
        throw ValidationErrorr.createFromSequelizeValidationError(error);
      }
      throw error;
    }
  }
}

export {
    GameService
}