const { check } = require("express-validator");

const createProdukValidator = [
  check("nama").isLength({ min: 1 }).withMessage("harus diisi"),
  check("harga").isNumeric().withMessage("harus diisi dengan angka"),
  check("stok").isNumeric().withMessage("harus diisi dengan angka"),
  check("deskipsi").isLength({ min: 10 }).withMessage("harus diisi"),
  check("lokasi").isLength({ min: 1 }).withMessage("harus diisi"),
];

module.exports = createProdukValidator;
