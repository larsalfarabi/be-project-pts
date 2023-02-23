"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsTo(models.outlet, {
        as: "outlet",
        foreignKey:'id_outlet'
      })
    }
  }
  user.init(
    {
      nama: DataTypes.STRING(100),
      username: DataTypes.STRING(30),
      password: DataTypes.TEXT,
      id_outlet: DataTypes.INTEGER(11),
      role: DataTypes.ENUM("admin", "kasir", "owner"),
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
