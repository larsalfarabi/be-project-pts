const UserModel = require("../models").user;
const bcrypt = require("bcrypt");
require("dotenv").config;
const jwt = require("jsonwebtoken");

async function register(req, res) {
  try {
    const payload = req.body;
    const { nama, password } = payload;

    let hashPassword = await bcrypt.hashSync(password, 10);

    await UserModel.create({
      nama,
      password: hashPassword,
    });
    res.json({
      status: "berhasil",
      msg: "berhasil register",
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "gagal",
      msg: "Ada kesalahan",
    });
  }
}

async function login(req, res) {
  try {
    const payload = req.body;
    const { nama, password } = payload;
    const user = await UserModel.findOne({
      where: {
        nama,
      },
    });

    if (user === null) {
      return res.status(422).json({
        status: "gagal",
        msg: "Username tidak ditemukan, silahkan register",
      });
    }

    const verify = await bcrypt.compareSync(password, user.password);

    const token = await jwt.sign(
      {
        id: user?.id,
        nama: user?.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    if (!verify) {
      return res.status(422).json({
        status: "gagal",
        msg: "Username dan password tidak cocok",
      });
    }
    console.log(req.body);

    return res.json({
      status: "berhasil",
      msg: "Berhasil login",
      token: token,
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(422).json({
      status: "gagal",
      msg: "Ada kesalahan",
    });
  }
}

async function authMe(req, res) {
  try {
    const nama = req.nama;
    const user = await UserModel.findOne({
      //   attributes: { exclude: ["password"] },
      where: {
        nama,
      },
    });
    if (!user) {
      return res.status(403).json({
        status: "gagal",
        msg: "Username tidak ditemukan ",
      });
    }

    const token = await jwt.sign(
      {
        id: user?.id,
        nama: user?.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      status: "berhasil",
      msg: "Berhasil Authme",
      data: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  login,
  register,
  authMe,
};
