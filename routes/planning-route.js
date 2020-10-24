const express = require("express");
const router = express.Router();
const controller = require("../controllers/planning-controller");
const multer = require("multer");
const multerConfig = require("../config/multer");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eDevAdmin");

//PRODUTOS - ROTA CARRINHO DE COMPRAS
router.get("/",eAdmin, controller.dashboard);
router.get("/products/:_id?", controller.request);
router.post("/request", controller.postRequest);
router.get("/request", controller.getRequest);
router.get("/updateRequest/:id", eAdmin, controller.getUpdate);
router.post("/updateRequest", eAdmin, multer(multerConfig).single("file"), controller.postUpdate);
router.post("/planning", controller.postPlanning);
router.get("/transfer", controller.getTransfer);


module.exports = router;