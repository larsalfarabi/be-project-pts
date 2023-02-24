"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class paket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  paket.init(
    {
      id_outlet: DataTypes.INTEGER(11),
      jenis: DataTypes.ENUM("kiloan", "selimut", "bed_cover", "kaos", "lain"),
      nama_paket: DataTypes.STRING(100),
      harga: DataTypes.INTEGER(11),
    },
    {
      sequelize,
      modelName: "paket",
    }
  );
  return paket;
};
