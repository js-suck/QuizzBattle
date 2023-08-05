module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");
    
    class Badge extends Model {}
    
    Badge.init(
      {
        label: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "defaultImage.png",
        },
      },
      { sequelize: connection, tableName: "badge" }
    );    
    
    return Badge;
};