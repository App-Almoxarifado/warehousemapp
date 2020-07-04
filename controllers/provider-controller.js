const mongoose = require("mongoose")
const qr = require('qr-image')
require("../models/Provider")
const Provider = mongoose.model("providers")

//LISTANDO OS FORNECEDORES POR LISTA
exports.getList = async (req, res) => {
    try {
    var providers = await Provider
    .find({active: true})
    .sort({ name: "asc" })
        res.render("providers/providers", {providers:providers.map(providers => providers.toJSON())})
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/providers/providers")
    }
}


//QRCODE
exports.getQrcode = (req, res) => {
    var url = "https://warehousemapp.herokuapp.com/"
    const code = qr.image(url, {type: 'svg'})  
    res.type('svg')
    code.pipe(res)
  }
