const ChatModel = require("../models").chatRoom;
const crypto = require("crypto");
const { Op } = require("sequelize");
const messageModel = require("../models").conversation;

async function generateCode(req, res) {
  try {
    // const send = req.id;
    const nama1 = req.nama;
    const nama2 = req.body.nama_penerima;

    const code = await ChatModel.findOne({
      attributes: ["nama1", "nama2", "chatRoom"],
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              {
                nama1: nama1,
              },
              { nama2: nama2 },
            ],
          },
          {
            [Op.and]: [
              {
                nama1: nama2,
              },
              { nama2: nama1 },
            ],
          },
        ],
      },
    });

    if (code == null) {
      let roomCode = crypto.randomBytes(24).toString("hex");
      await ChatModel.create({
        nama1,
        nama2,
        chatRoom: roomCode,
      });
      return res.status(201).json({
        status: "berhasil membuat",
        code: {
          nama1,
          nama2,
          roomCode,
        },
      });
    } else {
      return res.json({
        status: "berhasil mendapatkan",
        code,
      });
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
}
async function saveMessage(data) {
  try {

    await messageModel.create({
      sender: data?.sender,
      to: data?.to,
      message: data?.message,
      time: data?.time,
      roomCode: data?.room,
    });
  } catch (error) {
    console.log(error);
  }
}
async function getMessageList(req, res) {
  try {
    const messageList = await messageModel.findAll({
      where: {
        roomCode: req.body.room_code,
      },
    });

    return res.json({
      status: "berhasil mendapatkan",
      data: messageList,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
}
module.exports = {
  generateCode,
  saveMessage,
  getMessageList,
};
