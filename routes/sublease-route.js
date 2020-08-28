const express = require("express");
const router = express.Router();
const controller = require("../controllers/sublease-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

router.get("/subleases", controller.getList);

module.exports = router;
