const express = require("express")
const router = express.Router()
const controller = require('../controllers/product-controller')
const { eAdmin } = require("../helpers/eAdmin")

//Produtos

router.get("/products", controller.getList)
router.get("/productstables", controller.getListTable)
router.get("/products/add",controller.getCreate) 
router.post("/products/new", controller.postCreate)
router.get("/products/add_id/:id",controller.getCreateId) 
router.post("/products/add_id", controller.postCreateId)
router.get('/products/edit/:id', controller.getUpdate)
router.post("/products/edit", controller.postUpdate) 
router.get("/products/delete/:id", controller.getDelete) 
//router.get("/products/saibamais/:id", controller.getView) 


module.exports = router