"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pakets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_outlet: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "outlets", //* --- nama table
          key: "id", //* --- id dari outlet
          as: "id_outlet",
        },
      },
      jenis: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["kiloan", "selimut", "bed_cover", "kaos", "lain"],
      },
      nama_paket: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      harga: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
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
    await queryInterface.dropTable("pakets");
  },
};
