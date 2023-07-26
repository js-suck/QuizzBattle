module.exports = (connection) => {
  const { DataTypes, Model } = require("sequelize");
  class User extends Model {}

  User.init(
    {
      lastname: DataTypes.STRING,
      firstname: DataTypes.STRING,
      nickname: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          //len: [8, 32],
          //is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        },
      },
      profilePicturePath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gamesPlayed: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    },
    { sequelize: connection, tableName: "users" }
  );
    User.prototype.toJSON = function () {
        const values = { ...this.get() };
        delete values.password;
        return values;
    };
  return User;
};


