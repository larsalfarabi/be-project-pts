const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const routers = express.Router();
const console1 = require("../middleware/console1");
const console2 = require("../middleware/console2");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uploadSingle = require("../storage/fileUploadSingle");
const upload = multer({ dest: "public" });

routers.get("/", console1, (req, res) => {
  res.send({
    status: "Success",
    message: "ini request dengan method GET",
  });
});

routers.post("/", console2, (req, res) => {
  res.send({
    status: "Success",
    message: "ini request dengan method POST",
  });
});

routers.use(authMiddleware);

routers.put("/", (req, res) => {
  res.send({
    status: "Success",
    message: "ini request dengan method PUT",
  });
});

routers.patch("/", (req, res) => {
  res.send({
    status: "Success",
    message: "ini request dengan method PATCH",
  });
});

routers.delete("/", (req, res) => {
  res.send({
    status: "Success",
    message: "ini request dengan method DELETE",
  });
});

/* --- route dinamis dengan params --- */

routers.get("/murid/:nama/:sekolah", (req, res) => {
  // let nama = req.params.nama;
  // let sekolah = req.params.sekolah;

  let { nama, sekolah } = req.params;
  res.send({
    status: "Success",
    message: `Siswa atas Nama ${nama}, sekolah di ${sekolah} ditemukan`,
  });
});

/* --- route dinamis dengan query string --- */

routers.get("/siswa/:nama", (req, res) => {
  console.log("query", req.query);
  console.log("Params", req.params);
  let { nama } = req.params;
  let { kelas = "X", angkatan = "9" } = req.query;
  res.send({
    status: "Success",
    message: `Siswa atas Nama ${nama}, Kelas ${kelas} dan angkatan ke-${angkatan} ditemukan`,
  });
});

routers.get("/absensi/:nama", (req, res) => {
  let { nama } = req.params;
  let { status, dariTanggal, sampaiTanggal } = req.query;
  res.send({
    status: "success",
    message: "berhasil",
    data: {
      nama: nama,
      status: status,
      dariTanggal: dariTanggal,
      sampaiTanggal: sampaiTanggal,
    },
  });
});

/* --- penggunaan middleware body parser --- */
/* --- parser x-www-form-url-encode --- */

routers.post("/user", (req, res) => {
  const payload = req.body;
  res.send({
    status: "Success",
    message: "Latihan request Body",
    data: payload,
  });
});

// Upload file

routers.post("/upload/single", uploadSingle, (req, res) => {
  res.send({
    status: "success",
    msg: "Upload Success",
    file: req.file,
  });
});

module.exports = routers;
