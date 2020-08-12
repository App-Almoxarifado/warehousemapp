const express = require("express")
const router = express.Router()
const controller = require('../controllers/productUpdate-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")

//PRODUTOS - ATUALIZANDO PRODUTOS
router.get('/edit/:id', controller.getUpdate)
router.post("/edit", controller.postUpdate) 




module.exports = router