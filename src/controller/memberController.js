const { Op } = require("sequelize");
const models = require("../models");
const checkQuery = require("../utils/queryString");

async function getListMember(req, res) {
  try {
    const { keyword, page, pageSize, offset } = req.query;
    const member = await models.member.findAndCountAll({
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
              jenis_kelamin: {
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
      status: "berhasil",
      msg: `Berhasil Menemukan Member`,
      data: member,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function getDetailMember(req, res) {
  try {
    const { id } = req.params;
    const member = await models.member.findByPk(id);
    if (member === null) {
      return res.status(422).json({
        status: "gagal",
        msg: "Member Tidak Ditemukan",
      });
    }
    res.json({
      status: "berhasil",
      msg: `Berhasil Menemukan Detail Member`,
      data: member,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function createMember(req, res) {
  try {
    const { nama, alamat, jenis_kelamin, telephone } = req.body;
    await models.member.create({ nama, alamat, jenis_kelamin, tlp: telephone });
    res.json({
      status: "berhasil",
      msg: "Berhasil Menanbah Member",
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

async function deleteMember(req, res) {
  try {
    const { id } = req.params;
    const member = await models.member.findByPk(id);
    if (member === null) {
      return res.status(422).json({
        status: "fail",
        msg: "Member Tidak Ditemukan",
      });
    }
    await models.member.destroy({
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

async function updateMember(req, res) {
  try {
    const { id } = req.params;
    const { nama, alamat, jenis_kelamin, telephone } = req.body;
    const member = await models.member.findByPk(id);
    if (member === null) {
      return res.status(422).json({
        status: "fail",
        msg: "Member Tidak Ditemukan",
      });
    }
    await models.member.update(
      { nama, alamat, jenis_kelamin, tlp: telephone },
      { where: { id: id } }
    );
    res.json({
      status: "berhasil",
      msg: `Berhasil Mengupdate Member`,
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
  getListMember,
  getDetailMember,
  createMember,
  deleteMember,
  updateMember,
};
