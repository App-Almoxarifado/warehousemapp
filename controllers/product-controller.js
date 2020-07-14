const mongoose = require("mongoose")
require("../models/Product")
const Product = mongoose.model("products")
require("../models/Group")
const Group = mongoose.model("groups")
require("../models/Subgroup")
const Subgroup = mongoose.model("subgroups")
require("../models/Client")
const Client = mongoose.model("customers")
require("../models/Location")
const Location = mongoose.model("leases")
require("../models/Sublease")
const Sublease = mongoose.model("subleases")
require("../models/Status")
const Status = mongoose.model("status")

//PRODUTOS POR LISTA
exports.getList = async (req, res) => {
    try {
        const filtros = [];
        let { search, page } = req.query;
        if(search) {
            const pattern = new RegExp(`.*${search}.*`)
            filtros.push({ qrcode : { $regex : pattern }})
            filtros.push({ description : { $regex : pattern }})
            filtros.push({ user : { $regex : pattern }})
        }

        page = page || 1;

        const quant = await Product
            .find(filtros.length > 0 ? { $or: filtros} : {}).estimatedDocumentCount()
    
        var products = await Product
            .find(filtros.length > 0 ? { $or: filtros} : {})
            .limit(3)
            .skip(page && Number(page) > 1 ? Number(page-1) * 3 : 0)
            .populate("group")
            .populate("subgroup")
        res.render("products/products", {
            products:products.map(products => products.toJSON()),
            prev: Number(page) > 1,
            next: Number(page)*3 < quant,
            page
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/products/products")
    }
}

//PRODUTOS POR TABELA
exports.getListTable = async (req, res) => {
    try {
        var products = await Product.find()
        .populate("group")
        .populate("subgroup")
        res.render("products/productstables", {
            products:products.map(products => products.toJSON())
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/products/products")
    }
}

//CRIANDO UM PRODUTO
exports.getCreate = async (req, res) => {
    try {

        var groups = await Group.find({})
        const { gId } = req.query;
        var subgroups = await Subgroup.find(gId ? { group: gId } : {});
        var leases = await Location.find({})
        var subleases = await Sublease.find({})
        return res.render("products/addproducts", { 
            groups:groups.map(groups => groups.toJSON()),
            subgroups:subgroups.map(subgroups => subgroups.toJSON()),
            idGroup: gId,
            leases:leases.map(leases => leases.toJSON()),
            subleases:subleases.map(subleases => subleases.toJSON())
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/products/products")
    }
}

exports.postCreate = async (req, res) => {
    let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (!req.body.fullDescription || typeof req.body.fullDescription == undefined || req.body.fullDescription == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.fullDescription.length < 2) {
        erros.push({
            texto: "Descrição do Produto Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("products/addproducts", {
            erros: erros
        })
    } else {
        try {      
        const products = new Product({
            qrcode: req.body.fullDescription
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
            .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
            .replace(/(^-+|-+$)/, ''),
            image: endImg + req.body.image,
            group: req.body.group,
            subgroup: req.body.subgroup,
            local: req.body.local,
            sublease: req.body.sublease,
            fullDescription: req.body.fullDescription,
            date: req.body.date,
            tags: [req.body.qrcode,req.body.group,req.body.subgroup,req.body.fullDescription]
        })
            await products.save()
            req.flash("success_msg", "Produto criado com sucesso!")
            res.redirect("/products/products")
            console.log("Produto criado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o Produto, tente novamente!"+ err)
            res.redirect("/products/products")
        }
    }
}

//EDITANDO UM PRODUTO
exports.getUpdate = async (req, res) => {
    var product = await Product.findOne({ _id: req.params.id}).lean()
    try {
        var groups = await Group.find({}).lean()
        var subgroups = await Subgroup.find({}).lean()
        res.render("products/editproducts",{groups: groups, subgroups: subgroups, product: product})
    } catch (_err) {
        req.flash ("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/products/products")
    }
}


exports.postUpdate = async (req, res) => {
    var product = await Product.findOne({ _id: req.body.id})
    let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
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
        res.render("/product/products", {
            erros: erros
        })
    } else {
        try {      

            product.qrcode = req.body.qrcode
            product.image = endImg + req.body.image//.slice(0, -1)
            product.group = req.body.group
            product.subgroup = req.body.subgroup
            product.description = req.body.description
            product.date = req.body.date
        
            await product.save()
            req.flash("success_msg", "Produto editado com Sucesso!")
            res.redirect("/products/products")
            console.log("Produto editado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Houve um erro interno ao editar o Produto, tente Novamente!" + err)
            res.redirect("/products/products")
        }
    }
}

//DELETANDO UM PRODUTO
exports.getDelete = async(req, res) => {
    await Product.remove({_id: req.params.id})
    try {
        req.flash("success_msg", "Produto deletado com Sucesso!")
        res.redirect("/products/products")
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/products/products")
    }
}