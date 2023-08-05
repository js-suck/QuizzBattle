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

database["User"].hasMany(database["UserCategory"], {
   foreignKey: "userId",
   as: "a"
});

database["UserCategory"].belongsTo(database["User"], {
   foreignKey: "userId",
   as: "user"
});

database["Category"].hasMany(database["UserCategory"], {
   foreignKey: "categoryId",
   as: "c"
});

database["UserCategory"].belongsTo(database["Category"], {
   foreignKey: "categoryId",
   as: "category"
});

database["Answer"].belongsTo(database["Question"], {
       foreignKey: "questionId",
       as: "question",
    });

// reverse
database["Question"].hasMany(database["Answer"], {
    foreignKey: "questionId",
    as: "answers",
});

database["Question"].belongsTo(database["Category"], {
    foreignKey: "categoryId",
    as: "category",
});

database["Category"].hasMany(database["Question"], {
    foreignKey: "categoryId",
    as: "question",
});

database["User"].belongsToMany(database["Badge"], {
      through: "user_badge",
      foreignKey: "userId",
      as: "categories",
});

database["Badge"].belongsToMany(database["User"], {
      through: "user_badge",
      foreignKey: "badgeId",
      as: "users",
});


module.exports = database;
