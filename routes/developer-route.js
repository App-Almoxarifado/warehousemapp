const express = require("express")
const router = express.Router()
const controller = require('../controllers/developer-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")



router.get("/", controller.getIndex)

module.exports = router