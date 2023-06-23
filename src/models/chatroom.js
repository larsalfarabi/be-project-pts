"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class chatRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      chatRoom.belongsTo(models.user, {
        as: "chatRoomNama1",
        foreignKey: "nama1",
      });
      chatRoom.belongsTo(models.user, {
        as: "chatRoomNama2",
        foreignKey: "nama2",
      });
    }
  }
  chatRoom.init(
    {
      nama1: DataTypes.STRING,
      nama2: DataTypes.STRING,
      chatRoom: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "chatRoom",
    }
  );
  return chatRoom;
};
