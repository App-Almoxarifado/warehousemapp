const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Collaborator = new Schema({
    qrcode: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    registration: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    contractor: {
        type: Schema.Types.ObjectId,
        ref: "clients",
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
    cpfCnpj: {
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
    }

})

mongoose.model("collaborators", Collaborator)