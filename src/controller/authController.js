const UserModel = require("../models").user;
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config;

async function register(req, res) {
  try {
    const payload = req.body;
    const { nama, username, password, id_outlet, role } = payload;

    let hashPassword = await bcrypt.hashSync(password, 10);

    await UserModel.create({
      nama,
      username,
      password: hashPassword,
      id_outlet,
      role,
    });
    res.json({
      status: "berhasil",
      msg: "berhasil register",
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: "gagal",
      msg: "Ada kesalahan",
    });
  }
}

async function login(req, res) {
  try {
    const payload = req.body;
    const { username, password } = payload;
    const data = await UserModel.findOne({
      attributes: { exclude: ["password"] },
    });
    const user = await UserModel.findOne({
      where: {
        username: username,
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
        username: user?.username,
        id_outlet: user?.id_outlet,
        role: user?.role,
      },
      process.env.JWT_SCRIPT,
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

    return res.json({
      status: "berhasil",
      msg: "Berhasil login",
      token: token,
      data: data,
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
    const username = req.username;

    const user = await UserModel.findOne({
      where: {
        username: username,
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
        username: user?.username,
        id_outlet: user?.id_outlet,
        role: user?.role,
      },
      process.env.JWT_SCRIPT,
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
  register,
  login,
  authMe,
};
