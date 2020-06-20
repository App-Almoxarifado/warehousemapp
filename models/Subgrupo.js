const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//CRIANDO O DOCUMENTO - ANÁLOGIA A TABELA NO BANCO DE DADOS
const Subgrupo = new Schema({
   nome: {
      type: String,
      required: true
   },
   slug: {
      type: String,
      required: true
   },
   grupo: {
      type: Schema.Types.ObjectId,
      ref: "grupos",
      required: true
   },
   date: {
      type: Date,
      default: Date.now()
   }
})

mongoose.model("subgrupos", Subgrupo)