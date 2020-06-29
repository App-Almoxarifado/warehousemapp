const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//CRIANDO O DOCUMENTO - ANÁLOGIA A TABELA NO BANCO DE DADOS
const Subgroup = new Schema({
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
   }
})

mongoose.model("subgroups", Subgroup)