const CepCoords = require("coordenadas-do-cep");

exports.getIndex = async (req, res) => {
  try {
    const info = await CepCoords.getByCep("14806500");
    console.log(info)
    res.render("developers/cep", {info});
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/");
  }
};
