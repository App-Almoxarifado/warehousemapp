const express = require("express");
const router = express.Router();
const controller = require("../controllers/planning-controller");

//PRODUTOS - ROTA CARRINHO DE COMPRAS
router.get("/request", controller.getRequest);
router.get("/cart/:id?", controller.getCart);
router.post("/addItem", controller.postRequest);
router.post("/updateItem", controller.updateRequest);
router.get("/group/:id", controller.getGroup);

module.exports = router;