const connection = require("./db");
const fs = require("fs");
const path = require("path");

const db = { connection };

const files = fs.readdirSync(path.join(__dirname, "models"));
console.log("files", files)
files.forEach((file) => {

  if (file.endsWith(".map")) return;

  console.log("ici", file)
  const model = require(path.join(__dirname, "models", file))(connection);
  db[model.name] = model;
});

db["Answer"].belongsTo(db["Question"], {
       foreignKey: "questionId",
       as: "question",
    });

 // reverse 
db["Question"].hasMany(db["Answer"], {
        foreignKey: "questionId",
        as: "answers",
   })

module.exports = db;
