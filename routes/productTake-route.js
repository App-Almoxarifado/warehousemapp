const express = require("express");
const router = express.Router();
const controller = require("../controllers/productTake-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

//PRODUTOS - ROTA DE PEDIDOS
router.get("/take/:id", eAdmin || eDevAdmin, controller.getCreateTake);
router.post("/take", eAdmin || eDevAdmin, controller.postCreateTake);

module.exports = router;
