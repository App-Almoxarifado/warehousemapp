const express = require("express");
const router = express.Router();
const controller = require("../controllers/productMovement-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

//PRODUTOS - MOVIMENTAÇÃO INTERNA
router.get("/move/:id", eAdmin || eDevAdmin, controller.getCreateMove);
router.post("/newmove", eAdmin || eDevAdmin, controller.postCreateMove);

module.exports = router;
