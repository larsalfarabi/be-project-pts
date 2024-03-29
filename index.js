const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const { sequelize } = require("./src/models");
const routers = require("./src/routes/index");
const notFound = require("./src/middleware/404");
const errorHandling = require("./src/middleware/errorhandling");
const hostname = "172.16.70.72";
const paginationMiddleWare = require("./src/middleware/paginationMidlleWare");
// parse JSON
app.use(express.json());
app.use(paginationMiddleWare);
app.use(routers);
app.use(errorHandling);
app.use(notFound);

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  console.log(`Server berjalan di http://:${port}`);
});
