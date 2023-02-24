"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  member.init(
    {
      nama: DataTypes.STRING(100),
      alamat: DataTypes.TEXT,
      jenis_kelamin: DataTypes.ENUM("l", "p"),
      tlp: DataTypes.STRING(15),
    },
    {
      sequelize,
      modelName: "member",
    }
  );
  return member;
};
