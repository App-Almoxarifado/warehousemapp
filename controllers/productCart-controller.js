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
require("../models/Type")
const Type = mongoose.model("types")
require("../models/Unity")
const Unity = mongoose.model("units")
require("../models/Interval")
const Interval = mongoose.model("breaks")
require("../models/Provider")
const Provider = mongoose.model("providers")
require("../models/Collaborator")
const Collaborator = mongoose.model("collaborators")


//VIZUALIZANDO PRODUTOS
exports.getRequest = async (req, res) => {
    try {

        var products = await Product
            .find({}).lean()
            var groups = await Group.find({
                active: true
            }).sort({
                description: "asc"
            }).lean()
            console.log( req.user)
        return res.render("products/productorders", {
            user:req.user,
            products: products,
            groups: groups
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/products", {

        })
    } console.log(user)
}

//COLOCANDO PRODUTO NO CARRINHO COM UM CLIQUE
exports.postRequest = async (req, res) => {
    var erros = []
    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }

    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do produto muito pequena!"
        })
    }
    if (erros.length > 0) {
        res.render("products/addproducts", {
            erros: erros
        })
    } else {
        try {
            const products = new Product({


                description: req.body.description,

                group : req.body.group,

                manufacturer: req.body.manufacturer,

                model: req.body.model,

                capacityReach: req.body.capacityReach,

                serialNumber: req.body.serialNumber,


            })
            await products.save()
            req.flash("success_msg", "Produto solicitado, enviado para pedido!")
            res.redirect("/products/request")

        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o Produto, tente novamente!" + err)
            res.redirect("/products")

        }
    }
}


//FINALIZANDO SOLICITAÇÃO POR ID
exports.updateRequest = async (req, res) => {
    var product = await Product.findOne({ _id: req.body.id})
    var erros = []
    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }

    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do produto muito pequena!"
        })
    }
    if (erros.length > 0) {
        res.render("products/addproducts", {
            erros: erros
        })
    } else {
        try {
            
            product.description = req.body.description

            product.manufacturer = req.body.manufacturer

            product.model = req.body.model

            product.capacityReach = req.body.capacityReach

            product.serialNumber = req.body.serialNumber


            
            await product.save()
            req.flash("success_msg", "Produto solicitado!")
            res.redirect("/products/request")
            

        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o Produto, tente novamente!" + err)
            res.redirect("/products")

        }
    }
}




