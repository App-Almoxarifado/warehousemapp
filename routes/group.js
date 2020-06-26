const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Grupo")
const Grupo = mongoose.model("grupos")


router.get('/', async (req, res) => {
    try {
    res.render("group/index")
} catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!")
    res.redirect("/")
}
})

//VIZUALIZANDO GRUPOS
/*router.get('/grupos', (req, res) => {
    res.render("group/grupos")
})*/

//VIZUALIZANDO GRUPOS async await
router.get('/grupos', async (req, res) => {
    try {
        res.render("group/grupos")
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group/grupos")
    }
})

//CRIANDO UM NOVO GRUPO
/*router.get('/grupos/add', (req, res) => {
    res.render("group/addgrupos")
})*/

//CRIANDO UM NOVO GRUPO async await
router.get('/grupos/add', async (req, res) => {
    try {
        res.render("group/addgrupos")
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/group/grupos")
    }
})

/*router.post("/grupos/novo", (req, res) => {
    let endImg = "http://localhost:3000/uploads/"
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
        res.render("group/addgrupos", {
            erros: erros
        })
    } else {
        const novoGrupo = {
            qrcode: req.body.qrcode,
            image: endImg + req.body.image.slice(0, -1),
            description: req.body.description,
            data: req.body.data
        }
        new Grupo(novoGrupo).save().then(() => {
            req.flash("success_msg", "Grupo criado com sucesso!")
            res.redirect("/group/grupos")
            console.log("Grupo criado com sucesso!")
        }).catch((err) => {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o grupo, tente novamente!")
            res.redirect("/group/grupos")
        })
    }
})*/

router.post("/grupos/novo", async (req, res) => {
    let endImg = "http://localhost:3000/uploads/"
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
        res.render("group/addgrupos", {
            erros: erros
        })
    } else {
        try {
       
        const grupos = new Grupo({
            qrcode: req.body.qrcode,
            image: endImg + req.body.image.slice(0, -1),
            description: req.body.description,
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
})

module.exports = router