const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 8;

exports.newUser = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;
    if (!email || !username || !phoneNumber || !password) {
      res.json({ success: false, msg: "input required" });
      return;
    }
    const userExist = await User.findAll({ where: { email: email } });
    if (userExist[0]) {
      res.json({ success: false, msg: "User Already Exist" });
      return;
    }
    const hashPass = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      username,
      email,
      phoneNumber,
      password: hashPass,
    });
    res
      .status(200)
      .json({ user, success: true, msg: "successfully created user" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ success: false, msg: "smtg went wrong" });
  }
};
