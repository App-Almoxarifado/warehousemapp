const express = require("express")
const router = express.Router()
const controller = require('../controllers/collaborator-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")

router.get("/collaborators",controller.getList)




module.exports = router