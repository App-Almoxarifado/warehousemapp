const mongoose = require("mongoose");
const qr = require("qr-image");
require("../models/Sublease");
const Sublease = mongoose.model("subleases");

//LISTANDO OS FORNECEDORES POR LISTA
exports.getList = async (req, res) => {
  try {
    var subleases = await Sublease.find({ active: true }).sort({
      description: "asc",
    });
    res.render("subleases/subleases", {
      subleases: subleases.map((subleases) => subleases.toJSON()),
    });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/subleases/subleases");
  }
};

//QRCODE
exports.getQrcode = (req, res) => {
  var url = "https://warehousemapp.herokuapp.com/";
  const code = qr.image(url, { type: "svg" });
  res.type("svg");
  code.pipe(res);
};
