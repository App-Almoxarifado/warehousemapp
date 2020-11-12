const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Incluindo model User
require("../models/User");
const User = mongoose.model("users");
require("../models/Collaborator");
const Collaborator = mongoose.model("collaborators");
require("../models/Warehouse");
const Warehouse = mongoose.model("warehouses");
//SERVIÇO DE EMAIL
const emailService = require("../services/email-service");

//CADASTRANDO USUÁRIO
exports.get = async (req, res) => {
  try {
    var warehouses = await Warehouse.find({}).lean();
    var collaborators = await Collaborator.find({}).lean();
    var users = await User.find({}).lean().populate("sites")
    res.render("users/register", { collaborators, warehouses, users });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/");
  }
};

//SALVANDO USUÁRIO NO BANCO DE DADOS
exports.getCreate = async (req, res) => {
  var erros = [];
  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({
      texto: "Nome inválido!",
    });
  }
  if (
    !req.body.email ||
    typeof req.body.email == undefined ||
    req.body.email == null
  ) {
    erros.push({
      texto: "Email inválido!",
    });
  }
  if (
    !req.body.password ||
    typeof req.body.password == undefined ||
    req.body.password == null
  ) {
    erros.push({
      texto: "Senha inválida!",
    });
  }
  if (req.body.password.length < 4) {
    erros.push({
      texto: "Senha muito curta!",
    });
  }
  if (req.body.password != req.body.password2) {
    erros.push({
      texto: "As senhas são diferentes, tente novamente!",
    });
  }

  if (erros.length > 0) {
    res.render("users/register", {
      erros: erros,
    });
  } else {
    let user = await User.findOne({ email: req.body.email,})
    if (user) {
      req.flash(
        "error_msg",
        "Esse email ja possui um cadastro no sistema!"
      );
      res.redirect("/users/register");
    } else {
      try {
        var novoUser = new User({
          name: req.body.name,
          image: req.body.image, //.slice(0, -1),
          nome: req.body.nome,
          email: req.body.email,
          eadmin: req.body.eadmin,
          sites: [
            req.body.sites
          ],
          password: req.body.password,
          date: req.body.date,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(novoUser.password, salt, (err, hash) => {
            if (err) {
              req.flash("error_msg", "Houve um erro durante o salvamento do usuário"); res.redirect("/");
            } else {
              novoUser.password = hash;
              novoUser.save()
              req.flash("success_msg", "Usuário cadastrado com sucesso!");
              emailService.send(req.body.email,
                "Bem vindo ao Warehouseapp",
                global.EMAIL_TMPL.replace("{0}", req.body.nome)
              );
              res.redirect("/");
            }
          });
        });
      } catch (err) {
        req.flash(
          "error_msg",
          "Ops, Houve um erro ao salvar o usuário, tente novamente!"
        );
        res.redirect("/");
      }
    }
  }
};

//ROTA DE LOGIN
exports.getLogin = (req, res) => {
  res.render("users/login");
};

//FAZENDO O LOGIN
exports.getStay = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
};

//ROTA DE LOGOUT
exports.getlogout = (req, res) => {
  req.logout();
  req.flash("success_msg", "Deslogado com sucesso!");
  res.redirect("/");
};








