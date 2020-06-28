const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Unity = new Schema({

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
    }
})

mongoose.model("units", Unity)