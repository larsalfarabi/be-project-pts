"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userRole.belongsTo(models.user, {
        as: "users",
        foreignKey: "userId",
      });
      userRole.belongsTo(models.role, {
        as: "roles",
        foreignKey: "roleId",
      });
    }
  }
  userRole.init(
    {
      userId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "userRole",
    }
  );
  return userRole;
};
