const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//CRIANDO O DOCUMENTO - ANÁLOGIA A TABELA NO BANCO DE DADOS
const Product = new Schema({
   qrcode: {
      type: String,
      required: false,
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
      trim: true
   },
   description: {
      type: String,
      required: true,
      trim: true
   },
   manufacturer: {
      type: String,
      required: false,
      trim: true
   },
   model: {
      type: String,
      required: false,
      trim: true
   },
   capacityReach: {
      type: String,
      required: false,
      trim: true
   },
   serialNumber: {
      type: String,
      required: false,
      trim: true
   },
   physicalStatus: {
      type: Schema.Types.ObjectId,
      ref: "status",
      required: true
   },
   kindOfEquipment: {
      type: Schema.Types.ObjectId,
      ref: "types",
      required: true
   },
   requiresCertificationCalibration: {
      type: String,
      required: false,
      trim: true
   },
   inputAmount: {
      type: Number,
      required: false,
   },
   outputQuantity: {
      type: Number,
      required: false,
   },
   unity: {
      type: Schema.Types.ObjectId,
      ref: "units",
      required: true
   },
   weightKg: {
      type: Number,
      required: false,
   },
   faceValue: {
      type: Number,
      required: false,
   },
   dimensionsWxLxH: {
      type: String,
      required: false,
      index: true,
      trim: true
   },
   certificate: {
      type: String,
      required: false,
      index: true,
      trim: true
   },
   entityLaboratory: {
      type: String,
      required: false,
      index: true,
      trim: true
   },
   frequency: {
      type: Schema.Types.ObjectId,
      ref: "breaks",
      //required: true
   },
   calibrationDate: {
      type: String,
      required: false,
      trim: true
   },
   calibrationValidity: {
      type: String,
      required: false,
      trim: true
   },
   calibrationStatus: {
      type: String,
      required: false,
      trim: true
   },
   po: {
      type: String,
      required: false,
      trim: true
   },
   sapCode: {
      type: String,
      required: false,
      trim: true
   },
   ncmCode: {
      type: String,
      required: false,
      trim: true
   },
   provider: {
      type: Schema.Types.ObjectId,
      ref: "providers",
      //required: true
   },
   invoce: {
      type: String,
      required: false,
      trim: true
   },
   receivingDate: {
      type: String,
      required: false,
      trim: true
   },
   note: {
      type: String,
      required: false,
      trim: true
   },
   releaseDateOf: {
      type: String,
      //default: Date.now()
   },
   issueDate: {
      type: String,
      //default: Date.now()
   },
   userName: {
      type: String,
      //required: true,
   },
   userEmail: {
      type: String,
      //required: true,
   },
   requestNumber: {
      type: String,
      //required: true,
   },
   requestUser: {
      type: String,
      //required: true,
   },
   requestEmail: {
      type: String,
      //required: true,
   },
   active: {
      type: Boolean,
      default: "true"
   },
   totalFaceValue: {
      type:Number
   },
   totalWeightKg: {
      type:Number
   },
   tags: [{
      type: String
   }]
})

mongoose.model("products", Product)