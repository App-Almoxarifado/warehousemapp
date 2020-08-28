const express = require("express");
const router = express.Router();
const controller = require("../controllers/provider-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

router.get("/providers", controller.getList);

module.exports = router;
