const express = require("express")
const router = express.Router()
const controller = require('../controllers/productMovement-controller')


//Produtos
router.get("/products/move/:id", controller.getCreateMove) 
router.post("/products/newmove", controller.postCreateMove)




module.exports = router