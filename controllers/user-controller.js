const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport")
    // Incluindo model Usuario
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
require("../models/Collaborator");
const Collaborator = mongoose.model("collaborators");

//SERVIÇO DE EMAIL
const emailService = require('../services/email-service');

//CADASTRANDO USUÁRIO
exports.get = async(req, res) => {
    try {
        var collaborators = await Collaborator.find({}).lean()
        res.render("usuarios/registro", { collaborators: collaborators });
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/")
    }
}



//SALVANDO USUÁRIO NO BANCO DE DADOS
exports.getCreate = (req, res) => {
    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            texto: "Nome inválido!"
        });
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({
            texto: "Email inválido!"
        });
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({
            texto: "Senha inválida!"
        });
    }
    if (req.body.senha.length < 4) {
        erros.push({
            texto: "Senha muito curta!"
        });
    }
    if (req.body.senha != req.body.senha2) {
        erros.push({
            texto: "As senhas são diferentes, tente novamente!"
        });
    }

    if (erros.length > 0) {
        res.render("usuarios/registro", {
            erros: erros
        });
    } else {
        Usuario.findOne({
            email: req.body.email
        }).then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Esse email ja possui um cadastro no sistema!");
                res.redirect("/usuarios/registro");
            } else {
                var novoUsuario = new Usuario({
                    name: req.body.name,
                    image: req.body.image, //.slice(0, -1),
                    nome: req.body.nome,
                    email: req.body.email,
                    eadmin: req.body.eadmin,
                    senha: req.body.senha,
                    date: req.body.date
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if (err) {
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuário");
                            res.redirect("/");
                        } else {
                            novoUsuario.senha = hash;
                            novoUsuario.save().then(() => {
                                req.flash("success_msg", "Usuário cadastrado com sucesso!");
                                emailService.send(
                                    req.body.email,
                                    'Bem vindo ao Warehouseapp',
                                    global.EMAIL_TMPL.replace('{0}', req.body.nome));
                                res.redirect("/");
                            }).catch((err) => {
                                req.flash("error_msg", "Houve um erro na criação do usuário" + err);
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
}

//ROTA DE LOGIN
exports.getLogin = (req, res) => {
    res.render("usuarios/login")
}

//FAZENDO O LOGIN
exports.getStay = (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)


}

//ROTA DE LOGOUT
exports.getlogout = (req, res) => {
    req.logout()
    req.flash('success_msg', "Deslogado com sucesso!")
    res.redirect("/")
}

//LISTANDO USUÁRIOS CADASTRADOS - LISTA
exports.getListFull = async(req, res) => {
    try {
        var usuarios = await Usuario.find({})
        res.render("usuarios/usersfull", {
            usuarios: usuarios.map(usuarios => usuarios.toJSON())
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/usuarios/registro")
    }
}


//LISTANDO USUÁRIOS CADASTRADOS - LISTA
exports.getList = async(req, res) => {
    try {
        var usuarios = await Usuario.find({
            active: true
        })
        res.render("usuarios/users", {
            usuarios: usuarios.map(usuarios => usuarios.toJSON())
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/usuarios/registro")
    }
}

//LISTANDO USUÁRIOS CADASTRADOS - TABELA
exports.getListTable = async(req, res) => {
    try {
        var usuarios = await Usuario.find({
            active: true
        })
        res.render("usuarios/userstables", {
            usuarios: usuarios.map(usuarios => usuarios.toJSON())
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/usuarios/registro")
    }
}

//EDITANDO UM USUÁRIO
exports.getUpdate = async(req, res) => {
    var usuario = await Usuario.findOne({
        _id: req.params.id
    }).lean()
    try {
        res.render("usuarios/editusers", {
            usuario: usuario
        })
    } catch (_err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/usuarios")
    }
}


exports.postUpdate = async(req, res) => {
    var usuario = await Usuario.findOne({
        _id: req.body.id
    })

    /*var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ Message: "Nome inválido!" });
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ Message: "Email inválido!" });
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ Message: "Senha inválida!" });
    }
    if (req.body.senha.length < 4) {
        erros.push({ Message: "Senha muito curta!" });
    }
    if (req.body.senha != req.body.senha2) {
        erros.push({ Message: "As senhas são diferentes, tente novamente!" });
    }

    if (erros.length > 0) {
        res.render("usuarios/editusers", { erros: erros });
    } else {*/
    try {

        usuario.name = req.body.name
        usuario.image = req.body.image //.slice(0, -1)
            //usuario.email = req.body.email
        usuario.nome = req.body.nome
            //usuario.senha = req.body.senha
        usuario.eAdmin = req.body.eAdmin
        usuario.date = req.body.date
        usuario.active = req.body.active

        await usuario.save()
        req.flash("success_msg", "Usuário editado com Sucesso!")
        res.redirect("/usuarios/users")
        console.log("Usuário editado com sucesso!")
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno ao editar o Usuario, tente Novamente!" + err)
        res.redirect("/usuarios/users")
    }
}


//DELETANDO UM USUÁRIO
//DELETANDO UM GRUPO
exports.getDelete = async(req, res) => {
    await Usuario.remove({
        _id: req.params.id
    })
    try {
        req.flash("success_msg", "Usuario deletado com Sucesso!")
        res.redirect("/usuarios/users")
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/usuarios/users")
    }
}

exports.getView = async(req, res) => {
    try {
        const usuario = await Usuario.findOne({
            _id: req.params.id
        }).lean()
        res.render("usuarios/takeusers", {
            usuario: usuario
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Erro ao Conectar com o Banco de Dados!")
        res.redirect("/usuarios/users")
    }
}