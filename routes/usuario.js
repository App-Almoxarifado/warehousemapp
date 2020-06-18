const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const passport = require("passport")

//INCLUINDO MODEL DE USUÁRIO
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    let endImg = "https://warehousecentralapp.herokuapp.com/uploads/"
    var erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            texto: "Nome Inválido"
        })
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({
            texto: "Email Inválido"
        })
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({
            texto: "Senha Inválida"
        })
    }
    if (req.body.nome.length < 2) {
        erros.push({
            texto: "Descrição do Nome Muito Pequeno!"
        })
    }
    if (req.body.senha.length < 4) {
        erros.push({
            texto: "Senha Muita Curta, Mínimo 8 Caracters!"
        })
    }
    if (req.body.senha != req.body.senha2) {
        erros.push({
            texto: "As senhas são diferentes tente novamente!"
        })
    }

    if (erros.length > 0) {
        res.render("usuarios/registro", {
            erros: erros
        })
    } else {
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Esse email ja possui um cadastro no sistema!");
                res.redirect("/usuarios/registro");
            } else {
                var novoUsuario = new Usuario({
                    qrcode: req.body.qrcode,
                    imagem: endImg + req.body.imagem.slice(0, -1),
                    nome: req.body.nome,
                    email: req.body.email,
                    eadmin: req.body.eadmin,
                    senha: req.body.senha,
                    data: req.body.data
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if (err) {
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuário");
                            res.redirect("/");
                        } else {
                            novoUsuario.senha = hash;
                            novoUsuario.save().then(() => {
                                req.flash("success_msg", "Usuário cadastrado com sucesso!");
                                res.redirect("/");
                            }).catch(() => {
                                req.flash("error_msg", "Houve um erro na criação do usuário");
                                res.redirect("/usuarios/registro");
                            });
                        }
                    });
                });
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno");
            res.redirect("/");
        });
    }
});


router.post("/login", (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)


})

router.get("/logout", (req, res) => {
    req.logout()
    req.flash('success_msg', "Deslogado com sucesso!")
    res.redirect("/")
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

module.exports = router