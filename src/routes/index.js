const express = require("express");
const { register, login, authMe } = require("../controller/authController");
const jwtValidateMiddleware = require("../middleware/JwtValidateMiddleware");
const {
  outletCreate,
  getListOutlet,
  outletUpdate,
  outletDelete,
  getDetailOutlet,
} = require("../controller/outletController");
const roleMiddleware = require("../middleware/roleMiddleWare");
const routers = express.Router();
const cors = require("cors");
const {
  getListUser,
  createUser,
  getDetailUser,
  updateUser,
  deleteUser,
} = require("../controller/userController");
const {
  createUserValidator,
  updateUserValidator,
} = require("../validators/userValidator");
const validationResultMiddleware = require("../middleware/validationResultMiddleware");
const {
  getListPaket,
  createPaket,
  deletePaket,
  getDetailPaket,
  updatePaket,
} = require("../controller/paketController");
const {
  getListMember,
  createMember,
  deleteMember,
  getDetailMember,
  updateMember,
} = require("../controller/memberController");
const {
  createTransaksi,
  getListTransaksi,
  updateTransaksi,
  detailTransaksi,
  deleteTransaksi,
  updateTransaksiPembayaran,
  downloadExcel,
  getLaporan,
} = require("../controller/transaksiController");
const { getDetailTransaksi } = require("../controller/detailController");

routers.use(cors());

// *--- AUTH
routers.post("/register", register);
routers.post("/login", login);

// *--- implementasi JWT(json web token) validate middleware
routers.use(jwtValidateMiddleware);

// *--- Authme
routers.get("/authme", authMe);

// *--- Member
routers.get("/member/list", getListMember);
routers.get("/member/detail/:id", getDetailMember);
routers.post("/member/create", createMember);
routers.delete("/member/delete/:id", deleteMember);
routers.put("/member/update/:id", updateMember);

// *--- outlet
routers.get("/outlet/list", getListOutlet);
routers.get("/outlet/detail/:id", getDetailOutlet);
routers.post("/outlet/create", outletCreate);
routers.put("/outlet/update/:id", outletUpdate);
routers.delete("/outlet/delete/:id", outletDelete);

// *--- user
routers.get("/user/list", getListUser);
routers.get("/user/detail/:id", getDetailUser);
routers.post(
  "/user/create",
  createUserValidator,
  validationResultMiddleware,
  createUser
);
routers.put(
  "/user/update/:id",
  updateUserValidator,
  validationResultMiddleware,
  updateUser
);
routers.delete("/user/delete/:id", deleteUser);

// *--- paket
routers.get("/paket/list", getListPaket);
routers.get("/paket/detail/:id", getDetailPaket);
routers.post("/paket/create", createPaket);
routers.delete("/paket/delete/:id", deletePaket);
routers.put("/paket/update/:id", updatePaket);

// *--- transkasi
routers.post("/transaksi/create", createTransaksi);
routers.get("/transaksi/list", getListTransaksi);
routers.put("/transaksi/update/:id", updateTransaksi);
routers.put("/transaksi/updatePembayaran/:id", updateTransaksiPembayaran);
routers.delete("/transaksi/delete/:id", deleteTransaksi);

// *--- detail transaksi
routers.get("/transaksi/detail/:id", getDetailTransaksi);

// *--- excel / laporan
routers.get("/laporan/list", getLaporan);
routers.get("/laporan/download", downloadExcel);
module.exports = routers;
