const mongoose = require("mongoose")
const qr = require('qr-image')
require("../models/Group")
const Group = mongoose.model("groups")
require("../models/Subgroup")
const Subgroup = mongoose.model("subgroups")
//const repository = require('../repositories/group-repository')


//index groups
exports.getIndex = async (req, res) => {
    var groups = await Group.find({})
    try {
    res.render("group/index")
} catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!")
    res.redirect("/group/groups", {groups:groups.map(groups => groups.toJSON())})
}
}


//Listando groups
exports.getList = async (req, res) => {
    try {
        // no repositoryvar groups = await repository.get();
        var groups = await Group.find({})
        res.render("group/groups", {groups:groups.map(groups => groups.toJSON())})
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group/groups")
    }
}

//Criando um group
exports.getCreate = async (req, res) => {
    try {
        res.render("group/addgroups")
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group/groups")
    }
}

exports.postCreate = async (req, res) => {
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
        res.render("group/addgroups", {
            erros: erros
        })
    } else {
        try {      
        const groups = new Group({
            qrcode: req.body.qrcode,
            image: endImg + req.body.image,//.slice(0, -1),
            description: req.body.description,
            date: req.body.date
        })
            await groups.save()
            req.flash("success_msg", "Grupo criado com sucesso!")
            res.redirect("/group/groups")
            console.log("Grupo criado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o grupo, tente novamente!")
            res.redirect("/group/groups")
        }
    }
}

//Editando um group
exports.getUpdate = async (req, res) => {
    var group = await Group.findOne({ _id: req.params.id}).lean()
    try {
        res.render("group/editgroups", { group: group})
    } catch (_err) {
        req.flash ("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group")
    }
}


exports.postUpdate = async (req, res) => {
    var group = await Group.findOne({ _id: req.body.id})
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
        res.render("group/editgroups", {
            erros: erros
        })
    } else {
        try {      

            group.qrcode = req.body.qrcode
            group.image = endImg + req.body.image//.slice(0, -1)
            group.description = req.body.description
            group.date = req.body.date
        
            await group.save()
            req.flash("success_msg", "Grupo editado com Sucesso!")
            res.redirect("/group/groups")
            console.log("group editado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Houve um erro interno ao editar o grupo, tente Novamente!")
            res.redirect("/group/groups")
        }
    }
}

//Deletando um group
exports.getDelete = async(req, res) => {
    await Group.remove({_id: req.params.id})
    try {
        req.flash("success_msg", "Grupo deletado com Sucesso!")
        res.redirect("/group/groups")
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/group/groups")
    }
}

//Saibamais groups
exports.getView = async (req, res) => {  
    try {
    const group = await Group.findOne({ _id: req.params.id}).lean()
    res.render("group/saibamaisgroups", {group: group})
    } catch (err) {
        req.flash ("error_msg", "Ops, Erro ao Conectar com o Banco de Dados!")
        res.redirect("/group")
    }
}


//Listando subgroups
exports.getListSub = async (req, res) => {
    try {
        var subgroups = await Subgroup.find({}).populate("group")
        res.render("group/subgroups", {subgroups:subgroups.map(subgroups => subgroups.toJSON())})
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group/subgroups")
    }
}

//Listando subgroups
exports.getListSubTable = async (req, res) => {
    try {
        var subgroups = await Subgroup.find({}).populate("group")
        res.render("group/subgroupstables", {subgroups:subgroups.map(subgroups => subgroups.toJSON())})
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group/subgroups")
    }
}

//Criando um subgroup
exports.getCreateSub = async (req, res) => {
    try {
        var groups = await Group.find({})
        res.render("group/addsubgroups", {groups:groups.map(groups => groups.toJSON())})
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group/subgroups")
    }
}

