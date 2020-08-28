const mongoose = require("mongoose");
const qr = require("qr-image");
require("../models/Unity");
const Unity = mongoose.model("units");

//LISTANDO OS FORNECEDORES POR LISTA
exports.getList = async (req, res) => {
  try {
    var units = await Unity.find({ active: true }).sort({ description: "asc" });
    res.render("units/units", { units: units.map((units) => units.toJSON()) });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/units/units");
  }
};

//QRCODE
exports.getQrcode = (req, res) => {
  var url = "https://warehousemapp.herokuapp.com/";
  const code = qr.image(url, { type: "svg" });
  res.type("svg");
  code.pipe(res);
};
