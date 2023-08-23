const ValidationErrorInstance = require("../errors/ValidationError");
const Sequelize = require("sequelize");
const Badge = require("../db").Badge;


class BadgeService {
    async findAllBy(userId) {
        try {
            const badges = await Badge.findAll({
                include: [{
                    model: User,
                    as: "users",
                    where: {
                        id: userId
                    }
                }]
            });
            return badges;
        } catch (error) {
            throw error;
        }
    }
    async create(data) {
        try {
            const badge = await Badge.create(data);
            return badge;
        } catch (error) {
            if (error instanceof Sequelize.ValidationError) {
                throw ValidationErrorInstance.createFromSequelizeValidationError(error);
            }
            throw error;
        }
    }

}
export default BadgeService