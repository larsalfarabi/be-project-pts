const express = require("express");
const app = express();
const port = 8080;
const routers = require("./src/routes/index");
const authMiddleware = require("./src/middleware/authMiddleware");
const notFound = require("./src/middleware/404");
const errorHandling = require("./src/middleware/errorhandling");
const hostname = "localhost";

// parse JSON
app.use(express.json());
// app.use(authMiddleware);
app.use(routers);
app.use(errorHandling);
app.use(notFound);

app.listen(port, hostname, () =>
  console.log(`Server berjalan di http://${hostname}:${port}`)
);
