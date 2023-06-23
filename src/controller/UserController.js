const models = require("../models");
const { Op } = require("sequelize");
async function getUser(req, res) {
  try {
    const user = await models.user.findAll({
      where: {
        id: {
          [Op.ne]: req.id,
        },
      },
    });
    
    res.json({
      status: "berhasil",
      msg: "Berhasil Mendapat User",
      data: user,
    });
  } catch (error) {
    return res.status(403).json({
      status: "gagal",
      msg: "Ada Kesalahan",
    });
  }
}

module.exports = {
  getUser,
};
