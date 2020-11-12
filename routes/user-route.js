const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

router.get("/register", controller.get);
router.post("/register", controller.getCreate);
router.get("/login", controller.getLogin);
router.post("/login", controller.getStay);
router.get("/logout", controller.getlogout);

module.exports = router;
