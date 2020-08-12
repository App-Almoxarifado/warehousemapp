const express = require("express")
const router = express.Router()
const controller = require('../controllers/productMovement-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")

//PRODUTOS - MOVIMENTAÇÃO INTERNA
router.get("/move/:id", controller.getCreateMove) 
router.post("/newmove", controller.postCreateMove)




module.exports = router