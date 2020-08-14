const express = require("express")
const router = express.Router()
const controller = require('../controllers/group-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")

//groups
router.get("/", controller.getIndex)
router.get("/groups",controller.getList)
router.get("/groupstables", controller.getListTable)
router.get("/groups/add",eAdmin || eDevAdmin, controller.getCreate) 
router.post("/groups/novo",eAdmin || eDevAdmin, controller.postCreate)
router.get('/groups/edit/:id',eAdmin || eDevAdmin, controller.getUpdate)
router.post("/groups/edit",eAdmin || eDevAdmin, controller.postUpdate) 
router.get("/groups/deletar/:id",eAdmin || eDevAdmin, controller.getDelete) 
router.get("/groups/take/:id", controller.getView)
router.post('/groups/take', controller.postUpdateView)
router.post("/groups/new", controller.postCreateView) 
router.get("/qrcode", controller.getQrcode) 

//Subgroups
router.get("/subgroups", controller.getListSub)
router.get("/subgroupstables", controller.getListSubTable)
router.get("/subgroups/add",eAdmin || eDevAdmin, controller.getCreateSub) 
router.post("/subgroups/novo",eAdmin || eDevAdmin, controller.postCreateSub)
router.get('/subgroups/edit/:id',eAdmin || eDevAdmin, controller.getUpdateSub)
router.post("/subgroups/edit",eAdmin || eDevAdmin, controller.postUpdateSub) 
router.get("/subgroups/deletar/:id",eAdmin || eDevAdmin, controller.getDeleteSub) 
router.get("/subgroups/take/:id", controller.getViewSub) 
router.post('/subgroups/take', controller.postUpdateViewSub)
router.post("/subgroups/new", controller.postCreateViewSub)

module.exports = router