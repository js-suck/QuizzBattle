
module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");

  class Emote extends Model {}

  Emote.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Le nom de l'émoticône est obligatoire",
          },
        },
      },
      src: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Le prix doit être un nombre entier.",
          },
          min: {
            args: [0],
            msg: "Le prix ne peut pas être négatif.",
          },
        },
      },
      price_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
      }
    },
    { sequelize: connection, tableName: "emotes" }

  );

  return Emote;
};
