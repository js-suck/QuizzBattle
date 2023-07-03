
module.exports = (connection) => {
const { DataTypes, Model } = require("sequelize");

class Category extends Model {}

Category.init(
  {
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: connection, tableName: "categories" }
);

return Category;

}