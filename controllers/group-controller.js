const mongoose = require("mongoose")
require("../models/Grupo")
const Grupo = mongoose.model("grupos")
require("../models/Subgrupo")
const Subgrupo = mongoose.model("subgrupos")
const repository = require('../repositories/group-repository')


//index Grupos
exports.getIndex = async (req, res) => {
    var grupos = await Grupo.find({})
    try {
    res.render("group/index")
} catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!")
    res.redirect("/group/grupos", {grupos:grupos.map(grupos => grupos.toJSON())})
}
}


//Listando Grupos
exports.getList = async (req, res) => {
    try {
        // no repositoryvar grupos = await repository.get();
        var grupos = await Grupo.find({})
        res.render("group/grupos", {grupos:grupos.map(grupos => grupos.toJSON())})
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group/grupos")
    }
}

//Criando um Grupo
exports.getCreate = async (req, res) => {
    try {
        res.render("group/addgrupos")
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group/grupos")
    }
}

exports.postCreate = async (req, res) => {
    let endImg = "http://localhost:3000/uploads/"
    var erros = []
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.descricao.length < 2) {
        erros.push({
            texto: "Descrição do Grupo Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("group/addgrupos", {
            erros: erros
        })
    } else {
        try {      
        const grupos = new Grupo({
            qrcode: req.body.qrcode,
            imagem: endImg + req.body.imagem.slice(0, -1),
            descricao: req.body.descricao,
            data: req.body.data
        })
            await grupos.save()
            req.flash("success_msg", "Grupo criado com sucesso!")
            res.redirect("/group/grupos")
            console.log("Grupo criado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o grupo, tente novamente!")
            res.redirect("/group/grupos")
        }
    }
}

//Editando um Grupo
exports.getUpdate = async (req, res) => {
    var grupo = await Grupo.findOne({ _id: req.params.id}).lean()
    try {
        res.render("group/editgrupos", { grupo: grupo})
    } catch (_err) {
        req.flash ("error_msg", "Ops, Erro ao Conectar com o GoogleSheets!")
        res.redirect("/group")
    }
}


exports.postUpdate = async (req, res) => {
    var grupo = await Grupo.findOne({ _id: req.body.id})
    let endImg = "http://localhost:3000/uploads/"
    var erros = []
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.descricao.length < 2) {
        erros.push({
            texto: "Descrição do Grupo Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("group/editgrupos", {
            erros: erros
        })
    } else {
        try {      

            grupo.qrcode = req.body.qrcode
            grupo.imagem = endImg + req.body.imagem.slice(0, -1)
            grupo.descricao = req.body.descricao
            grupo.data = req.body.data
        
            await grupo.save()
            req.flash("success_msg", "Grupo editado com Sucesso!")
            res.redirect("/group/grupos")
            console.log("Grupo editado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Houve um erro interno ao editar o Grupo, tente Novamente!" + err)
            res.redirect("/group/grupos")
        }
    }
}

//Deletando um grupo
exports.getDelete = async(req, res) => {
    await Grupo.remove({_id: req.params.id})
    try {
        req.flash("success_msg", "Grupo deletado com Sucesso!")
        res.redirect("/group/grupos")
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/group/grupos")
    }
}

//Saibamais Grupos
exports.getView = async (req, res) => {  
    try {
    const grupo = await Grupo.findOne({ _id: req.params.id}).lean()
    res.render("group/saibamaisgrupos", {grupo: grupo})
    } catch (err) {
        req.flash ("error_msg", "Ops, Erro ao Conectar com o Banco de Dados!")
        res.redirect("/group")
    }
}