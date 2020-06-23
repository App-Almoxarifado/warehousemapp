const mongoose = require("mongoose")
require("../models/Product")
const Product = mongoose.model("products")
require("../models/Grupo")
const Grupo = mongoose.model("grupos")
require("../models/Subgrupo")
const Subgrupo = mongoose.model("subgrupos")

//Listando products
exports.getList = async (req, res) => {
    try {
        // no repository var products = await repository.get();
        var products = await Product.find().populate("grupo").populate("subgrupo")
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
        var grupos = await Grupo.find({})
        const { gId } = req.query;
        var subgrupos = await Subgrupo.find(gId ? { grupo: gId } : {});
        return res.render("product/addproducts", { 
            grupos:grupos.map(grupos => grupos.toJSON()),
            subgrupos:subgrupos.map(subgrupos => subgrupos.toJSON()),
            idGrupo: gId
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/product/products")
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
            imagem: endImg + req.body.imagem.slice(0, -1),
            grupo: req.body.grupo,
            subgrupo: req.body.subgrupo,
            descricao: req.body.descricao,
            data: req.body.data
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

