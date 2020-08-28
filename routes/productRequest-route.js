const express = require("express");
const router = express.Router();
const controller = require("../controllers/productRequest-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

//PRODUTOS - ROTA DE PEDIDOS
router.get("/take/:id", eAdmin || eDevAdmin, controller.getCreateRequest);
router.post("/newRequest", eAdmin || eDevAdmin, controller.postCreateRequest);

module.exports = router;
