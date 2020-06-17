const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Grupo")
const Grupo = mongoose.model("grupos")

router.get('/', (req, res) => {
    res.render("group/index")
})

//VIZUALIZANDO GRUPOS
router.get('/grupos', (req, res) => {
    res.render("group/grupos")
})

//CRIANDO UM NOVO GRUPO
router.get('/grupos/add', (req, res) => {
    res.render("group/addgrupos")
})

router.post("/grupos/novo", (req, res) => {
    let endImg = "http://localhost:3000/uploads/"
    var erros = []
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }
    if (req.body.descricao.length < 2) {
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
            imagem: endImg + req.body.imagem.slice(0, -1),
            descricao: req.body.descricao,
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
})



module.exports = router