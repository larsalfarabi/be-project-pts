const ProdukModel = require("../models").produk;

async function getListProduk(req, res) {
  try {
    const produks = await ProdukModel.findAll();
    res.json({
      status: "berhasil",
      msg: "Data ditemukan",
      data: produks,
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: "fail",
      msg: "ada kesalahan",
      err: err,
    });
  }
}

// create data ke database

async function createProduk(req, res) {
  try {
    const payload = req.body;
    const { nama, harga, stok, deskipsi, lokasi } = payload;
    const produk = await ProdukModel.create({
      nama: nama,
      harga: harga,
      stok: stok,
      deskipsi: deskipsi,
      lokasi: lokasi,
    });
    res.status(201).json({
      status: "berhasil",
      msg: "Berhasil menambah",
      data: produk,
    });
  } catch (err) {
    res.status(403).json({
      status: "fail",
      msg: "gagal menambah",
    });
  }
}

async function getListProdukById(req, res) {
  try {
    const { id } = req.params;

    const produk = await ProdukModel.findByPk(id);

    if (produk === null) {
      res.status(404).json({
        status: "fail",
        msg: "user tidak ditemukan",
      });
    }
    res.json({
      status: "berhasil",
      msg: "berhasil menemukan produk",
      data: produk,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      msg: "Tidak menemukan produk",
    });
  }
}

async function getDetailProdukByParams(req, res) {
  try {
    const { lokasi } = req.params;

    const produk = await ProdukModel.findOne({
      where: {
        lokasi: lokasi,
      },
    });
    res.json({
      status: "berhasil",
      msg: "berhasil menemukan produk",
      data: produk,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      msg: "tidak menemukan produk",
    });
  }
}

async function deleteProduk(req, res) {
  try {
    const { id } = req.params;

    
    await ProdukModel.destroy({
      where: {
        id: id,
      },
    });
    res.json({
      status: "berhasil",
      msg: "berhasil menghapus produk",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      msg: "produk tidak bisa dihapus",
    });
  }
}

module.exports = {
  getListProduk,
  createProduk,
  getListProdukById,
  getDetailProdukByParams,
  deleteProduk,
};
