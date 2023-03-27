const { check } = require("express-validator");

const createUserValidator = [
  check("nama").isLength({ min: 1 }).withMessage("Nama wajib diisi"),
  check("username")
    .isLength({ min: 5 })
    .withMessage("must be at least 5 chars long"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("must be at least 5 chars long")
    .matches(/\d/)
    .withMessage("must contain a number"),
  check("role")
    .isIn(["kasir", "owner", "admin"])
    .withMessage("role must be admin | owner | kasir"),
];

const updateUserValidator = [
  check("nama").isLength({ min: 1 }).withMessage("Nama wajib diisi"),
  check("username")
    .isLength({ min: 5 })
    .withMessage("must be at least 5 chars long"),
  check("role")
    .isIn(["kasir", "owner", "admin"])
    .withMessage("role must be admin | owner | kasir"),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
};
