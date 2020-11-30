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
const emailTemplates = require("../config/email").emailTemplates;
const fillEmailTemplate = require("../public/js/utils.js").fillEmailTemplate;

//CADASTRANDO USUÁRIO
exports.get = async (req, res) => {
  try {
    const file = req.file
    var warehouses = await Warehouse.find({}).lean();
    var collaborators = await Collaborator.find({}).lean();
    var users = await User.find({}).lean().populate("sites")
    res.render("users/register", { collaborators, warehouses, users, file });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/");
  }
};

//SALVANDO USUÁRIO NO BANCO DE DADOS
exports.getCreate = async (req, res) => {
  var erros = [];
  if (
    !req.body.userName ||
    typeof req.body.userName == undefined ||
    req.body.userName == null
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
    const file = req.file
    let user = await User.findOne({ email: req.body.email, })
    if (user) {
      req.flash(
        "error_msg",
        "Esse email ja possui um cadastro no sistema!"
      );
      res.redirect("/users/register");
    } else {
      try {
        var newUser = new User({
          image: file ? req.file.location : null,
          key: file ? req.file.key : null,
          name: req.body.name,
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          sites: req.body.sites
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              req.flash("error_msg", "Houve um erro durante o salvamento do usuário"); res.redirect("/");
            } else {
              newUser.password = hash;
              newUser.save()
              req.flash("success_msg", "Usuário cadastrado com sucesso!");
              emailService.send([req.body.email,"daniel.albuquerque@andritz.com"],
                "Bem vindo ao Warehouseapp",
                fillEmailTemplate(emailTemplates.WELCOME,{
                  userName: req.body.userName,
                  //number: 12345
                })
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








