const express = require("express")
const router = express.Router()
const controller = require('../controllers/group-controller')
const { eAdmin } = require("../helpers/eAdmin")

//groups
router.get("/", controller.getIndex)
router.get("/groups", controller.getList)
router.get("/groups/add",eAdmin, controller.getCreate) 
router.post("/groups/novo",eAdmin, controller.postCreate)
router.get('/groups/edit/:id',eAdmin, controller.getUpdate)
router.post("/groups/edit",eAdmin, controller.postUpdate) 
router.get("/groups/deletar/:id",eAdmin, controller.getDelete) 
router.get("/groups/saibamais/:id", controller.getView) 
router.get("/qrcode", controller.getQrcode) 

//Subgroups
router.get("/subgroups", controller.getListSub)
router.get("/subgroupstables", controller.getListSubTable)
router.get("/subgroups/add",eAdmin, controller.getCreateSub) 
router.post("/subgroups/novo",eAdmin, controller.postCreateSub)
router.get('/subgroups/edit/:id',eAdmin, controller.getUpdateSub)
router.post("/subgroups/edit",eAdmin, controller.postUpdateSub) 
router.get("/subgroups/deletar/:id",eAdmin, controller.getDeleteSub) 
router.get("/subgroups/take/:id", controller.getViewSub) 
router.post('/subgroups/take',eAdmin, controller.postUpdateViewSub)
router.post("/subgroups/new",eAdmin, controller.postCreateViewSub)


module.exports = router