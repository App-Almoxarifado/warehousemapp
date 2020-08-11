const express = require("express")
const router = express.Router()
const controller = require('../controllers/productRequest-controller')


//Produtos

router.get("/products/take/:id", controller.getCreateRequest) 
router.post("/products/newRequest", controller.postCreateRequest)





module.exports = router