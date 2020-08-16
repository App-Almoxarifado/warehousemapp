const mongoose = require("mongoose")
const qr = require('qr-image')
require("../models/Group")
const Group = mongoose.model("groups")
require("../models/Subgroup")
const Subgroup = mongoose.model("subgroups")
    //const repository = require('../repositories/group-repository')


//INDEX GRUPOS
exports.getIndex = async(req, res) => {
    try {
        var groups = await Group.find({})
        res.render("groups/index", { groups: groups.map(groups => groups.toJSON()) })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/groups/groups")
    }
}


//LISTANDO OS GRUPOS POR LISTA
exports.getList = async(req, res) => {
    try {
        // no repositoryvar groups = await repository.get();
        //var groups = await Group.find({//active: true})
        var groups = await Group.find({ active: true }).sort({ description: "asc" })
        res.render("groups/groups", { groups: groups.map(groups => groups.toJSON()) })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/groups/groups")
    }
}

//LISTANDO OS GRUPOS POR TABELA
exports.getListTable = async(req, res) => {
    try {
        // no repositoryvar groups = await repository.get();
        var groups = await Group.find({ active: true }).sort({ description: "asc" })
        res.render("groups/groupstables", { groups: groups.map(groups => groups.toJSON()) })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/groups/groups")
    }
}

//CRIANDO UM GRUPO
exports.getCreate = async(req, res) => {
    try {
        res.render("groups/addgroups")
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/groups/groups")
    }
}

exports.postCreate = async(req, res) => {
    let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do Grupo Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("groups/addgroups", {
            erros: erros
        })
    } else {
        try {
            const groups = new Group({
                qrcode: req.body.description
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                    .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                    .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                    .replace(/(^-+|-+$)/, ''), // Remove hífens extras do final ou do inicio da string
                image: endImg + req.body.image, //.slice(0, -1),
                description: req.body.description,
                date: req.body.date,
                //user: req.body.user,
                //active: req.body.active,
                //tags: [req.body.qrcode,req.body.description]

            })
            await groups.save()
            req.flash("success_msg", "Grupo criado com sucesso!")
            res.redirect("/groups/groups")
            console.log("Grupo criado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o grupo, tente novamente!")
            res.redirect("/groups/groups")
        }
    }
}

//EDITANDO UM GRUPO
exports.getUpdate = async(req, res) => {
    var group = await Group.findOne({ _id: req.params.id }).lean()
    try {
        res.render("groups/editgroups", { group: group })
    } catch (_err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/groups")
    }
}


exports.postUpdate = async(req, res) => {
    var group = await Group.findOne({ _id: req.body.id })
    let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do Grupo Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("groups/editgroups", {
            erros: erros
        })
    } else {
        try {

            group.qrcode = req.body.description
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                .replace(/(^-+|-+$)/, '')
            group.image = endImg + req.body.image //.slice(0, -1)
            group.description = req.body.description
            group.date = req.body.date
                //group.active = req.body.active
                //group.tags = [req.body.qrcode,req.body.description]
            await group.save()
            req.flash("success_msg", "Grupo editado com Sucesso!")
            res.redirect("/groups/groups")
            console.log("Grupo editado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Houve um erro interno ao editar o grupo, tente Novamente!")
            res.redirect("/groups/groups")
        }
    }
}

//DELETANDO UM GRUPO
exports.getDelete = async(req, res) => {
    await Group.remove({ _id: req.params.id })
    try {
        req.flash("success_msg", "Grupo deletado com Sucesso!")
        res.redirect("/groups/groups")
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/groups/groups")
    }
}

//ANALOGIA CARRINHO DE COMPRAS GRUPOS
exports.getView = async(req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.id }).lean()
        res.render("groups/takegroups", { group: group })
    } catch (err) {
        req.flash("error_msg", "Ops, Erro ao Conectar com o Banco de Dados!")
        res.redirect("/groups")
    }
}

//UPDATE CARRINHO DE COMPRAS GRUPOS
exports.postUpdateView = async(req, res) => {
    var group = await Group.findOne({ _id: req.body.id })
        //let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do Grupo Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("groups/editgroups", {
            erros: erros
        })
    } else {
        try {

            group.qrcode = req.body.description
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                .replace(/(^-+|-+$)/, ''),
                group.image = req.body.image //.slice(0, -1)
            group.description = req.body.description
            group.date = req.body.date
                //group.active = req.body.active

            await group.save()
            req.flash("success_msg", "Grupo editado com Sucesso!")
            res.redirect("/groups/groups")
            console.log("group editado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Houve um erro interno ao editar o grupo, tente Novamente!")
            res.redirect("/groups/groups")
        }
    }
}

