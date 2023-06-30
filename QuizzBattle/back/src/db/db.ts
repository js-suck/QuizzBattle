const Sequelize = require("sequelize");

const connection = new Sequelize("postgres://root:password@localhost:5432/app", {
  dialect: "postgres", // Specify the dialect as 'postgres'
});

connection
  .authenticate()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

module.exports = connection;
