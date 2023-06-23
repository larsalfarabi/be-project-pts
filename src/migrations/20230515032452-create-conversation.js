"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("conversations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sender: {
        type: Sequelize.STRING,
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
        references: {
          model: "users",
          key: "nama",
          as: "sender",
        },
      },
      to: {
        type: Sequelize.STRING,
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
        references: {
          model: "users",
          key: "nama",
          as: "to",
        },
      },
      time: {
        type: Sequelize.DATE,
      },
      message: {
        type: Sequelize.TEXT,
      },
      roomCode: {
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
    await queryInterface.dropTable("conversations");
  },
};
