const express = require("express")
const router = express.Router()
const controller = require('../controllers/group-controller')

//Grupos
router.get("/", controller.getIndex)
router.get("/grupos", controller.getList)
router.get("/grupos/add", controller.getCreate) 
router.post("/grupos/novo", controller.postCreate)
router.get('/grupos/edit/:id', controller.getUpdate)
router.post("/grupos/edit", controller.postUpdate) 
router.get("/grupos/deletar/:id", controller.getDelete) 
router.get("/grupos/saibamais/:id", controller.getView) 

//Subgrupos
router.get("/subgrupos", controller.getListSub)
router.get("/subgrupos/add", controller.getCreateSub) 
router.post("/subgrupos/novo", controller.postCreateSub)
router.get('/subgrupos/edit/:id', controller.getUpdateSub)
router.post("/subgrupos/edit", controller.postUpdateSub) 
router.get("/subgrupos/deletar/:id", controller.getDeleteSub) 
router.get("/subgrupos/saibamais/:id", controller.getViewSub) 


module.exports = router