const mongoose = require("mongoose");
require("../models/Product");
const Product = mongoose.model("products");
require("../models/Transfer");
const Transfer = mongoose.model("transfers");
require("../models/Client");
const Client = mongoose.model("customers");

//VIZUALIZANDO PRODUTOS PARA FAZER PEDIDO
exports.getTransfer = async (req, res) => {
  try {
    var transfers = await Transfer.find({}).lean();

    res.render("products/transfers", {
      transfers: transfers,
    });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products/products");
  }
};

exports.createTransfer = async (req, res) => {
  try {
    const { clientId, deliveryDate, productsQuantity, productsId } = req.body;
    const client = await Client.findById(clientId);
    if (!client) {
    }

    if (!productsQuantity) {
    }

    if (!productsId) {
    }

    const products = productsId.map(async (id, index) => {
      const product = await Product.findById(id);
      const quant = Number(productsQuantity[index]);
      product.inputAmount -= quant;
      await product.save();
      return {
        product: product._id,
        quant
      };
    });

    const transfer = new Transfer({
      client: client._id,
      deliveryDate,
      productsQuantity,
      products,
    });
    await transfer.save();
    return res.send("Criado com sucesso");
  } catch (e) {
    console.error(e);
  }
};

exports.editTransfer = async (req, res) => {
  try {
    const { clientId, deliveryDate, productsQuantity, productsId } = req.body;
    const client = await Client.findById(clientId);
    if (!client) {
    }

    if (!productsQuantity) {
    }

    if (!productsId) {
    }

    const products = productsId.map(async (q, index) => {
      const product = await Product.findById(q);
      const quant = Number(productsQuantity[index]);

      if(product && product.inputAmount - quant >= 0) {
        product.inputAmount -= quant;
        product.save();
      }
      else return null;

      return {
        product: product._id,
        quant,
      };
    });

    const transfer = new Transfer({
      client: client._id,
      deliveryDate,
      products: products.filter(p => !!p),
    });

    await transfer.save();
    return res.send("Criado com sucesso");
  } catch (e) {
    console.error(e);
  }
};
