const express = require("express");

const router = express.Router();
const middleware = require("../middleware/authenticate");
const groupchatController = require("../controllers/groupchatControllers");

router.post(
  "/new-group",
  middleware.authenticate,
  groupchatController.newGroup
);

router.post("/new-chat", middleware.authenticate, groupchatController.newChat);

router.get(
  "/all-groups",
  middleware.authenticate,
  groupchatController.allGroup
);

router.get(
  "/get-chat/:groudId",
  middleware.authenticate,
  groupchatController.getGroup
);

module.exports = router;
