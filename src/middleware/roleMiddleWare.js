const kasirMiddleware = (req, res, next) => {
  if (req.role == "kasir") {
    return res.status(403).json({
      status: "error",
      msg: "Anda tidak memiliki akses karena role anda adalah kasir",
    });
  } else {
    next();
  }
};
const ownerMiddleware = (req, res, next) => {
  if (req.role == "owner") {
    return res.status(403).json({
      status: "error",
      msg: "Anda tidak memiliki akses karena role anda adalah owner",
    });
  } else {
    next();
  }
};
module.exports = { kasirMiddleware, ownerMiddleware };
