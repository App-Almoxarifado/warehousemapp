const express = require("express")
const router = express.Router()
const controller = require('../controllers/productCreateAndDelete-controller')


//Produtos
router.get("/products/add",controller.getCreate) 
router.post("/products/new", controller.postCreate)
router.get("/products/delete/:id", controller.getDelete) 




module.exports = router