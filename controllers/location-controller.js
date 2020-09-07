const mongoose = require("mongoose");
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


