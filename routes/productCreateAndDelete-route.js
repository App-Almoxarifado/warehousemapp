const express = require("express")
const router = express.Router()
const controller = require('../controllers/productCreateAndDelete-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")

//PRODUTOS - CRIAR E DELETAR
router.get("/add",controller.getCreate) 
router.post("/new", controller.postCreate)
router.get("/delete/:id", controller.getDelete) 


module.exports = router