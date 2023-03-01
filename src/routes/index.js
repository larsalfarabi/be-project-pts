const express = require("express");
const { register, login, authMe } = require("../controller/authController");
const jwtValidateMiddleware = require("../middleware/JwtValidateMiddleware");
const {
  outletCreate,
  getListOutlet,
  outletUpdate,
  outletDelete,
} = require("../controller/outletController");
const roleMiddleware = require("../middleware/roleMiddleWare");
const routers = express.Router();
const cors = require("cors");

routers.use(cors());

// *--- AUTH
routers.post("/register", register);
routers.post("/login", login);

// *--- implementasi JWT(json web token) validate middleware
routers.use(jwtValidateMiddleware);
routers.use(roleMiddleware);

// *--- Authme
routers.get("/authme", authMe);

// *--- outlet
routers.get("/outlet/list", getListOutlet);
routers.post("/outlet/create", outletCreate);
routers.put("/outlet/update/:id", outletUpdate);
routers.delete("/outlet/delete/:id", outletDelete);

module.exports = routers;
