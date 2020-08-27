const express = require("express")
const router = express.Router()
const controller = require('../controllers/type-controller')
const {eAdmin} = require("../helpers/eAdmin")
const {eDevAdmin} = require("../helpers/eDevAdmin")

router.get('/',eAdmin || eDevAdmin,controller.getList)
router.get('/table',eAdmin || eDevAdmin,controller.getTable)
router.get('/add',eAdmin || eDevAdmin,controller.getCreate)
router.post('/add',eAdmin || eDevAdmin, controller.postCreate)
router.post("/addItem",eAdmin,controller.postCreateDevAdmin)
router.post("/updateItem",eAdmin, controller.postUpdateDevAdmin)



module.exports = router