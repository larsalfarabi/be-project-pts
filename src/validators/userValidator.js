const { check } = require("express-validator");
const UserModel = require("../models").user;

const createUserValidator = [
  check("name").isLength({ min: 1 }).withMessage("nama wajib diisi"),
  check("email")
    .isEmail()
    .withMessage("gunakan format email")
    .custom((value) => {
      return UserModel.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
];

const updateUserValidator = [
  check("name").isLength({ min: 1 }).withMessage("nama wajib diisi"),
];

const updateNewPassword = [
  check('new_password').isLength({min: 8}).withMessage('password harus lebih dari 8')
]

module.exports = { createUserValidator, updateUserValidator , updateNewPassword};
