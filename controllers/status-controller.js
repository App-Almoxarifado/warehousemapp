const mongoose = require("mongoose");
const qr = require("qr-image");
require("../models/Status");
const Status = mongoose.model("status");

//LISTANDO OS FORNECEDORES POR LISTA
exports.getList = async (req, res) => {
  try {
    var status = await Status.find({ active: true }).sort({
      description: "asc",
    });
    res.render("status/status", {
      status: status.map((status) => status.toJSON()),
    });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/status/status");
  }
};

//QRCODE
exports.getQrcode = (req, res) => {
  var url = "https://warehousemapp.herokuapp.com/";
  const code = qr.image(url, { type: "svg" });
  res.type("svg");
  code.pipe(res);
};
