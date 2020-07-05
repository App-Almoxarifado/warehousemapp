const express = require("express")
const router = express.Router()
const controller = require('../controllers/type-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")



router.get("/types",controller.getList)




module.exports = router