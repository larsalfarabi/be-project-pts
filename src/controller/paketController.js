const { Op } = require("sequelize");
const models = require("../models");
const checkQuery = require("../utils/queryString");
async function getListPaket(req, res) {
  try {
    const { keyword, page, pageSize, offset } = req.query;
    const paket = await models.paket.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      where: {
        ...(checkQuery(keyword) && {
          [Op.or]: [
            {
              id_outlet: {
                [Op.substring]: keyword,
              },
            },
            {
              jenis: {
                [Op.substring]: keyword,
              },
            },
            {
              nama_paket: {
                [Op.substring]: keyword,
              },
            },
            {
              harga: {
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
          attributes: ["id", "nama", "alamat", "tlp"],
        },
      ],
      limit: pageSize,
      offset: offset,
    });
    res.json({
      status: "berhasil",
      msg: "Berhasil Menemukan Paket",
      data: paket,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function getDetailPaket(req, res) {
  try {
    const { id } = req.params;
    const paket = await models.paket.findOne({
      where: { id: id },
      include: [
        {
          model: models.outlet,
          require: true,
          as: "outlet",
          attributes: ["nama", "alamat", "tlp"],
        },
      ],
    });
    if (paket == null) {
      return res.status(422).json({
        status: "fail",
        msg: "Paket Tidak Ditemukan",
      });
    }
    res.json({
      status: "berhasil",
      msg: "Berhasil Menemukan Detail Paket",
      data: paket,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function createPaket(req, res) {
  try {
    const { id_outlet, jenis, nama_paket, harga } = req.body;
    await models.paket.create({
      id_outlet,
      jenis,
      nama_paket,
      harga,
    });
    res.json({
      status: "berhasil",
      msg: "Berhasil Menambah Paket",
      //   data: paket,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function deletePaket(req, res) {
  try {
    const { id } = req.params;
    const paket = await models.paket.findByPk(id);
    if (paket === null) {
      return res.status(422).json({
        status: "fail",
        msg: "Paket Tidak Ditemukan",
      });
    }
    await models.paket.destroy({
      where: {
        id: id,
      },
    });
    res.json({
      status: "berhasil",
      msg: `Berhasil Menghapus Member Dengan ID ${id}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function updatePaket(req, res) {
  try {
    const { id } = req.params;
    const { id_outlet, jenis, nama_paket, harga } = req.body;
    const paket = await models.paket.findByPk(id);
    if (paket === null) {
      return res.status(422).json({
        status: "gagal",
        msg: "Paket Tidak Ditemukan",
      });
    }
    await models.paket.update(
      {
        id_outlet,
        jenis,
        nama_paket,
        harga,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.json({
      status: "berhasil",
      msg: `Berhasil Mengupdate Paket`,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

module.exports = {
  getListPaket,
  getDetailPaket,
  createPaket,
  deletePaket,
  updatePaket,
};
