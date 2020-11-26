const express = require("express");
const router = express.Router();
const controller = require("../controllers/search-controller");
const multer = require("multer");
const multerConfig = require("../config/multer");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eDevAdmin");

//PRODUTOS - ROTA CARRINHO DE COMPRAS

router.get("/:_id?", controller.search);
router.get("/actives/:tag?", controller.actives);
router.get("/products/:tag?", controller.products);

module.exports = router;