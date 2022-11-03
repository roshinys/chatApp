const User = require("../model/User");
const Group = require("../model/Group");
const UserGroup = require("../model/UserGroup");
const Message = require("../model/Messages");

const { Op } = require("sequelize");

exports.newChat = async (req, res) => {
  const groupId = req.body.id;
  const content = req.body.content;
  const user = req.user;
  const result = await user.createMessage({
    content: content,
    groupId: groupId,
  });
  res.json({ success: true, msg: "message sent", result });
};

exports.getGroup = async (req, res) => {
  try {
    const loggedUserId = req.user.id;
    const groudId = req.params.groudId;
    const groups = await Group.findAll({
      where: {
        id: groudId,
      },
    });
    const group = groups[0];
    const groupMessages = await group.getMessages({ include: User });
    res.json({ groudId, group, groupMessages, loggedUserId });
  } catch (err) {
    console.log(err);
    res.status(404).json({ success: false, msg: "smtg went wrong" });
  }
};

exports.allGroup = async (req, res) => {
  try {
    const user = req.user;
    const groups = await user.getGroups();
    res.status(200).json({ success: true, msg: "got all groups", groups });
  } catch (err) {
    res.status(404).json({ success: false, msg: "smtg went wrong" });
  }
};

exports.newGroup = async (req, res) => {
  try {
    const groupName = req.body.groupName;
    const user = req.user;
    const newGroup = await Group.create({
      name: groupName,
    });
    const group = await user.addGroup(newGroup);
    const groupId = newGroup.id;
    res
      .status(201)
      .json({ success: true, msg: "created group", groupName, groupId });
  } catch (err) {
    res.status(404).json({ success: false, msg: "smtg went wrong" });
  }
};
