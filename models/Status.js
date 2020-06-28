const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Status = new Schema({

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
        required: true
    },
    user: {
        type: String,
        default: "Daniel Soares de Albuquerque"
    }
})

mongoose.model("status", Status)