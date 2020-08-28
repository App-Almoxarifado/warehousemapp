const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");
const { eAdmin } = require("../helpers/eAdmin");
const { eDevAdmin } = require("../helpers/eAdmin");

router.get("/registro", controller.get);
router.post("/registro", controller.getCreate);
router.get("/login", controller.getLogin);
router.post("/login", controller.getStay);
router.get("/logout", controller.getlogout);
//LISTANDO OS USUARIOS CADASTRADOS
router.get("/usersfull", controller.getListFull);
router.get("/users", controller.getList);
router.get("/userstables", controller.getListTable);
router.get("/users/edit/:id", controller.getUpdate);
router.post("/users/edit", controller.postUpdate);
router.get("/users/delete/:id", controller.getDelete);
router.get("/users/take/:id", controller.getView);

module.exports = router;
