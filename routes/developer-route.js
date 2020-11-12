const express = require("express");
const router = express.Router();
const controller = require("../controllers/developer-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

router.get("/", controller.getIndex);
router.get("/cep", controller.getTeste);

module.exports = router;
