const models = require("../models");

async function getListNilai(req, res) {
  try {
    const { page, pageSize, offset } = req.query;
    const nilai = await models.nilai.findAndCountAll({
      attributes: ["id", "userId", "mapel", "nilai"],
      include: [
        {
          model: models.user,
          require: true,
          as: "user",
          attributes: ["id", ["name", "nama"], "email"],
        },
      ],
      offset: offset,
      limit: pageSize,
    });
    res.json({
      status: "berhasil",
      msg: "Nilai ditemukan",
      pagination: {
        currentPage: page,
        totalData: pageSize,
      },
      data: nilai.rows,
      query: {
        page,
        pageSize,
      },
    });
  } catch (err) {
    res.status(403).json({
      status: "fail",
      msg: "Nilai tidak ditemukan",
    });
  }
}

module.exports = getListNilai;
