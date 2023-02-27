const UserModel = require("../models").user;
const ForgotPasswordModel = require("../models").password;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const dayjs = require("dayjs");
var jwt = require("jsonwebtoken");
const sendEmailHandle = require("../mail/index");
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

    const user = await UserModel.findOne({
      where: {
        username: username,
      },
    });

    if (user === null) {
      res.status(422).json({
        status: "gagal",
        msg: "email tidak ditemukan, silahkan register",
      });
    }

    // if (password === null) {
    //   return res.status(422).json({
    //     status: "gagal",
    //     msg: "email dan password tidak cocok",
    //   });
    // }

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
        msg: "email dan password tidak cocok",
      });
    }

    res.json({
      status: "berhasil",
      msg: "berhasil login",
      token: token,
      user: user,
    });
  } catch (err) {
    res.status(403).json({
      status: "gagal",
      msg: "Ada kesalahan",
    });
  }
}

async function updatePassword(req, res) {
  try {
    const payload = req.body;
    const { email, password, new_password } = payload;
    const user = await UserModel.findOne({
      where: {
        email: req.email,
      },
    });

    const verify = await bcrypt.compareSync(password, user.password);

    if (user === null) {
      res.status(422).json({
        status: "gagal",
        msg: "email tidak ditemukan, silahkan register",
      });
    }
    if (req.email !== user.email) {
      res.json({
        msg: "email bukan punya kamu",
      });
    }

    if (verify) {
      let hashPassword = await bcrypt.hash(new_password, 10);

      await UserModel.update(
        {
          password: hashPassword,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
    } else {
      res.json({
        msg: "password lama tidak sesuia",
      });
    }
    res.status(201).json({
      status: "berhasil",
      msg: "berhasil mengupdate password",
    });
  } catch (err) {
    res.status(403).json({
      status: "gagal",
      msg: "Ada kesalahan update password",
    });
  }
}

// async function lupaPassword(req, res) {
//   try {
//     const { email } = req.body;

//     //* --- cek apakah user dengan email tsb terdaftar
//     const user = await UserModel.findOne({
//       where: {
//         email: email,
//       },
//     });
//     //* --- jika tidak terdaftar berikan response dengan msg email tidak terdaftar
//     if (user == null) {
//       return res.status(403).json({
//         status: "fail",
//         msg: "email tidak terdaftar,silahkan gunakan email yang terdaftar",
//       });
//     }
//     //* --- cek apakah token sudah pernah dibuat pada user tsb di table forgot password
//     const currentToken = await ForgotPasswordModel.findOne({
//       where: {
//         userId: user.id,
//       },
//     });

//     //* --- jika ada, hapus token
//     if (currentToken !== null) {
//       await ForgotPasswordModel.destroy({
//         where: {
//           userId: user.id,
//         },
//       });
//     }
//     //* --- jika belum buat token

//     const token = crypto.randomBytes(32).toString("hex");
//     const date = new Date();
//     const expire = date.setHours(date.getHours() + 1);

//     await ForgotPasswordModel.create({
//       userId: user.id,
//       token: token,
//       expireDate: dayjs(expire).format("YYYY-MM-DD hh:mm:ss"),
//     });

//     const context = {
//       link: "https://pas-react-alfarabi.netlify.app/forgotPassword",
//     };
//     const sendEmail = await sendEmailHandle(
//       email,
//       "lupa password",
//       "lupaPassword",
//       context
//     );

//     if (sendEmail === "success") {
//       res.json({
//         status: "success",
//         msg: "silahkan cek email",
//       });
//     } else {
//       res.json({
//         status: "fail",
//         msg: "gunakan email yang terdaftar",
//       });
//     }

//     res.json({
//       status: 200,
//       msg: "berhasil",
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(403).json({
//       msg: "gagal",
//     });
//   }
// }

async function lupaPassword(req, res) {
  // let date = new Date()
  // // date.setHours(date.getHours() )
  // // date.setHours(date.getHours() + 1)

  try {
    const { email } = req.body;

    //cek apakah user dengan email tsb terdaftar
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    //jika tidak terdaftar berikan response dengan msg email tidak terdaftar
    if (user === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email Tidak ditemukan, Silahkan gunakan email yang terdaftar",
      });
    }
    // cek apakah token sudah pernah dibuat pada user tsb di table forgot password
    const currenToken = await ForgotPasswordModel.findOne({
      where: {
        userId: user?.id,
      },
    });
    // jika ada , hapus token lama
    if (currenToken !== null) {
      await ForgotPasswordModel.destroy({
        where: {
          userId: user.id,
        },
      });
    }
    // jika belum buat token
    const token = crypto.randomBytes(32).toString("hex");
    const date = new Date();
    const expire = date.setHours(date.getHours() + 1);

    await ForgotPasswordModel.create({
      userId: user?.id,
      token: token,
      expireDate: dayjs(expire).format("YYYY-MM-DD hh:mm:ss"),
    });

    const context = {
      link: `${process.env.MAIL_CLIENT_URL}/reset-password/${user.id}/${token}`,
    };
    const sendEmail = await sendEmailHandle(
      email,
      "lupa password",
      "lupaPassword",
      context
    );

    if (sendEmail === "success") {
      res.json({
        status: "Success",
        msg: "Silahkan cek email",
      });
    } else {
      res.status(400).json({
        status: "Fail",
        msg: "Gunakan Email yang terdaftar",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
      err,
    });
  }
}

async function lupaPasswordEmail(req, res) {
  try {
    const { new_password } = req.body;
    const { userId, token } = req.params;

    const currenToken = await ForgotPasswordModel.findOne({
      where: { token: token, userId: userId },
    });

    const user = await UserModel.findOne({
      where: {
        id: userId,
      },
    });

    if (currenToken === null) {
      res.status(403).json({
        status: "fail",
        msg: "token invalid",
      });
    } else {
      let userExpired = currenToken.expireDate;
      let expire = dayjs(Date());
      console.log(expire);
      let difference = expire.diff(userExpired, "hour");
      if (difference !== 0) {
        res.json({
          status: "Fail",
          msg: "Token has expired",
        });
      } else {
        let hashPassword = await bcrypt.hash(new_password, 10);

        await UserModel.update(
          {
            password: hashPassword,
          },
          {
            where: {
              id: user.id,
            },
          }
        );
        await ForgotPasswordModel.destroy({
          where: { token: token },
        });
        res.json({
          status: "success",
          msg: "password was updated",
        });
      }
    }
  } catch (e) {
    res.status(403).json({
      msg: "gagal",
    });
  }
}

module.exports = {
  register,
  login,
  updatePassword,
  lupaPassword,
  lupaPasswordEmail,
};
