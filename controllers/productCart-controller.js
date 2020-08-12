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


//CRIANDO UM PRODUTO
exports.getRequest = async (req, res) => {
    try {
        var products = await Product
            .find({}).lean()
        return res.render("products/productorders", {products:products
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/products/products", {

        })
    }
}

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

                manufacturer: req.body.manufacturer,

                model: req.body.model,

                capacityReach: req.body.capacityReach,

                serialNumber: req.body.serialNumber,


            })
            await products.save()
            req.flash("success_msg", "Produto criado com sucesso!")
            res.redirect("/products/products/request")

        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o Produto, tente novamente!" + err)
            res.redirect("/products/products")

        }
    }
}






