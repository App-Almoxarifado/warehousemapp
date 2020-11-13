const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");
const multer = require("multer");
const multerConfig = require("../config/multer");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eDevAdmin");

router.get("/register", controller.get);
router.post("/register", multer(multerConfig).single("file"),controller.getCreate);
router.get("/login", controller.getLogin);
router.post("/login", controller.getStay);
router.get("/logout", controller.getlogout);

module.exports = router;
