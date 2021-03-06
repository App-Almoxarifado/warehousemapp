const express = require("express");
const router = express.Router();
const controller = require("../controllers/planning-controller");
const multer = require("multer");
const multerConfig = require("../config/multer");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eDevAdmin");
const { isAuthenticated } = require("../helpers/isAuthenticated");

//PRODUTOS - ROTA CARRINHO DE COMPRAS
router.get("/dashboard/:_id?", controller.dashboard);
router.get("/sites/:_id?", controller.sites);
router.get("/:_id?", isAuthenticated,controller.planning);
router.post("/planning", controller.postPlanning);
router.get("/search/:_id?", controller.search);
router.get("/request/:_id?", controller.getRequest);
router.post("/request/:id",controller.requestFromWarehouse);
router.get("/updateRequest/:_id", eAdmin, controller.getUpdate);
router.get("/products/:_id?", controller.products);
router.post("/updateRequest", eAdmin, multer(multerConfig).single("file"), controller.postUpdate);
router.get("/delete/:_id/:warehouse", eAdmin, controller.getDelete);
router.post("/checkOut/:id", controller.checkOut);

module.exports = router;