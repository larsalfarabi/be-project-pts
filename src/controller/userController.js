const { Op } = require("sequelize");
const models = require("../models");
const checkQuery = require("../utils/queryString");
const bcrypt = require("bcrypt");

async function getListUser(req, res) {
  try {
    const { keyword, page, pageSize, offset } = req.query;
    const user = await models.user.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
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
              username: {
                [Op.substring]: keyword,
              },
            },
            {
              id_outlet: {
                [Op.substring]: keyword,
              },
            },
            {
              role: {
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
      msg: "Berhasil Menemukan User",
      data: user,
      pagination: {
        currentPage: page,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function getDetailUser(req, res) {
  try {
    const { id } = req.params;
    const user = await models.user.findOne({
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
    const verify = await bcrypt.compare("admin123", user.password);
    if (user === null) {
      return res.status(422).json({
        status: "fail",
        msg: "User Tidak Ditemukan",
      });
    }
    res.json({
      status: "berhasil",
      msg: "Berhasil Menemukan Detail User",
      data: user,
      password: verify,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function createUser(req, res) {
  try {
    const { nama, username, password, id_outlet, role } = req.body;

    let hashPassword = await bcrypt.hashSync(password, 10);

    await models.user.create({
      nama,
      username,
      password: hashPassword,
      id_outlet,
      role,
    });
    res.json({
      status: "berhasil",
      msg: "Berhasil Menambah User",
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await models.user.findByPk(id);
    if (user === null) {
      return res.status(422).json({
        status: "fail",
        msg: "User Tidak Ditemukan",
      });
    }
    await models.user.destroy({
      where: {
        id: id,
      },
    });
    res.json({
      status: "berhasil",
      msg: `Berhasil Menghapus User Dengan ID ${id}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { nama, username, id_outlet, role } = req.body;
    const user = await models.user.findByPk(id);
    if (user === null) {
      return res.status(422).json({
        status: "gagal",
        msg: "User Tidak Ditemukan",
      });
    }
    await models.user.update(
      {
        nama,
        username,
        id_outlet,
        role,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.json({
      status: "berhasil",
      msg: `Berhasil Mengupdate User`,
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
  getListUser,
  getDetailUser,
  createUser,
  deleteUser,
  updateUser,
};
