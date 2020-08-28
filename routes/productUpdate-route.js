const express = require("express");
const router = express.Router();
const controller = require("../controllers/productUpdate-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

//PRODUTOS - ATUALIZANDO PRODUTOS
router.get("/edit/:id", eAdmin || eDevAdmin, controller.getUpdate);
router.post("/edit", eAdmin || eDevAdmin, controller.postUpdate);

module.exports = router;
