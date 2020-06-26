const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Grupo = new Schema({
    qrcode: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now()
    }

})

mongoose.model("grupos", Grupo)