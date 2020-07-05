const mongoose = require("mongoose")
const qr = require('qr-image')
require("../models/Type")
const Type = mongoose.model("types")

//LISTANDO OS FORNECEDORES POR LISTA
exports.getList = async (req, res) => {
    try {
    var types = await Type
    .find({active: true})
    .sort({ description: "asc" })
        res.render("types/types", {types:types.map(types => types.toJSON())})
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/types/types")
    }
}


//QRCODE
exports.getQrcode = (req, res) => {
    var url = "https://warehousemapp.herokuapp.com/"
    const code = qr.image(url, {type: 'svg'})  
    res.type('svg')
    code.pipe(res)
  }