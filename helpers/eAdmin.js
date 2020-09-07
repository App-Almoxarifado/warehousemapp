module.exports = {
  eAdmin: function (req, res, next) {
    if (req.isAuthenticated() && req.user.eAdmin == 1) {
      return next();
    }
    req.flash(
      "error_msg",
      "Ops, Você precisa de permissão especial para acessar está área, solicite o Administrador do App!"
    );
    res.redirect("/usuarios/login");
  },
    /*eDevAdmin: function (req, res, next) {
    if (req.isAuthenticated() && req.user.eAdmin == 2) {
      return next();
    }
    req.flash(
      "error_msg",
      "Ops, Você precisa de permissão especial para acessar está área, solicite o desenvolvedor!"
    );
    res.redirect("/usuarios/login");
  },*/
};

