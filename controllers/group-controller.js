const mongoose = require("mongoose")
require("../models/Grupo")
const Grupo = mongoose.model("grupos")
require("../models/Subgrupo")
const Subgrupo = mongoose.model("subgrupos")
//const repository = require('../repositories/group-repository')


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
    let endImg = "https://warehousemapp.herokuapp.com/uploads/"
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
    let endImg = "https://warehousemapp.herokuapp.com/uploads/"
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
            grupo.imagem = endImg + req.body.imagem//.slice(0, -1)
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


//Listando Subgrupos
exports.getListSub = async (req, res) => {
    try {
        // no repositoryvar grupos = await repository.get();
        var subgrupos = await Subgrupo.find({}).populate("grupo")
        res.render("group/subgrupos", {subgrupos:subgrupos.map(subgrupos => subgrupos.toJSON())})
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group/subgrupos")
    }
}

//Criando um Subgrupo
exports.getCreateSub = async (req, res) => {
    try {
        var grupos = await Grupo.find({})
        res.render("group/addsubgrupos", {grupos:grupos.map(grupos => grupos.toJSON())})
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group/subgrupos")
    }
}

exports.postCreateSub = async (req, res) => {
    let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.descricao.length < 2) {
        erros.push({
            texto: "Descrição do Subgrupo Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("group/addsubgrupos", {
            erros: erros
        })
    } else {
        try {      
        const subgrupos = new Subgrupo({
            qrcode: req.body.qrcode,
            imagem: endImg + req.body.imagem.slice(0, -1),
            grupo: req.body.grupo,
            descricao: req.body.descricao,
            data: req.body.data
        })
            await subgrupos.save()
            req.flash("success_msg", "Subgrupo criado com sucesso!")
            res.redirect("/group/subgrupos")
            console.log("Subgrupo criado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o Subgrupo, tente novamente!")
            res.redirect("/group/subgrupos")
        }
    }
}

//Editando um Subgrupo
exports.getUpdateSub = async (req, res) => {
    var subgrupo = await Subgrupo.findOne({ _id: req.params.id}).lean()
    try {
        var grupos = await Grupo.find({}).lean()
        res.render("group/editsubgrupos", {grupos: grupos, subgrupo: subgrupo})
    } catch (_err) {
        req.flash ("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group")
    }
}


exports.postUpdateSub = async (req, res) => {
    var subgrupo = await Subgrupo.findOne({ _id: req.body.id})
    let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.descricao.length < 2) {
        erros.push({
            texto: "Descrição do Subgrupo Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("group/editsubgrupos", {
            erros: erros
        })
    } else {
        try {      

            subgrupo.qrcode = req.body.qrcode
            subgrupo.imagem = endImg + req.body.imagem//.slice(0, -1)
            subgrupo.grupo = req.body.grupo
            subgrupo.descricao = req.body.descricao
            subgrupo.data = req.body.data
        
            await subgrupo.save()
            req.flash("success_msg", "Subgrupo editado com Sucesso!")
            res.redirect("/group/subgrupos")
            console.log("Subgrupo editado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Houve um erro interno ao editar o Subgrupo, tente Novamente!" + err)
            res.redirect("/group/subgrupos")
        }
    }
}

//Deletando um Subgrupo
exports.getDeleteSub = async(req, res) => {
    await Subgrupo.remove({_id: req.params.id})
    try {
        req.flash("success_msg", "Subgrupo deletado com Sucesso!")
        res.redirect("/group/subgrupos")
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/group/subgrupos")
    }
}

//Saibamais Subgrupos
exports.getViewSub = async (req, res) => {     
    var subgrupo = await Subgrupo.findOne({ _id: req.params.id}).lean() 
    try {
    res.render("group/saibamaissubgrupos",{subgrupo: subgrupo})
    } catch (err) {
        req.flash ("error_msg", "Ops, Erro ao Conectar com o Banco de Dados!")
        res.redirect("/group")
    }
}
