const mongoose = require("mongoose");
require("../models/LocationArea");
const LocationArea = mongoose.model("rentalareas");

//LISTANDO OS FORNECEDORES POR LISTA
exports.getList = async (req, res) => {
  try {
    var rentalareas = await LocationArea.find({ active: true }).sort({
      description: "asc",
    });
    res.render("rentalareas/rentalareas", {
        rentalareas: rentalareas.map((rentalareas) => rentalareas.toJSON()),
    });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/rentalareas/rentalareas");
  }
};


