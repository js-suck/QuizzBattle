module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");
    
    class UserCategory extends Model {}
    
    UserCategory.init(
      {
        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        gamesPlayed: {
            type: DataTypes.INTEGER,
            allowNull: true,
      },
        },
      { sequelize: connection, tableName: "user_categories" }
    );
    
    return UserCategory;
    
    }