const models = require("../models");
async function getDetailTransaksi(req, res) {
  try {
    const { id } = req.params;
    const transaksi = await models.detail_transaksi.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: { id: id },
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
    });
    // if (transaksi.batas_waktu === transaksi.batas_waktu) {
    //   return res.status(422).json({
    //     status: "gagal",
    //     msg: "Pembayaran Sudah Mencapai Batas Waktu",
    //   });
    // }
    res.json({
      status: "berhasil",
      msg: "Berhasil Menemukan Detail Transaksi",
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

module.exports = { getDetailTransaksi };
