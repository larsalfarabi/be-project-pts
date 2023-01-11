// --- pertemuan pertama ---

const http = require("http");
const { smk, bilangan } = require("./example");
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.write(bilangan(100));
  res.write(smk);
  res.end();
});

const hostname = "localhost";
const port = 8085;
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

