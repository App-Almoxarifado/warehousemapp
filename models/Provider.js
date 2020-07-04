const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Provider = new Schema({
    qrcode: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    service: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    socialReason: {
        type: String,
        required: true
    },
    cpfCnpj: {
        type: String,
        required: true
    },
    ie: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    cep: {
        type: String,
        required: true
    },
    logradouro: {
        type: String,
        required: true
    },
    bairro: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    uf: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        default: Date.now()
    },
    user: {
        type: String,
        default: "Daniel Soares de Albuquerque"
    },
    active: {
        type: Boolean,
        default: "true"
    },
    tags: [{
        type: String
        
     }]

})

mongoose.model("providers", Provider)