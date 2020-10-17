const express = require("express");
const router = express.Router();
const controller = require("../controllers/item-controller");
const multer = require("multer");
const multerConfig = require("../config/multer");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eDevAdmin");


router.get("/", eAdmin, controller.getList);
router.get("/table", eAdmin, controller.getTable);
router.get("/add", controller.getCreate);
router.post("/add", eAdmin, multer(multerConfig).single("file"), controller.postCreate);
router.get("/edit/:id", eAdmin, controller.getUpdate);
router.post("/edit", eAdmin, multer(multerConfig).single("file"), controller.postUpdate);
router.get("/add_id/:id", eAdmin, controller.getCreateId);
router.post("/add_id", eAdmin, multer(multerConfig).single("file"), controller.postCreateId);
router.get("/delete/:id", eDevAdmin, controller.getDelete);


module.exports = router;