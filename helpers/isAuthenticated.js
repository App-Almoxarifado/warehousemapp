module.exports = {
    isAuthenticated: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash(
        "error_msg",
        "Ops, Você precisa logar, ou criar um usuário para acessar esta rota!"
      );
      res.redirect("/users/login");
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
  
  