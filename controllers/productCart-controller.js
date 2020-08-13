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


//VIZUALIZANDO PRODUTOS PARA FAZER PEDIDO
exports.getRequest = async (req, res) => {
    try {
        var numberRequest=Date.now()
        const filtros = [];
        let {
            search,
            page
        } = req.query;
        if (search) {
            const pattern = new RegExp(`.*${search}.*`)
            filtros.push({
                qrcode: {
                    $regex: pattern
                }
            })
            filtros.push({
                fullDescription: {
                    $regex: pattern
                }
            })
            filtros.push({
                user: {
                    $regex: pattern
                }
            })
            filtros.push({
                tags: {
                    $regex: pattern
                }
            })
        }

        page = page || 1;

        const quant = await Product
            .find(filtros.length > 0 ? {
                $or: filtros
            } : {}).estimatedDocumentCount()

        const total = await Product
            .find({}).count()

        var products = await Product
            .find(filtros.length > 0 ? {
                $or: filtros
            } : {})
            .sort({
                fullDescription: "asc"
            })
            .limit(5)
            .skip(page && Number(page) > 1 ? Number(page - 1) * 5 : 0)
            .populate("group")
            .populate("subgroup")
            .populate("client")
            .populate("physicalStatus")
            .populate("kindOfEquipment")

            var customers = await Client.find({
                active: true
            }).sort({
                description: "asc"
            }).lean()
        return res.render("products/productorders", {
            user:req.user,
            products: products.map(products => products.toJSON()),
            customers: customers,
            numberRequest,
            prev: Number(page) > 1,
            next: Number(page) * 5 < quant,
            page
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/products", {

        })
    } console.log(user)
}

//VIZUALIZANDO PRODUTOS CARRINHO
exports.getCart = async (req, res) => {
    try {
        var numberRequest=Date.now()
        var products = await Product
            .find({active:"cart"}).lean()
            .populate("group")
            .populate("subgroup")
            .populate("client")
            .populate("physicalStatus")
            .populate("kindOfEquipment")

            var customers = await Client.find({
                active: true
            }).sort({
                description: "asc"
            }).lean()


            console.log( req.user)
        return res.render("products/cartproducts", {
            user:req.user,
            products: products,
            customers: customers,
            numberRequest
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
    if (!req.body.fullDescription || typeof req.body.fullDescription == undefined || req.body.fullDescription == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }

    if (req.body.fullDescription.length < 2) {
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

                qrcode : req.body.qrcode,

                image : req.body.image,

                fullDescription : req.body.fullDescription,

                group : req.body.group,

                subgroup: req.body.subgroup,

                client: req.body.client,

                physicalStatus: req.body.physicalStatus,

                kindOfEquipment: req.body.kindOfEquipment,

                inputAmount: req.body.inputAmount,

                active:"stock"


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
    if (!req.body.fullDescription || typeof req.body.fullDescription == undefined || req.body.fullDescription == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }

    if (req.body.fullDescription.length < 2) {
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


            product.qrcode = req.body.qrcode

            product.image = req.body.image

            product.fullDescription = req.body.fullDescription

            product.group = req.body.group

            product.subgroup = req.body.subgroup

            product.client = req.body.client

            product.physicalStatus = req.body.physicalStatus

            product.kindOfEquipment = req.body.kindOfEquipment

            product.inputAmount = req.body.inputAmount

            product.requestNumber = req.body.requestNumber

            product.outputQuantity = 1

            product.active = "cart"
            
            await product.save()
            req.flash("success_msg", "Produto solicitado!")
            res.redirect("/products/cart")
            

        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o Produto, tente novamente!" + err)
            res.redirect("/products")

        }
    }
}




