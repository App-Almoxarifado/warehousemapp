const express = require("express");
const router = express.Router();
const controller = require("../controllers/interval-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

router.get("/breaks", controller.getList);

module.exports = router;
