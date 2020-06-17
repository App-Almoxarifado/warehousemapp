const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Grupo = new Schema({
    qrcode: {
        type: String,
        required: false
    },
    imagem: {
        type: String,
        required: false
    },
    descricao: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }

})

mongoose.model("grupos", Grupo)