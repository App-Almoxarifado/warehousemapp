const express = require("express");
const router = express.Router();
const controller = require("../controllers/search-controller");
const multer = require("multer");
const multerConfig = require("../config/multer");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eDevAdmin");
const { isAuthenticated } = require("../helpers/isAuthenticated");

//PRODUTOS - ROTA CARRINHO DE COMPRAS

router.get("/:_id?",isAuthenticated, controller.search);
router.get("/actives/:tag?/:warehouse?", isAuthenticated,controller.actives);
router.get("/products/:tag?", isAuthenticated,controller.products);

module.exports = router;