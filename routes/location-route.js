const express = require("express");
const router = express.Router();
const controller = require("../controllers/location-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

router.get("/leases", controller.getList);

module.exports = router;
