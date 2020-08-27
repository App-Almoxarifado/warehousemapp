const express = require("express")
const router = express.Router()
const controller = require('../controllers/type-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")



router.get('/',eDevAdmin,controller.getList)
router.get('/table',eAdmin || eDevAdmin,controller.getTable)
router.get('/add',eAdmin || eDevAdmin,controller.getCreate)
router.post('/add',eAdmin || eDevAdmin, controller.postCreate)
router.post("/addItem", eDevAdmin,controller.postCreateDevAdmin)
router.post("/updateItem",eDevAdmin, controller.postUpdateDevAdmin)



module.exports = router