"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaksi.belongsTo(models.outlet, {
        as: "outlet",
        foreignKey: "id_outlet",
      });
      transaksi.belongsTo(models.member, {
        as: "member",
        foreignKey: "id_member",
      });
      transaksi.belongsTo(models.user, {
        as: "user",
        foreignKey: "id_user",
      });
    }
  }
  transaksi.init(
    {
      id_outlet: DataTypes.INTEGER(11),
      kode_invoice: DataTypes.STRING(100),
      id_member: DataTypes.INTEGER(11),
      tgl: DataTypes.DATE,
      batas_waktu: DataTypes.DATE,
      tgl_bayar: DataTypes.DATE,
      biaya_tambahan: DataTypes.INTEGER(11),
      diskon: DataTypes.DECIMAL,
      pajak: DataTypes.INTEGER(11),
      status: DataTypes.ENUM("baru", "proses", "selesai", "diambil"),
      dibayar: DataTypes.ENUM("dibayar", "belum_dibayar"),
      id_user: DataTypes.INTEGER(11),
      // qty: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "transaksi",
    }
  );
  return transaksi;
};
