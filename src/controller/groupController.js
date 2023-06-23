const models = require("../models");
const crypto = require("crypto");
const { sequelize } = require("../models");

async function getGroup(req, res) { 
  try {
    const group = await models.groupRoom.findAll({
      include: [
        {
          model: models.group,
          required: true,
          as: "nama_group",
        },
        {
          model: models.user,
          required: true,
          as: "member_group",
        },
      ],
    });
    res.json({
      status: "berhasil",
      msg: "Berhasil Memdapatkan Group",
      data: group,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
}

async function createGroup(req, res) {
  let db_transaction = await sequelize.transaction();
  try {
    const { nama, member } = req.body;
    const { id } = await models.group.create(
      {
        nama,
      },
      { transaction: db_transaction }
    );

    let roomCode = crypto.randomBytes(24).toString("hex");
    member.push(req.id);
    await Promise.all(
      member.map(async (item) => {
        await models.groupRoom.create(
          {
            member: item,
            groupId: id,
            chatRoom: roomCode,
          },
          { transaction: db_transaction }
        );
      })
    );
    db_transaction.commit();
    return res.status(201).json({
      status: "berhasil",
      msg: "Berhasil Membuat Group",
    });
  } catch (error) {
    db_transaction.rollback();
    console.log(error);
    return res.sendStatus(403);
  }
}

async function saveMessageGroup(data) {
  try {
    await models.conversationGroup.create({
      sender: data?.sender,
      to: data?.to,
      time: data?.time,
      message: data?.message,
      roomCode: data?.room,
    });
  } catch (error) {
    console.log(error);
  }
}


async function getMessageListGroup(req, res) {
  try {
    const messageList = await models.conversationGroup.findAll({
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
  createGroup,
  getGroup,
  saveMessageGroup,
  getMessageListGroup
}
