module.exports = (connection) => {
  const { DataTypes, Model } = require("sequelize");
  const bcrypt = require("bcrypt");
  const Mailjet = require("node-mailjet");

  const mailjetClient = new Mailjet({
    apiKey: "dfaaa1f406a6a163ed3cfd1c77387ae4",
    apiSecret: "7797beb3977eca8bba9c9fc327e45ab3",
  });

  class User extends Model {
    async checkPassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    async sendVerificationEmail() {
      // Envoyer l'e-mail de vérification à l'utilisateur
      const request = mailjetClient.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "votre-email@example.com",
              Name: "Votre Nom",
            },
            To: [
              {
                Email: this.email,
                Name: `${this.firstname} ${this.lastname}`,
              },
            ],
            Subject: "Vérification de compte",
            HTMLPart: `<p>Bonjour ${
              this.firstname
            },</p><p>Veuillez cliquer sur le lien suivant pour vérifier votre compte : <a href="${generateVerificationLink(
              this.id
            )}">Vérifier mon compte</a></p>`,
          },
        ],
      });
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
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
        validate: {
          isIn: [["user", "admin"]],
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
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

  function generateVerificationLink(userId) {
    // Générer le lien de vérification avec l'ID de l'utilisateur
    return `http://localhost:5173/verify/${userId}`;
  }

  User.addHook("beforeCreate", uptadePassword);

  User.addHook("afterCreate", (user) => {
    user.sendVerificationEmail();
  });

  return User;
};


