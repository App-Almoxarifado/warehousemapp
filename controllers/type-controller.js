const mongoose = require("mongoose")
require("../models/Type")
const Type = mongoose.model("types")
require("../models/Client")
const Client = mongoose.model("customers")


//EXIBINDO TIPOS POR LISTA
exports.getList = async(req, res) => {
    try {
        var customers = await Client.find({ active: true}).sort({description: "asc"}).lean()

        const filtros = [];
        let { search, page, site, limit} = req.query;
        if (!!search) {
            const pattern = new RegExp(`.*${search}.*`)
            filtros.push(
              {qrcode: { $regex: pattern }},
              {description: {$regex: pattern}},
              {user: { $regex: pattern}})}

        page = Number(page || 1);
        limit = limit ? Number(limit) : 10;

        const quant = await Type.find(filtros.length > 0 ? {$or: filtros} : {}).estimatedDocumentCount()

        var types = await Type.find(filtros.length > 0 ? {$or: filtros} : {}).sort({description: "asc"}).limit(limit).skip(page > 1 ? (page - 1) * limit : 0)
        .populate("userLaunch")
        .populate("userEdition")
            console.log(quant)
        res.render("types/types", {
            types: types.map(types => types.toJSON()),
            customers: customers,
            prev: Number(page) > 1,
            next: Number(page) * limit < quant,
            page,
            limit,
            site
        })
    } catch (err) {
        console.log(err);
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/types/types")
    }
}

//EXIBINDO TIPOS POR TABELA
exports.getTable = async(req, res) => {
    try {
        var customers = await Client.find({ active: true}).sort({description: "asc"}).lean()

        const filtros = [];
        let { search, page, site, limit} = req.query;
        if (!!search) {
            const pattern = new RegExp(`.*${search}.*`)
            filtros.push(
              {qrcode: { $regex: pattern }},
              {description: {$regex: pattern}},
              {user: { $regex: pattern}})}

        page = Number(page || 1);
        limit = limit ? Number(limit) : 10;

        const quant = await Type.find(filtros.length > 0 ? {$or: filtros} : {}).estimatedDocumentCount()

        var types = await Type.find(filtros.length > 0 ? {$or: filtros} : {}).sort({description: "asc"}).limit(limit).skip(page > 1 ? (page - 1) * limit : 0)
        .populate("userLaunch")
        .populate("userEdition")
            console.log(quant)
        res.render("types/typestable", {
            types: types.map(types => types.toJSON()),
            customers: customers,
            prev: Number(page) > 1,
            next: Number(page) * limit < quant,
            page,
            limit,
            site
        })
    } catch (err) {
        console.log(err);
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/types/types")
    }
}

//CRIANDO UM TIPO
exports.getCreate = async(req, res) => {
    try {
        res.render("types/addtypes")
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/types/types")
    }
}

exports.postCreate = async(req, res) => {
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
        res.render("types/addtypes", {
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
                image: req.body.image, //.slice(0, -1),
                description: req.body.description,
                date: req.body.date,
                //user: req.body.user,
                //active: req.body.active,
                //tags: [req.body.qrcode,req.body.description]

            })
            await groups.save()
            req.flash("success_msg", "Grupo criado com sucesso!")
            res.redirect("/types/types")
            console.log("Tipo criado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o tipo, tente novamente!")
            res.redirect("/types/types")
        }
    }
}