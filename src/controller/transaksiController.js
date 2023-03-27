const dayjs = require("dayjs");
const { Op, where } = require("sequelize");
const { sequelize } = require("../models");
const models = require("../models");
const checkQuery = require("../utils/queryString");
const excel = require("exceljs");

async function createTransaksi(req, res) {
  let db_transaction = await sequelize.transaction();
  try {
    const { id_member, biaya_tambahan, diskon, qty, id_paket } = req.body;

    const tanggal = dayjs();
    const expire = dayjs().add(3, "day");
    const { id } = await models.transaksi.create({
      kode_invoice: `INV ${tanggal}`,
      id_outlet: req.id_outlet,
      id_member,
      tgl: tanggal,
      batas_waktu: expire.format(),
      tgl_bayar: tanggal,
      biaya_tambahan,
      diskon,
      pajak: 5,
      status: "baru",
      dibayar: "belum_dibayar",
      id_user: req.id,
    });
    const result = await models.detail_transaksi.create(
      {
        id_transaksi: id,
        id_paket,
        qty,
      },
      { transaction: db_transaction }
    );
    db_transaction.commit();
    res.json({
      status: "berhasil",
      msg: "Berhasil Membuat Transaksi",
    });
  } catch (error) {
    db_transaction.rollback();
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function getListTransaksi(req, res) {
  try {
    const { keyword, page, pageSize, offset } = req.query;
    const transaksi = await models.transaksi.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        ...(checkQuery(keyword) && {
          [Op.or]: [
            {
              kode_invoice: {
                [Op.substring]: keyword,
              },
            },
            {
              tgl: {
                [Op.substring]: keyword,
              },
            },
            {
              dibayar: {
                [Op.substring]: keyword,
              },
            },
            {
              status: {
                [Op.substring]: keyword,
              },
            },
          ],
        }),
      },
      include: [
        {
          model: models.outlet,
          require: true,
          as: "outlet",
          attributes: ["nama", "alamat", "tlp"],
        },
        {
          model: models.member,
          require: true,
          as: "member",
          attributes: ["nama", "alamat", "jenis_kelamin", "tlp"],
        },
        {
          model: models.user,
          require: true,
          as: "user",
          attributes: ["nama", "username", "id_outlet", "role"],
          include: [
            {
              model: models.outlet,
              require: true,
              as: "outlet",
              attributes: ["nama", "alamat", "tlp"],
            },
          ],
        },
      ],
      limit: pageSize,
      offset: offset,
    });
    // if (transaksi.batas_waktu === transaksi.batas_waktu) {
    //   return res.status(422).json({
    //     status: "gagal",
    //     msg: "Pembayaran Sudah Mencapai Batas Waktu",
    //   });
    // }
    res.json({
      status: "berhasil",
      msg: "Berhasil Menemukan Transaksi",
      data: transaksi,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function updateTransaksi(req, res) {
  let db_transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      kode_invoice,
      id_member,
      biaya_tambahan,
      diskon,
      qty,
      id_paket,
      status,
      dibayar,
    } = req.body;
    const transaksi = await models.transaksi.findByPk(id);
    if (transaksi === null) {
      return res.status(403).json({
        status: "Fail",
        msg: "Tidak Menemukan Transaksi",
      });
    }

    const { idTransaksi } = await models.transaksi.update(
      {
        kode_invoice,
        id_outlet: req.id_outlet,
        id_member,
        biaya_tambahan,
        diskon,
        pajak: 5,
        status,
        dibayar,
        id_user: req.id,
      },
      { where: { id: id } }
    );
    await models.detail_transaksi.update(
      {
        id_transaksi: idTransaksi,
        id_paket,
        qty,
      },
      { where: { id: id } },
      { transaction: db_transaction }
    );
    db_transaction.commit();
    res.json({
      status: "berhasil",
      msg: "Berhasil Mengupdate Transaksi",
    });
  } catch (error) {
    db_transaction.rollback();
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function updateTransaksiPembayaran(req, res) {
  let db_transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { qty, id_paket } = req.body;
    const transaksi = await models.transaksi.findByPk(id);
    if (transaksi === null) {
      return res.status(403).json({
        status: "Fail",
        msg: "Tidak Menemukan Transaksi",
      });
    }
    const { idTransaksi } = await models.transaksi.update(
      {
        dibayar: "dibayar",
        tgl_bayar: dayjs(),
        id_user: req.id,
      },
      { where: { id: id } },
      { transaction: db_transaction }
    );
    await models.detail_transaksi.update(
      {
        id_transaksi: idTransaksi,
        id_paket,
        qty,
      },
      { where: { id: id } },
      { transaction: db_transaction }
    );

    db_transaction.commit();
    res.json({
      status: "berhasil",
      msg: "Berhasil Mengupdate Transaksi",
    });
  } catch (error) {
    db_transaction.rollback();
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function deleteTransaksi(req, res) {
  let db_transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const transaksi = await models.transaksi.findByPk(id);
    if (transaksi === null) {
      return res.status(403).json({
        status: "Fail",
        msg: "Tidak Menemukan Transaksi",
      });
    }

    await models.transaksi.destroy({
      where: { id: id },
    });
    await models.detail_transaksi.destroy(
      { where: { id: id } },
      { transaction: db_transaction }
    );
    db_transaction.commit();
    res.json({
      status: "berhasil",
      msg: "Berhasil Menghapus Transaksi",
    });
  } catch (error) {
    db_transaction.rollback();
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function downloadExcel(req, res) {
  try {
    let { keyword, page, pageSize, offset } = req.query;
    const transaksi = await models.detail_transaksi.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        // dibayar: "dibayar",
        ...(checkQuery(keyword) && {
          [Op.or]: [
            {
              transaksi: {
                [Op.substring]: keyword,
              },
            },
            {
              tgl: {
                [Op.substring]: keyword,
              },
            },
            {
              dibayar: {
                [Op.substring]: keyword,
              },
            },
            {
              status: {
                [Op.substring]: keyword,
              },
            },
          ],
        }),
      },
      include: [
        {
          model: models.transaksi,
          require: true,
          as: "transaksi",
          attributes: [
            "id_outlet",
            "kode_invoice",
            "id_member",
            "tgl",
            "batas_waktu",
            "tgl_bayar",
            "biaya_tambahan",
            "diskon",
            "pajak",
            "status",
            "dibayar",
            "id_user",
          ],
          include: [
            {
              model: models.member,
              require: true,
              as: "member",
              attributes: ["id", "nama", "alamat", "jenis_kelamin", "tlp"],
            },
            {
              model: models.outlet,
              require: true,
              as: "outlet",
              attributes: ["id", "nama", "alamat", "tlp"],
            },
          ],
        },
        {
          model: models.paket,
          require: true,
          as: "paket",
          attributes: ["id", "id_outlet", "jenis", "nama_paket", "harga"],
        },
      ],
      limit: pageSize,
      offset: offset,
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Laporan Transaksi");
    worksheet.columns = [
      { header: "No.", key: "no", width: 10 },
      { header: "Kode Invoice", key: "invoice", width: 25 },
      { header: "Nama Member", key: "nama", width: 25 },
      { header: "Alamat Member", key: "alamat", width: 25 },
      { header: "Telephone Member", key: "telephone", width: 25 },
      { header: "Jenis Cucian", key: "jenis", width: 25 },
      { header: "Berat Cucian", key: "qty", width: 25 },
      { header: "Total Bayar", key: "total", width: 25 },
      { header: "Status Paket", key: "status", width: 25 },
      { header: "Status Pembayaran", key: "dibayar", width: 25 },
    ];
    transaksi.rows.forEach((item, index) => {
      worksheet.addRow({
        no: index + 1,
        invoice: item.transaksi.kode_invoice,
        nama: item.transaksi.member.nama,
        alamat: item.transaksi.member.alamat,
        telephone: item.transaksi.member.tlp,
        jenis: item.paket.jenis,
        qty: item.qty,
        total: item.paket.harga,
        status: item.transaksi.status,
        dibayar: item.transaksi.dibayar,
      });
    });
    res.setHeader(
      "Content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });

    res.json({
      status: "berhasil",
      data: transaksi,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}
async function getLaporan(req, res) {
  try {
    let { keyword, page, pageSize, offset } = req.query;
    const laporan = await models.detail_transaksi.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        // dibayar: "dibayar",
        ...(checkQuery(keyword) && {
          [Op.or]: [
            {
              transaksi: {
                [Op.substring]: keyword,
              },
            },
            {
              tgl: {
                [Op.substring]: keyword,
              },
            },
            {
              dibayar: {
                [Op.substring]: keyword,
              },
            },
            {
              status: {
                [Op.substring]: keyword,
              },
            },
          ],
        }),
      },
      include: [
        {
          model: models.transaksi,
          require: true,
          as: "transaksi",
          attributes: [
            "id_outlet",
            "kode_invoice",
            "id_member",
            "tgl",
            "batas_waktu",
            "tgl_bayar",
            "biaya_tambahan",
            "diskon",
            "pajak",
            "status",
            "dibayar",
            "id_user",
          ],
          include: [
            {
              model: models.member,
              require: true,
              as: "member",
              attributes: ["id", "nama", "alamat", "jenis_kelamin"],
            },
            {
              model: models.outlet,
              require: true,
              as: "outlet",
              attributes: ["id", "nama", "alamat", "tlp"],
            },
          ],
        },
        {
          model: models.paket,
          require: true,
          as: "paket",
          attributes: ["id", "id_outlet", "jenis", "nama_paket", "harga"],
        },
      ],
      limit: pageSize,
      offset: offset,
    });
    res.json({
      status: "berhasil",
      data: laporan,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

module.exports = {
  createTransaksi,
  getListTransaksi,
  updateTransaksi,
  updateTransaksiPembayaran,
  deleteTransaksi,
  downloadExcel,
  getLaporan,
};
