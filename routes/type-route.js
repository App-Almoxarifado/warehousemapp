const express = require("express")
const router = express.Router()
const controller = require('../controllers/type-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")



router.get('/',eAdmin || eDevAdmin,controller.getList)
router.get('/table',eAdmin || eDevAdmin,controller.getTable)
router.get('/add',eAdmin || eDevAdmin,controller.getCreate)
router.post('/add',eAdmin || eDevAdmin, controller.postCreate)
//router.get('/edit/:id', eAdmin || eDevAdmin, controller.getUpdate)
//router.post('/edit', eAdmin || eDevAdmin, controller.postUpdate)
//router.get("/delete/:id",eAdmin || eDevAdmin, controller.getDelete)


module.exports = router