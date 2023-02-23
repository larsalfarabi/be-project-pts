"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama: {
        type: Sequelize.STRING(100),
      },
      username: {
        type: Sequelize.STRING(30),
      },
      password: {
        type: Sequelize.TEXT,
      },
      id_outlet: {
        type: Sequelize.INTEGER(11),
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "outlets", //* --- nama table
          key: "id", //* --- id dari outlet
          as: "id_outlet",
        },
      },
      role: {
        type: Sequelize.ENUM,
        values: ["admin", "kasir", "owner"],
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
    await queryInterface.dropTable("users");
  },
};
