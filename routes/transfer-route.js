const express = require("express")
const router = express.Router()
const controller = require('../controllers/transfer-controller')

router.get("/trans", controller.getTransfer)
router.post("/transfer", controller.createTransfer)
router.post("/editTransfer", controller.editTransfer)

module.exports = router;