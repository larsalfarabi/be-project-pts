"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class groupRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here  \
      groupRoom.belongsTo(models.user, {
        as: "member_group",
        foreignKey: "member",
      });
      groupRoom.belongsTo(models.group, {
        as: "nama_group",
        foreignKey: "groupId",
      });
    }
  }
  groupRoom.init(
    {
      member: DataTypes.INTEGER,
      groupId: DataTypes.INTEGER,
      chatRoom: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "groupRoom",
    }
  );
  return groupRoom;
};
