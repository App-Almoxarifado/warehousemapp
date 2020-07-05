const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Status = new Schema({
    qrcode: {
        type: String,
        lowercase: true,
        required: false
    },
    image: {
        type: String,
        require: true
    },
    description: {
        type: String,
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

mongoose.model("status", Status)