exports.postCreateSub = async (req, res) => {
    let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (req.body.grupo == "0") {
        erros.push({
            texto: "Grupo inválido, registre um grupo"
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
        res.render("group/addsubgroups", {
            erros: erros
        })
    } else {
        try {      
        const subgroups = new Subgroup({
            qrcode: req.body.qrcode,
            image: endImg + req.body.image.slice(0, -1),
            group: req.body.group,
            description: req.body.description,
            date: req.body.date
        })
            await subgroups.save()
            req.flash("success_msg", "Subgrupo criado com sucesso!")
            res.redirect("/group/subgroups")
            console.log("subgroup criado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o subgroup, tente novamente!")
            res.redirect("/group/subgroups")
        }
    }
}

//Editando um subgroup
exports.getUpdateSub = async (req, res) => {
    var subgroup = await Subgroup.findOne({ _id: req.params.id}).lean()
    try {
        var groups = await Group.find({}).lean()
        res.render("group/editsubgroups", {groups: groups, subgroup: subgroup})
    } catch (_err) {
        req.flash ("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group")
    }
}


exports.postUpdateSub = async (req, res) => {
    var subgroup = await Subgroup.findOne({ _id: req.body.id})
    let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (req.body.grupo == "0") {
        erros.push({
            texto: "Grupo inválido, registre um grupo"
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
        res.render("group/editsubgroups", {
            erros: erros
        })
    } else {
        try {      

            subgroup.qrcode = req.body.qrcode
            subgroup.image = endImg + req.body.image//.slice(0, -1)
            subgroup.group = req.body.group
            subgroup.description = req.body.description
            subgroup.date = req.body.date
        
            await subgroup.save()
            req.flash("success_msg", "Subgrupo editado com Sucesso!")
            res.redirect("/group/subgroups")
            console.log("subgroup editado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Houve um erro interno ao editar o Subgrupo, tente Novamente!" + err)
            res.redirect("/group/subgroups")
        }
    }
}

//Deletando um subgroup
exports.getDeleteSub = async(req, res) => {
    await Subgroup.remove({_id: req.params.id})
    try {
        req.flash("success_msg", "Subgrupo deletado com Sucesso!")
        res.redirect("/group/subgroups")
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/group/subgroups")
    }
}

exports.getQrcode = (req, res) => {
    var url = "Subgroup.find({_id: req.body.image}).lean()"
    const code = qr.image(url, {type: 'svg'})  
    res.type('svg')
    code.pipe(res)
  }

//Editando um subgroup
exports.getViewSub = async (req, res) => {
    var subgroup = await Subgroup.findOne({ _id: req.params.id}).lean()
    try {
        var groups = await Group.find({}).lean()
        res.render("group/takesubgroups", {groups: groups, subgroup: subgroup})
    } catch (_err) {
        req.flash ("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group")
    }
}


exports.postUpdateViewSub = async (req, res) => {
    var subgroup = await Subgroup.findOne({ _id: req.body.id})
    //let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (req.body.grupo == "0") {
        erros.push({
            texto: "Grupo inválido, registre um grupo"
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
        res.render("group/takesubgroups", {
            erros: erros
        })
    } else {
        //Rota para Salvar
        /*try {      
            const subgroups = new Subgroup({
                qrcode: req.body.qrcode,
                image: req.body.image.slice(0, -1),
                group: req.body.group,
                description: req.body.description,
                date: req.body.date
            })
                await subgroups.save()
                req.flash("success_msg", "Subgrupo criado com sucesso!")
                res.redirect("/group/subgroups")
                console.log("subgroup criado com sucesso!")
            } catch (err) {
                req.flash("error_msg", "Ops, Houve um erro ao salvar o subgroup, tente novamente!")
                res.redirect("/group/subgroups")
            }
        }
    }*/ 
        try {      

            subgroup.qrcode = req.body.qrcode
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
            res.redirect("/group/subgroups")
        }
    }
} 

exports.postCreateViewSub = async (req, res) => {
    var subgroup = await Subgroup.findOne({ _id: req.body.id})
    //let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (req.body.grupo == "0") {
        erros.push({
            texto: "Grupo inválido, registre um grupo"
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
        res.render("group/takesubgroups", {
            erros: erros
        })
    } else {
        //Rota para Salvar
        try {      
            const subgroups = new Subgroup({
                qrcode: req.body.qrcode,
                image: req.body.image,
                group: req.body.group,
                description: req.body.description,
                date: req.body.date
            })
                await subgroups.save()
                req.flash("success_msg", "Subgrupo criado com sucesso!")
                res.redirect("/group/subgroups")
                console.log("subgroup criado com sucesso!")
            } catch (err) {
                req.flash("error_msg", "Ops, Houve um erro ao salvar o subgroup, tente novamente!")
                res.redirect("/group/subgroups")
            }
        }
    }
        /*try {      

            subgroup.qrcode = req.body.qrcode
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
            res.redirect("/group/subgroups")
        }
    }
}*/ 