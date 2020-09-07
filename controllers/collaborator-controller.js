const mongoose = require("mongoose");
const qr = require("qr-image");
require("../models/Collaborator");
const Collaborator = mongoose.model("collaborators");


//LISTANDO OS FORNECEDORES POR LISTA
exports.getList = async (req, res) => {
  try {
    var collaborators = await Collaborator.find({ active: true })
      .sort({ name: "asc" })
      .populate("contractor")
      .lean();
    res.render("collaborators/collaborators", { collaborators: collaborators });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/collaborators/collaborators");
  }
};

//QRCODE
exports.getQrcode = (req, res) => {
  var url = "https://warehousemapp.herokuapp.com/";
  const code = qr.image(url, { type: "svg" });
  res.type("svg");
  code.pipe(res);
};
