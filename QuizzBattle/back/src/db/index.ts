const connection = require("./db");
const fs = require("fs");
const path = require("path");

const database = { connection };

const files = fs.readdirSync(path.join(__dirname, "models"));
console.log("files", files)
files.forEach((file) => {

  if (file.endsWith(".map")) return;

  const model = require(path.join(__dirname, "models", file))(connection);
  database[model.name] = model;
});

database["Answer"].belongsTo(database["Question"], {
       foreignKey: "questionId",
       as: "question",
    });

 // reverse 
 database["Question"].hasMany(database["Answer"], {
        foreignKey: "questionId",
        as: "answers",
   })

module.exports = database;
