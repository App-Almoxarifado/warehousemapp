const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//CRIANDO O DOCUMENTO - ANÁLOGIA A TABELA NO BANCO DE DADOS
const Product = new Schema({
   qrcode: {
      type: String,
      required: false,
      index: true,
      trim: true
   },
   image: {
      type: String,
      required: false,
      trim: true,
      default: "https://warehousemapp.herokuapp.com/img/logo8.png"
   },
   group: {
      type: Schema.Types.ObjectId,
      ref: "groups",
      required: true
   },
   subgroup: {
      type: Schema.Types.ObjectId,
      ref: "subgroups",
      required: true
   },
   description: {
      type: String,
      required: true,
      index: true,
      trim: true
   },
   /*fabricante: {
      type: String,
      required: true
   },
   modelo: {
      type: String,
      required: true
   },
   capacidadealcance: {
      type: String,
      required: true
   },*/
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

mongoose.model("products", Product)