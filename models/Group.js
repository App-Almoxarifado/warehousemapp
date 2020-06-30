const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Group = new Schema({
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

mongoose.model("groups", Group)