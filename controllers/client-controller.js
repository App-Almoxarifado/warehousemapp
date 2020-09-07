const mongoose = require("mongoose");
const qr = require("qr-image");
require("../models/Client");
const Client = mongoose.model("customers");

//LISTANDO OS FORNECEDORES POR LISTA
exports.getList = async (req, res) => {
  try {
    var customers = await Client.find({ active: true }).sort({
      description: "asc",
    });
    res.render("customers/customers", {
      customers: customers.map((customers) => customers.toJSON()),
    });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/customers/customers");
  }
};

//QRCODE
exports.getQrcode = (req, res) => {
  var url = "https://warehousemapp.herokuapp.com/";
  const code = qr.image(url, { type: "svg" });
  res.type("svg");
  code.pipe(res);
};
