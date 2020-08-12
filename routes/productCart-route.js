const express = require("express")
const router = express.Router()
const controller = require('../controllers/productCart-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")

//PRODUTOS - ROTA CARRINHO DE COMPRAS
router.get("/request",controller.getRequest) 
router.post("/addr", controller.postRequest)


module.exports = router