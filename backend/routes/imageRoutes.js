const express = require("express");

const router = express.Router();
const middleware = require("../middleware/authenticate");
const imageController = require("../controllers/imageControllers");

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/new-image",
  middleware.authenticate,
  upload.single("image"),
  imageController.newImage
);

module.exports = router;
