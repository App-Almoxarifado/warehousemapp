const express = require("express")
const router = express.Router()
const controller = require('../controllers/productCreateId-controller')


//Produtos

router.get("/products/add_id/:id",controller.getCreateId) 
router.post("/products/add_id", controller.postCreateId)



module.exports = router