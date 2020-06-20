const express = require("express")
const router = express.Router()
const controller = require('../controllers/group-controller')


router.get("/", controller.getIndex)
router.get("/grupos", controller.getList)
router.get("/grupos/add", controller.getCreate) 
router.post("/grupos/novo", controller.postCreate)
router.get('/grupos/edit/:id', controller.getUpdate)
router.post("/grupos/edit", controller.postUpdate) 
router.get("/grupos/deletar/:id", controller.getDelete) 
router.get("/grupos/saibamais/:id", controller.getView) 



module.exports = router