const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//CRIANDO O DOCUMENTO - ANÁLOGIA A TABELA NO BANCO DE DADOS
const Subgrupo = new Schema({
   qrcode: {
      type: String,
      required: false
   },
   image: {
      type: String,
      required: false
   },
   grupo: {
      type: Schema.Types.ObjectId,
      ref: "grupos",
      required: true
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

mongoose.model("subgrupos", Subgrupo)