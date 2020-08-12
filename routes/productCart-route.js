const express = require("express")
const router = express.Router()
const controller = require('../controllers/productCart-controller')
const { eAdmin } = require("../helpers/eAdmin")

//Produtos


router.get("/products/request",controller.getRequest) 
router.post("/products/addr", controller.postRequest)


module.exports = router