const mongoose = require("mongoose")
require("../models/Product")
const Product = mongoose.model("products")
require("../models/Group")
const Group = mongoose.model("groups")
require("../models/Subgroup")
const Subgroup = mongoose.model("subgroups")

//Listando products
exports.getList = async (req, res) => {
    try {
        var products = await Product.find()
        .populate("group")
        .populate("subgroup")
        res.render("product/products", {
            products:products.map(products => products.toJSON())
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/product/products")
    }
}

//Criando um Product
exports.getCreate = async (req, res) => {
    try {
        var groups = await Group.find({})
        const { gId } = req.query;
        var subgroups = await Subgroup.find(gId ? { group: gId } : {});
        return res.render("product/addproducts", { 
            groups:groups.map(groups => groups.toJSON()),
            subgroups:subgroups.map(subgroups => subgroups.toJSON()),
            idGroup: gId
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/product/products")
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
            texto: "Descrição do Produto Muito Pequeno!"
        })
    }
    if (erros.length > 0) {
        res.render("product/addproducts", {
            erros: erros
        })
    } else {
        try {      
        const products = new Product({
            qrcode: req.body.qrcode,
            image: endImg + req.body.image.slice(0, -1),
            group: req.body.group,
            subgroup: req.body.subgroup,
            description: req.body.description,
            date: req.body.date
        })
            await products.save()
            req.flash("success_msg", "Produto criado com sucesso!")
            res.redirect("/product/products")
            console.log("Produto criado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o Produto, tente novamente!"+ err)
            res.redirect("/product/products")
        }
    }
}

//Editando um Produto
exports.getUpdate = async (req, res) => {
    var product = await Product.findOne({ _id: req.params.id}).lean()
    try {
        var groups = await Group.find({}).lean()
        var subgroups = await Subgroup.find({}).lean()
        res.render("product/editproducts",{groups: groups, subgroups: subgroups, product: product})
    } catch (_err) {
        req.flash ("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/product/products")
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
            res.redirect("/product/products")
            console.log("Produto editado com sucesso!")
        } catch (err) {
            req.flash("error_msg", "Houve um erro interno ao editar o Produto, tente Novamente!" + err)
            res.redirect("/product/products")
        }
    }
}

//Deletando um Poduto
exports.getDelete = async(req, res) => {
    await Product.remove({_id: req.params.id})
    try {
        req.flash("success_msg", "subgroup deletado com Sucesso!")
        res.redirect("/group/subgroups")
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/group/subgroups")
    }
}