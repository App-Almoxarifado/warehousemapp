const express = require("express")
const router = express.Router()
const controller = require('../controllers/productUpdate-controller')


//Produtos
router.get('/products/edit/:id', controller.getUpdate)
router.post("/products/edit", controller.postUpdate) 




module.exports = router