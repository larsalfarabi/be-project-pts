const authMiddleware = (req, res, next) => {
  console.log("Header", req.headers);

  if (req?.headers?.authorization === "123") {
    next();
  } else if (req?.headers?.authorization === undefined) {
    return res.status(401).json({
      status: "fail",
      message: "Kirimkan token",
    });
  } else {
    return res.status(401).json({
      status: "fail",
      message: "Token tidak valid",
    });
  }
};

// const authMiddleware3 = (req, res, next) => {
//   console.log("auth kedua");
//   next();
// };

module.exports = authMiddleware;
