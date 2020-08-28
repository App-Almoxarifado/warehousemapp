module.exports = {
  eDevAdmin: function (req, res, next) {
    if (req.isAuthenticated() && req.user.eDevAdmin == 1) {
      return next();
    }
    req.flash(
      "error_msg",
      "Ops, Você precisa de permissão especial para acessar está área, solicite o desenvolvedor!"
    );
    res.redirect("/usuarios/login");
  },
};
