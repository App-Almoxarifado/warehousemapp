const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//CRIANDO O DOCUMENTO - ANÁLOGIA A TABELA NO BANCO DE DADOS
const Product = new Schema({
   qrcode: {
      type: String,
      required: false,
      index: true,
      lowercase: true,
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
   fullDescription: {
      type: String,
      required: true,
      index: true,
      trim: true
   },
   client: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true
   },
   local: {
      type: Schema.Types.ObjectId,
      ref: "leases",
      required: true
   },
   sublease: {
      type: Schema.Types.ObjectId,
      ref: "subleases",
      required: true
   },
   patrimonialAsset: {
      type: String,
      required: false,
      index: true,
      trim: true
   },
   description: {
      type: String,
      required: true,
      index: true,
      trim: true
   },
   manufacturer: {
      type: String,
      required: false,
      index: true,
      trim: true
   },
   model: {
      type: String,
      required: false,
      index: true,
      trim: true
   },
   capacityReach: {
      type: String,
      required: false,
      index: true,
      trim: true
   },
   serialNumber: {
      type: String,
      required: false,
      index: true,
      trim: true
   },
   physicalStatus: {
      type: Schema.Types.ObjectId,
      ref: "status",
      required: true
   },
   kindOfEquipment: {
      type: Schema.Types.ObjectId,
      ref: "status",
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
   },
   tags: [{
      type: String
   }]
})

mongoose.model("products", Product)