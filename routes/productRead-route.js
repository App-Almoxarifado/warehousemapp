const express = require("express")
const router = express.Router()
const controller = require('../controllers/productRead-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")


//Produtos
router.get("/products", controller.getList)
router.get("/productstables", controller.getListTable)




module.exports = router