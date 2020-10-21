const express = require("express");
const router = express.Router();
const controller = require("../controllers/planning-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eDevAdmin");

//PRODUTOS - ROTA CARRINHO DE COMPRAS
router.get("/",eAdmin, controller.dashboard);
router.get("/products/:id", controller.request);
router.post("/planning", controller.postPlanning);
router.get("/request/:id?", controller.getCart);
router.post("/addItem", controller.postRequest);
router.post("/updateItem", controller.updateRequest);


module.exports = router;