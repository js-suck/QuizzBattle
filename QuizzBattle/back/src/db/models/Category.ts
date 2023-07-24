
module.exports = (connection) => {
const { DataTypes, Model } = require("sequelize");

class Category extends Model {}

Category.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate :{
        notNull: {
          msg: "Le nom de la catégorie est obligatoire",
          },
    },
  }
  },
  { sequelize: connection, tableName: "categories" }
);

return Category;

}