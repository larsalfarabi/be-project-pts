const express = require("express");
const routers = express.Router();
const { register, login, authMe } = require("../controller/authController");
const jwtValidateMiddleware = require("../middleware/jwtValidateMiddleware");
const { getUser } = require("../controller/userController");
const {
  generateCode,
  getMessageList,
} = require("../controller/chatController");
const {
  createGroup,
  getGroup,
  generateCodeGroup,
  getMessageListGroup,
} = require("../controller/groupController");
// *--- AUTH
routers.post("/register", register);
routers.post("/login", login);

// *--- implementasi JWT(json web token) validate middleware
routers.use(jwtValidateMiddleware);

// *--- Authme
routers.get("/authme", authMe);

// *--- chat / user
routers.get("/chat/list", getUser);
routers.post("/chat/generate-code", generateCode);
routers.post("/chat/messageList", getMessageList);

// *--- group
routers.get("/group/list", getGroup);
routers.post("/group/create", createGroup);
routers.post("/group/messageList", getMessageListGroup);

module.exports = routers;
