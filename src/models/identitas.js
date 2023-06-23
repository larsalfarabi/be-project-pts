'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class identitas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  identitas.init({
    user_id: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    alamat: DataTypes.TEXT,
    tempat_lahir: DataTypes.STRING,
    tanggal_lahir: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'identitas',
  });
  return identitas;
};