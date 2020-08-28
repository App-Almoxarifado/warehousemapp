exports.getIndex = async (req, res) => {
  try {
    res.render("developers/developers");
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/");
  }
};
