const express = require("express");
const router = express.Router();
const controller = require("../controllers/productRead-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

//PRODUTOS - VIZUALIZAÇÃO DOS PRODUTOS
router.get("/", eAdmin || eDevAdmin, controller.getList);
router.get("/table", eAdmin || eDevAdmin, controller.getListTable);

module.exports = router;
