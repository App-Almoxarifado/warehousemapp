const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Usuario = new Schema({
    qrcode: {
        type: String,
        require: true
    },
    imagem: {
        type: String,
        require: true
    },
    nome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    eAdmin: {
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }

})

mongoose.model("usuarios", Usuario)