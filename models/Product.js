const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//CRIANDO O DOCUMENTO - ANÁLOGIA A TABELA NO BANCO DE DADOS
const Product = new Schema({
   qrcode: {
      type: String,
      required: false
   },
   image: {
      type: String,
      required: false
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
      required: true
   },
   /*fabricante: {
      type: String,
      required: true
   },
   madelo: {
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
   }
})

mongoose.model("products", Product)