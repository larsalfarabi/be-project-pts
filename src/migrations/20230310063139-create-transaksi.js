"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaksis", {
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
      kode_invoice: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      id_member: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "members", //* --- nama table
          key: "id", //* --- id dari outlet
          as: "id_member",
        },
      },
      tgl: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      batas_waktu: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      tgl_bayar: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      biaya_tambahan: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      diskon: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      pajak: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["baru", "proses", "selesai", "diambil"],
      },
      dibayar: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["dibayar", "belum_dibayar"],
      },
      id_user: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "users", //* --- nama table
          key: "id", //* --- id dari outlet
          as: "id_user",
        },
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
    await queryInterface.dropTable("transaksis");
  },
};
