const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("../models/User");
const User = mongoose.model("users");

module.exports = function (passport) {

  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        let user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "Esta conta não existe" });
        }

        bcrypt.compare(password, user.password, (erro, batem) => {
          if (batem) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Senha incorreta!" });
          }
        });
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    let user;
    try {
      user = await User.findById(id).populate("sites", "_id description").lean();
      done(false, user);
    }
    catch (e) {
      done(e, user);
    }
  });


};
