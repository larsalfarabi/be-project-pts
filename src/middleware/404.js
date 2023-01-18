const notFound = (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Routing tidak ditemukan",
  });
};

module.exports = notFound;
