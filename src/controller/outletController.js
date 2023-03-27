const { Op } = require("sequelize");
const models = require("../models");
const checkQuery = require("../utils/queryString");
async function outletCreate(req, res) {
  try {
    const { nama, alamat, telephone } = req.body;
    await models.outlet.create({
      nama,
      alamat,
      tlp: telephone,
    });
    res.json({
      status: "Berhasil",
      msg: "Berhasil Membuat Outlet",
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      msg: "Gagal Membuat Outlet",
    });
  }
}

async function getListOutlet(req, res) {
  try {
    const { keyword, page, pageSize, offset } = req.query;
    const outlet = await models.outlet.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        ...(checkQuery(keyword) && {
          [Op.or]: [
            {
              nama: {
                [Op.substring]: keyword,
              },
            },
            {
              alamat: {
                [Op.substring]: keyword,
              },
            },
            {
              tlp: {
                [Op.substring]: keyword,
              },
            },
          ],
        }),
      },
      limit: pageSize,
      offset: offset,
    });
    res.json({
      status: "Berhasil",
      msg: "Berhasil Menemukan Outlet",
      data: outlet,
      pagination: {
        currentPage: page,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Fail",
      msg: "Tidak Menemukan Outlet",
    });
  }
}

async function getDetailOutlet(req, res) {
  try {
    const { id } = req.params;
    const outlet = await models.outlet.findByPk(id);
    if (outlet === null) {
      return res.status(422).json({
        status: "gagal",
        msg: "Outlet Tidak Ditemukan",
      });
    }
    res.json({
      status: "berhasil",
      msg: "Berhasil Menemukan Detail Outlet",
      data: outlet,
    });
  } catch (error) {
    res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function outletUpdate(req, res) {
  try {
    const { id } = req.params;
    const { nama, alamat, telephone } = req.body;
    const outlet = await models.outlet.findByPk(id);
    if (outlet === null) {
      return res.status(403).json({
        status: "Fail",
        msg: "Tidak Menemukan Outlet",
      });
    }
    await models.outlet.update(
      {
        nama,
        alamat,
        tlp: telephone,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.json({
      status: "Berhasil",
      msg: "Berhasil Mengupdate Outlet",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Fail",
      msg: "Gagal Mengupdate Outlet",
    });
  }
}

async function outletDelete(req, res) {
  try {
    const { id } = req.params;
    const outlet = await models.outlet.findByPk(id);
    if (outlet == null) {
      return res.status(403).json({
        status: "Fail",
        msg: "Tidak Menemukan Outlet",
      });
    }
    await models.outlet.destroy({
      where: {
        id: id,
      },
    });
    res.json({
      status: "Berhasil",
      msg: `Berhasil Menghapus Outlet dengan ID ${id}`,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Fail",
      msg: "Gagal Menghapus Outlet",
    });
  }
}
module.exports = {
  outletCreate,
  getListOutlet,
  outletUpdate,
  outletDelete,
  getDetailOutlet,
};
