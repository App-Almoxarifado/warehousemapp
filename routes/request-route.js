const express = require("express");
const router = express.Router();
const controller = require("../controllers/request-controller");
const multer = require("multer");
const multerConfig = require("../config/multer");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eDevAdmin");

//PRODUTOS - ROTA CARRINHO DE COMPRAS

router.get("/products/:_id?", controller.products);


module.exports = router;