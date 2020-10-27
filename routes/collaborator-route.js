const express = require("express");
const router = express.Router();
const controller = require("../controllers/collaborator-controller");
const multer = require("multer");
const multerConfig = require("../config/multer");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eDevAdmin");


router.get("/", eAdmin, controller.getList);
router.get("/table", eAdmin, controller.getTable);
router.get("/create", controller.getCreate);
router.post("/create", eAdmin, multer(multerConfig).single("file"), controller.postCreate);
router.get("/update/:_id", eAdmin, controller.getUpdate);
router.post("/update", eAdmin, multer(multerConfig).single("file"), controller.postUpdate);
router.get("/delete/:_id", eAdmin, controller.getDelete);


module.exports = router;