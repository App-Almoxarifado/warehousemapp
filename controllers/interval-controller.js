const mongoose = require("mongoose")
const qr = require('qr-image')
require("../models/Interval")
const Interval = mongoose.model("breaks")

//LISTANDO OS FORNECEDORES POR LISTA
exports.getList = async (req, res) => {
    try {
    var breaks = await Interval
    .find({active: true})
    .sort({ description: "asc" })
        res.render("breaks/breaks", {breaks:breaks.map(breaks => breaks.toJSON())})
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/breaks/breaks")
    }
}


//QRCODE
exports.getQrcode = (req, res) => {
    var url = "https://warehousemapp.herokuapp.com/"
    const code = qr.image(url, {type: 'svg'})  
    res.type('svg')
    code.pipe(res)
  }