//ROTA CARRINHO DE COMPRAS GRUPOS SAVE
exports.postCreateView = async(req, res) => {
    //let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do Grupo Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("groups/addgroups", {
            erros: erros
        })
    } else {
        try {
            const groups = new Group({
                qrcode: req.body.description
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                    .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                    .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                    .replace(/(^-+|-+$)/, ''),
                image: req.body.image, //.slice(0, -1),
                description: req.body.description,
                date: req.body.date,
                //active: req.body.active
            })
            await groups.save()
            req.flash("success_msg", "Grupo criado com sucesso!")
            res.redirect("/groups/groups")
            console.log("Grupo criado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o grupo, tente novamente!")
            res.redirect("/groups/groups")
        }
    }
}

//SUBGRUPOS////////////////////////////////////////////////////////////////////////////
//LISTANDO SUBGRUPOS POR LISTA
exports.getListSub = async(req, res) => {
    try {
        var subgroups = await Subgroup.find({}).populate("group")
        res.render("groups/subgroups", { subgroups: subgroups.map(subgroups => subgroups.toJSON()) })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/groups/subgroups")
    }
}

//LISTANDO UM SUBGRUPO PELA TABELA
exports.getListSubTable = async(req, res) => {
    try {
        var subgroups = await Subgroup.find({}).populate("group")
        res.render("groups/subgroupstables", { subgroups: subgroups.map(subgroups => subgroups.toJSON()) })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/groups/subgroups")
    }
}

//CRIANDO UM SUBGRUPO
exports.getCreateSub = async(req, res) => {
    try {
        var groups = await Group.find({})
        res.render("groups/addsubgroups", { groups: groups.map(groups => groups.toJSON()) })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/groups/subgroups")
    }
}

exports.postCreateSub = async(req, res) => {
    let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (req.body.group == "0") {
        erros.push({
            texto: "Grupo inválido, registre um grupo"
        })
    }
    if (!req.body.group || typeof req.body.group == undefined || req.body.group == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do Subgrupo Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("groups/addsubgroups", {
            erros: erros
        })
    } else {
        try {
            const subgroups = new Subgroup({
                qrcode: req.body.description
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                    .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                    .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                    .replace(/(^-+|-+$)/, ''),
                image: endImg + req.body.image, //.slice(0, -1),
                group: req.body.group,
                description: req.body.description,
                date: req.body.date,
                //active: req.body.active
            })
            await subgroups.save()
            req.flash("success_msg", "Subgrupo criado com sucesso!")
            res.redirect("/groups/subgroups")
            console.log("subgroup criado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o subgroup, tente novamente!")
            res.redirect("/groups/subgroups")
        }
    }
}

//EDITANDO UM SUBGRUPO
exports.getUpdateSub = async(req, res) => {
    var subgroup = await Subgroup.findOne({ _id: req.params.id }).lean()
    try {
        var groups = await Group.find({}).lean()
        res.render("groups/editsubgroups", { groups: groups, subgroup: subgroup })
    } catch (_err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/groups")
    }
}


exports.postUpdateSub = async(req, res) => {
    var subgroup = await Subgroup.findOne({ _id: req.body.id })
    let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (req.body.group == "0") {
        erros.push({
            texto: "Grupo inválido, registre um grupo"
        })
    }
    if (!req.body.group || typeof req.body.group == undefined || req.body.group == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do Subgrupo Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("groups/editsubgroups", {
            erros: erros
        })
    } else {
        try {

            subgroup.qrcode = req.body.description
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                .replace(/(^-+|-+$)/, ''),
                subgroup.image = endImg + req.body.image //.slice(0, -1)
            subgroup.group = req.body.group
            subgroup.description = req.body.description
            subgroup.date = req.body.date
                //subgroup.active = req.body.active

            await subgroup.save()
            req.flash("success_msg", "Subgrupo editado com Sucesso!")
            res.redirect("/groups/subgroups")
            console.log("subgroup editado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Houve um erro interno ao editar o Subgrupo, tente Novamente!" + err)
            res.redirect("/groups/subgroups")
        }
    }
}

//DELETANDO UM SUBGRUPO
exports.getDeleteSub = async(req, res) => {
    await Subgroup.remove({ _id: req.params.id })
    try {
        req.flash("success_msg", "Subgrupo deletado com Sucesso!")
        res.redirect("/groups/subgroups")
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/groups/subgroups")
    }
}


