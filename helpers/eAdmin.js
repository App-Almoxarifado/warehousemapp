module.exports = {
  eAdmin: function (req, res, next) {
    if (req.isAuthenticated() && req.user.eAdmin == true) {
      return next();
    }
    req.flash(
      "error_msg",
      "Ops, Você precisa de permissão especial para acessar está área, solicite o Administrador do App!"
    );
    res.redirect("/usuarios/login");
  }
};
