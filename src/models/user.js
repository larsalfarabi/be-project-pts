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
      user.hasMany(models.chatRoom, {
        as: "chatRoomNama1",
        foreignKey: "nama1",
      });
      user.hasMany(models.chatRoom, {
        as: "chatRoomNama2",
        foreignKey: "nama2",
      });
      user.hasMany(models.conversation, {
        as: "conversationSender",
        foreignKey: "sender",
      });
      user.hasMany(models.chatRoom, {
        as: "conversationTo",
        foreignKey: "to",
      });
      user.hasMany(models.groupRoom, {
        as: "member_group",
        foreignKey: "member",
      });
      user.hasMany(models.conversationGroup, {
        as: "conversationGroupSender",
        foreignKey: "sender",
      });
      user.hasMany(models.conversationGroup, {
        as: "conversationGroupTo",
        foreignKey: "to",
      });
    }
  }
  user.init(
    {
      nama: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
