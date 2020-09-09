const express = require("express");
const router = express.Router();
const controller = require("../controllers/productCreateId-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

//PRODUTOS - CRIAR PRODUTO PELO ID
router.get("/add_id/:id",  controller.getCreateId);
router.post("/add_id",  controller.postCreateId);

module.exports = router;
