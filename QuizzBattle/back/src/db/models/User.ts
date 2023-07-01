module.exports = (connection) => {
  const { DataTypes, Model } = require("sequelize");
  const bcrypt = require("bcrypt");
  class User extends Model {
    async checkPassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }

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
          len: [8, 32],
          is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        },
      },
      profilePicturePath: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    { sequelize: connection, tableName: "users" }
  );

  function uptadePassword(user) {
    if (user.changed("password")) {
      return bcrypt.hash(user.password, 10).then((hash) => {
        user.password = hash;
      });
    }
  }

  User.addHook("beforeCreate", uptadePassword);

  return User;
};


