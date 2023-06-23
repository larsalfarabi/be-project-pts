"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("groupRooms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      member: {
        type: Sequelize.INTEGER,
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
        references: {
          model: "users",
          key: "id",
          as: "member",
        },
      },
      groupId: {
        type: Sequelize.INTEGER,
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
        references: {
          model: "groups",
          key: "id",
          as: "groupId",
        },
      },
      chatRoom: {
        type: Sequelize.STRING,
    
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("groupRooms");
  },
};
