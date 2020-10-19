const express = require("express");
const router = express.Router();
const controller = require("../controllers/warehouse-controller");

//PRODUTOS - ROTA CARRINHO DE COMPRAS
router.get("/", controller.request);
router.get("/cart/:id?", controller.getCart);
router.post("/addItem", controller.postRequest);
router.post("/updateItem", controller.updateRequest);
router.get("/search/group/:id", controller.getSearch);

module.exports = router;