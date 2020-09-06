const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

module.exports = function (passport) {
  passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
  });

  passport.deserializeUser(async (id, done) => {
    let usuario;
    try {
      usuario = await Usuario.findById(id).populate("sites", "_id description").lean();
      done(false, usuario);
    }
    catch (e) {
      done(e, usuario);
    }
  });

  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "senha" },
      async (email, senha, done) => {
        let usuario = await Usuario.findOne({ email: email });
        if (!usuario) {
          return done(null, false, { message: "Esta conta não existe" });
        }

        bcrypt.compare(senha, usuario.senha, (erro, batem) => {
          if (batem) {
            return done(null, usuario);
          } else {
            return done(null, false, { message: "Senha incorreta!" });
          }
        });
      }
    )
  );
};
