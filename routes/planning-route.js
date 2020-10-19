const express = require("express");
const router = express.Router();
const controller = require("../controllers/planning-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eDevAdmin");

//PRODUTOS - ROTA CARRINHO DE COMPRAS
router.get("/",eAdmin, controller.request);
router.get("/cart/:id?", controller.getCart);
router.post("/addItem", controller.postRequest);
router.post("/updateItem", controller.updateRequest);
router.get("/search/group/:id", controller.getSearch);

module.exports = router;