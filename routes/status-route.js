const express = require("express");
const router = express.Router();
const controller = require("../controllers/status-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

router.get("/status", controller.getList);

module.exports = router;
