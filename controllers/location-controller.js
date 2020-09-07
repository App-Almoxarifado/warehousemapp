const mongoose = require("mongoose");
const qr = require("qr-image");
require("../models/Location");
const Location = mongoose.model("leases");

//LISTANDO OS FORNECEDORES POR LISTA
exports.getList = async (req, res) => {
  try {
    var leases = await Location.find({ active: true }).sort({
      description: "asc",
    });
    res.render("leases/leases", {
      leases: leases.map((leases) => leases.toJSON()),
    });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/leases/leases");
  }
};

//QRCODE
exports.getQrcode = (req, res) => {
  var url = "https://warehousemapp.herokuapp.com/";
  const code = qr.image(url, { type: "svg" });
  res.type("svg");
  code.pipe(res);
};
