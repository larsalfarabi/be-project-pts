const express = require("express");

const {
  register,
  login,
  updatePassword,
  lupaPassword,
  lupaPasswordTugas,
  lupaPasswordEmail,
} = require("../controller/authController");

const validationResultMiddleware = require("../middleware/validationResultMiddleware");
const createProdukValidator = require("../validators/produkValidator");
const {
  createUserValidator,
  updateUserValidator,
  updateNewPassword,
} = require("../validators/userValidator");
const jwtValidateMiddleware = require("../middleware/JwtValidateMiddleware");
const {
  outletCreate,
  getListOutlet,
  outletUpdate,
  outletDelete,
} = require("../controller/outletController");
const roleMiddleware = require("../middleware/roleMiddleWare");

const routers = express.Router();

// *--- AUTH
routers.post("/register", register);
routers.post("/login", login);
routers.post("/lupa-password", lupaPassword);
routers.put("/reset-password/:userId/:token", lupaPasswordEmail);

// *--- implementasi JWT(json web token) validate middleware
routers.use(jwtValidateMiddleware);
routers.use(roleMiddleware);

// *--- outlet
routers.get("/outlet/list", getListOutlet);
routers.post("/outlet/create", outletCreate);
routers.put("/outlet/update/:id", outletUpdate);
routers.delete("/outlet/delete/:id", outletDelete);

module.exports = routers;
