"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class nilai extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  nilai.init(
    {
      user_id: DataTypes.INTEGER,
      guru_id: DataTypes.INTEGER,
      mapel_id: DataTypes.INTEGER,
      nilai: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "nilai",
    }
  );
  return nilai;
};