//ANALOGIA CARRINHO DE COMPRAS SUBGRUPOS
exports.getViewSub = async(req, res) => {
    var subgroup = await Subgroup.findOne({ _id: req.params.id }).lean()
    try {
        var groups = await Group.find({}).lean()
        res.render("groups/takesubgroups", { groups: groups, subgroup: subgroup })
    } catch (_err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/groups")
    }
}

//ROTA DE CARRINHO DE COMPRAS UPDATE SUBGRUPOS
exports.postUpdateViewSub = async(req, res) => {
    var subgroup = await Subgroup.findOne({ _id: req.body.id })
        //let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (req.body.group == "0") {
        erros.push({
            texto: "Grupo inválido, registre um grupo"
        })
    }
    if (!req.body.group || typeof req.body.group == undefined || req.body.group == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do subgroup Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("groups/takesubgroups", {
            erros: erros
        })
    } else {
        //Rota para Salvar
        /*try {      
            const subgroups = new Subgroup({
                qrcode: qrcode: req.body.description
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                .replace(/(^-+|-+$)/, ''),
                image: req.body.image.slice(0, -1),
                group: req.body.group,
                description: req.body.description,
                date: req.body.date
            })
                await subgroups.save()
                req.flash("success_msg", "Subgrupo criado com sucesso!")
                res.redirect("/groups/subgroups")
                console.log("subgroup criado com sucesso!")
            } catch (err) {
                req.flash("error_msg", "Ops, Houve um erro ao salvar o subgroup, tente novamente!")
                res.redirect("/groups/subgroups")
            }
        }
    }*/
        try {

            subgroup.qrcode = req.body.description
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                .replace(/(^-+|-+$)/, ''),
                subgroup.image = req.body.image //.slice(0, -1)
            subgroup.group = req.body.group
            subgroup.description = req.body.description
            subgroup.date = req.body.date
                //subgroup.active = req.body.active

            await subgroup.save()
            req.flash("success_msg", "Subgrupo editado com Sucesso!")
            res.redirect("/groups/subgroups")
            console.log("subgroup editado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Houve um erro interno ao editar o subgroup, tente Novamente!" + err)
            res.redirect("/groups/subgroups")
        }
    }
}

//ROTA DE CARRINHO DE COMPRAS SAVE
exports.postCreateViewSub = async(req, res) => {
        var subgroup = await Subgroup.findOne({ _id: req.body.id })
            //let endImg = "https://warehousemapp.herokuapp.com/uploads/"
        var erros = []
        if (req.body.group == "0") {
            erros.push({
                texto: "Grupo inválido, registre um grupo"
            })
        }
        if (!req.body.group || typeof req.body.group == undefined || req.body.group == null) {
            erros.push({
                texto: "Descricão Inválida"
            })
        }
        if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
            erros.push({
                texto: "Descricão Inválida"
            })
        }
        if (req.body.description.length < 2) {
            erros.push({
                texto: "Descrição do subgroup Muito Pequeno!"
            })
        }
        if (erros.length > 0) {
            res.render("groups/takesubgroups", {
                erros: erros
            })
        } else {
            //Rota para Salvar
            try {
                const subgroups = new Subgroup({
                    qrcode: req.body.description
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                        .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                        .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                        .replace(/(^-+|-+$)/, ''),
                    image: req.body.image,
                    group: req.body.group,
                    description: req.body.description,
                    date: req.body.date,
                    //active: req.body.active
                })
                await subgroups.save()
                req.flash("success_msg", "Subgrupo criado com sucesso!")
                res.redirect("/groups/subgroups")
                console.log("subgroup criado com sucesso!")
            } catch (err) {
                req.flash("error_msg", "Ops, Houve um erro ao salvar o subgroup, tente novamente!")
                res.redirect("/groups/subgroups")
            }
        }
    }
    /*try {      

            subgroup.qrcode = req.body.description
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                .replace(/(^-+|-+$)/, ''),
            subgroup.image = req.body.image//.slice(0, -1)
            subgroup.group = req.body.group
            subgroup.description = req.body.description
            subgroup.date = req.body.date
        
            await subgroup.save()
            req.flash("success_msg", "Subgrupo editado com Sucesso!")
            res.redirect("/group/subgroups")
            console.log("subgroup editado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Houve um erro interno ao editar o subgroup, tente Novamente!" + err)
            res.redirect("/groups/subgroups")
        }
    }
}*/


//QRCODE
exports.getQrcode = (req, res) => {
    var url = "https://warehousemapp.herokuapp.com/"
    const code = qr.image(url, { type: 'svg' })
    res.type('svg')
    code.pipe(res)
}