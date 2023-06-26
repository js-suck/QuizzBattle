module.exports = (connection) => {
  const { DataTypes, Model } = require("sequelize");
  class User extends Model {}

  User.init(
    {
      lastname: DataTypes.STRING,
      firstname: DataTypes.STRING,
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
    },
    { sequelize: connection, tableName: "users" }
  );

  return User;
};
