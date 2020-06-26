if (process.env.NODE_ENV == "production") {
    module.exports = {
        mongoURI: "mongodb+srv://bdappalmoxarifado:ddapj060814@cluster0-p1olg.mongodb.net/warehouseapp?retryWrites=true&w=majority"
    }
} else {
    module.exports = { mongoURI: "mongodb://localhost/warehouseapp" }

}