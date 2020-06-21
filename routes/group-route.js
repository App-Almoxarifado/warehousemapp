const express = require("express")
const router = express.Router()
const controller = require('../controllers/group-controller')
const { eAdmin } = require("../helpers/eAdmin")

//Grupos
router.get("/", controller.getIndex)
router.get("/grupos", controller.getList)
router.get("/grupos/add",eAdmin, controller.getCreate) 
router.post("/grupos/novo",eAdmin, controller.postCreate)
router.get('/grupos/edit/:id',eAdmin, controller.getUpdate)
router.post("/grupos/edit",eAdmin, controller.postUpdate) 
router.get("/grupos/deletar/:id",eAdmin, controller.getDelete) 
router.get("/grupos/saibamais/:id", controller.getView) 

//Subgrupos
router.get("/subgrupos", controller.getListSub)
router.get("/subgrupos/add",eAdmin, controller.getCreateSub) 
router.post("/subgrupos/novo",eAdmin, controller.postCreateSub)
router.get('/subgrupos/edit/:id',eAdmin, controller.getUpdateSub)
router.post("/subgrupos/edit",eAdmin, controller.postUpdateSub) 
router.get("/subgrupos/deletar/:id",eAdmin, controller.getDeleteSub) 
router.get("/subgrupos/saibamais/:id", controller.getViewSub) 


module.exports = router