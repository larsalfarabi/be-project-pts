const artikelModel = require("../models").artikel;
const { Op } = require("sequelize");
const { checkQuery } = require("../utils");
async function createArtikel(req, res) {
  try {
    const payload = req.body;
    const { title, year, description } = payload;

    await artikelModel.create({
      title,
      year,
      description,
      userId: req.id,
    });

    res.json({
      status: " berhasil",
      msg: "berhasil membuat artikel",
    });
  } catch (err) {
    res.status(403).json({
      status: "fail",
      msg: "gagal membuat artikel",
    });
  }
}

//* <-- get list menggunakan metode findAll -->
// async function getListArtikel(req, res) {
//   try {
//     const artikel = await artikelModel.findAll({
//       where: {
//         userId: req.id,
//       },
//     });
//     res.json({
//       status: "berhasil",
//       msg: "artikel ditemukan",
//       data: artikel,
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       msg: "artikel tidak ditemukan",
//     });
//   }
// }

//* <-- get list menggunakan metode attributes -->
// async function getListArtikel(req, res) {
//   try {
//     const { title, dari_tahun, sampai_tahun } = req.query;
//     const artikel = await artikelModel.findAll({
//       //* --- data yang ditampilkan / filter ---
//    attributes: [
//        "id",
//        "userId",
//        ["title", "judul"], //* <--- AS / Alias
//        ["year", "tahun"],
//        "description",
//    ],

//       //* --- data yang ingin disembunyikan ---
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//       where: {
//         title: {
//           [Op.substring]: title,
//         },
//         year: {
//           [Op.between]: [dari_tahun, sampai_tahun],
//         },
//       },
//     });
//     res.json({
//       status: "berhasil",
//       msg: "artikel ditemukan",
//       data: artikel,
//       query: {
//         title,
//         dari_tahun,
//         sampai_tahun,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       msg: "artikel tidak ditemukan",
//     });
//   }
// }

async function getArtikel(req, res) {
  try {
    let {
      title,
      dari_tahun,
      sampai_tahun,
      keyword,
      year,
      page,
      pageSize,
      offset,
      sortBy = "id",
      orderBy = "ASC",
      isAll,
    } = req.query;
    // const artikel = await ArtikelModel.findAll({
    //   where: {
    //     userID: req.id,
    //   },
    // });
    const artikel = await artikelModel.findAndCountAll({
      // attributes: ['id', ['title', 'judul'], 'description'] --As
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        ...(checkQuery(isAll) &&
          isAll != 1 && {
            userID: req.id,
          }),

        ...(checkQuery(keyword) && {
          [Op.or]: [
            {
              year: {
                [Op.substring]: keyword,
              },
            },
            {
              title: {
                [Op.substring]: keyword,
              },
            },
            {
              description: {
                [Op.substring]: keyword,
              },
            },
          ],
        }),
        ...(checkQuery(year) && {
          year: {
            [Op.gte]: year,
          },
        }),
      },

      limit: pageSize,
      offset: offset,
      order: [[sortBy, orderBy]],
    });

    res.json({
      status: 200,
      msg: "Artikel was successfully",
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalData: artikel.count,
        // totalPage: artikel.count / page,
      },
      data: artikel.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: "404 Not Found",
      msg: "Ada Kesalahan",
    });
  }
}

async function updateArtikel(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { title, year, description } = payload;
    const artikel = await artikelModel.findByPk(id);

    if (artikel === null) {
      res.status(403).json({
        status: "fail",
        msg: "artikel tidak ditemukan",
      });
    }
    if (artikel.userId !== req.id) {
      return res.status(400).json({
        status: "fail",
        msg: "artikel bukan punya kamu",
      });
    }
    await artikelModel.update(
      {
        title,
        year,
        description,
      },
      {
        where: { id: id },
      }
    );

    res.json({
      status: "berhasil",
      msg: "artikel bisa diupdate",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      msg: "artikel bukan punya kamu",
    });
  }
}

async function deleteArtikel(req, res) {
  try {
    const { id } = req.params;
    const artikel = await artikelModel.findByPk(id);

    if (artikel === null) {
      res.status(403).json({
        status: "fail",
        msg: "artikel tidak ditemukan",
      });
    }
    if (artikel.userId !== req.id) {
      return res.status(400).json({
        status: "fail",
        msg: "artikel bukan punya kamu",
      });
    }
    await artikelModel.destroy({
      where: { id: id },
    });
    res.json({
      status: "berhasil",
      msg: "artikel bisa dihapus",
    });
  } catch (err) {
    res.status(403).json({
      status: "fail",
      msg: "artikel bukan punya kamu",
    });
  }
}

async function creatingArtikelBulk(req, res) {
  try {
    // const payload = req.body.payload;
    const { payload } = req.body;
    payload.map((item, index) => {
      item.userId = req.id; //* --- menambah properti baru di array
    });
    await artikelModel.bulkCreate(payload);
    // const artikel = await artikelModel.create{}
    res.json({
      status: 200,
      msg: "Create Artikel Bulk berhasil",
      // payload,
    });
  } catch (e) {
    res.status(403).json({
      status: "error",
      msg: "gagal",
    });
  }
}

async function createArtikelMulti(req, res) {
  try {
    const { payload } = req.body;

    let success = 0;
    let fail = 0;
    let jumlah = payload.length;
    await Promise.all(
      payload.map(async (item, index) => {
        try {
          await artikelModel.create({
            title: item.title,
            year: item.year,
            description: item.description,
            userId: req.id,
          });

          success = success + 1;
        } catch (err) {
          fail = fail + 1;
        }
      })
    );

    res.status(201).json({
      status: "Success",
      msg: `sukses menambahkan ${success} artikel dari total ${jumlah} artikel dan gagal ${fail} artikel`,
    });
  } catch (err) {
    res.status(403).json({
      status: "error",
      msg: "gagal",
    });
  }
}

async function deleteArtikelMulti(req, res) {
  try {
    const { payload } = req.body;

    let success = 0;
    let fail = 0;
    let jumlah = payload.length;
    await Promise.all(
      payload.map(async (item) => {
        try {
          const id = await artikelModel.findOne({
            where: { id: item.id },
          });
          if (id.userId !== req.id) {
            return (fail = fail + 1);
          } else {
            await artikelModel.destroy({
              where: { id: item.id },
            });
            success = success + 1;
          }
        } catch (err) {
          fail = fail + 1;
        }
      })
    );
    res.json({
      status: "success",
      msg: `sukses menghapus ${success} artikel dari total ${jumlah} artikel dan gagal ${fail} artikel`,
    });
  } catch (err) {
    res.status(403).json({
      status: "error",
      msg: "tidak bisa menghapus artikel",
    });
  }
}

module.exports = {
  createArtikel,
  getArtikel,
  updateArtikel,
  deleteArtikel,
  creatingArtikelBulk,
  createArtikelMulti,
  deleteArtikelMulti,
};
