"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("chatRooms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama1: {
        type: Sequelize.STRING,
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
        references: {
          model: "users",
          key: "nama",
          as: "nama1",
        },
      },
      nama2: {
        type: Sequelize.STRING,
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
        references: {
          model: "users",
          key: "nama",
          as: "nama2",
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
    await queryInterface.dropTable("chatRooms");
  },
};
