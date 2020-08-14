const express = require("express")
const router = express.Router()
const controller = require('../controllers/client-controller')
const { eAdmin } = require("../helpers/eAdmin")
const { eDevAdmin } = require("../helpers/eAdmin")

router.get("/customers",controller.getList)

module.exports = router