const express = require("express");
const router = express.Router();
const controller = require("../controllers/productCreateAndDelete-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

//PRODUTOS - CRIAR E DELETAR
router.get("/add", eAdmin || eDevAdmin, controller.getCreate);
router.post("/new", eAdmin || eDevAdmin, controller.postCreate);
router.get("/delete/:id", eAdmin || eDevAdmin, controller.getDelete);

module.exports = router;
