const mongoose = require("mongoose")
require("../models/Product")
const Product = mongoose.model("products")
require("../models/Transfer")
const Transfer = mongoose.model("transfers")
require("../models/Client")
const Client = mongoose.model("customers")


exports.createTransfer = async (req,res) => {
    try {
        const { clientId, deliveryDate, productsQuantity, productsId } = req.body;
        const client = await Client.findById(clientId);
        if(!client) {}

        if(!productsQuantity) {}

        if(!productsId) {}

        const products = productsId.map(async (q,index) => {
            const product = await Product.findById(q);
            const quant = Number(productsQuantity[index]);
            product.inputAmount -= quant;
            await product.save()
            return {
                product: product._id,
                quant
            }
        });

        const transfer = new Transfer({
            client: client._id,
            deliveryDate,
            products
        })
        await transfer.save();
        return res.send("Criado com sucesso")
    } catch(e) {
        console.error(e)
    }
}