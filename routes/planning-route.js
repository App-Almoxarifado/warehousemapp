const express = require("express");
const router = express.Router();
const controller = require("../controllers/planning-controller");
const multer = require("multer");
const multerConfig = require("../config/multer");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eDevAdmin");

//PRODUTOS - ROTA CARRINHO DE COMPRAS
router.get("/dashboard", controller.dashboard);
router.get("/sites/:_id?", controller.sites);
router.get("/:_id?", controller.planning);
router.post("/planning", controller.postPlanning);
router.get("/request/:_id?", controller.getRequest);
router.get("/updateRequest/:_id", eAdmin, controller.getUpdate);
router.get("/products/:_id?", controller.products);
router.post("/updateRequest", eAdmin, multer(multerConfig).single("file"), controller.postUpdate);
router.get("/delete/:_id", eAdmin, controller.getDelete);
//router.post("/planning", controller.postPlanning);
//router.get("/transfer", controller.getTransfer);

module.exports = router;