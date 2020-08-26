const express = require("express")
const router = express.Router()
const controller = require('../controllers/productCart-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")

//PRODUTOS - ROTA CARRINHO DE COMPRAS
router.get("/request",controller.getRequest) 
router.get("/cart/:id?",controller.getCart) 
router.post("/addItem", controller.postRequest)
router.post("/updateItem", controller.updateRequest)


module.exports = router