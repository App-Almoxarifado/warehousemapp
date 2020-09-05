const express = require("express");
const router = express.Router();
const controller = require("../controllers/type-controller");
const multer = require("multer");
const multerConfig = require("../config/multer");
const { eAdmin } = require("../helpers/eAdmin");


router.get("/", controller.getList);
router.get("/table", controller.getTable);
router.get("/add", controller.getCreate);
router.post("/add", multer(multerConfig).single("file"), controller.postCreate);
router.post("/addItem", controller.postCreateDevAdmin);
router.post("/updateItem", controller.postUpdateDevAdmin);

module.exports = router;
