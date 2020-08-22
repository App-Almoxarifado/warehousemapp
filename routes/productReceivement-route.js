const express = require("express")
const router = express.Router()
const controller = require('../controllers/productReceivement-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")

//PRODUTOS - ROTA CARRINHO DE COMPRAS
router.get("/receivement/:id?",controller.getReceivement) 
router.post("/addItem", controller.postReceivement)



module.exports = router