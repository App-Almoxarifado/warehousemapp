const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//CRIANDO O DOCUMENTO - ANÁLOGIA A TABELA NO BANCO DE DADOS
const Product = new Schema({
   //QRCODE
   qrcode: {
      type: String,
      required: false,
      lowercase: true,
      trim: true
   },
   //IMAGEM
   image: {
      type: String,
      required: false,
      trim: true,
      default: "https://warehousemapp.herokuapp.com/img/logo8.png"
   },
   //GRUPO
   group: {
      type: Schema.Types.ObjectId,
      ref: "groups",
      //required: true
   },
   //SUBGRUPO
   subgroup: {
      type: Schema.Types.ObjectId,
      ref: "subgroups",
      //required: true
   },
   //DESCRIÇÃO COMPLETA
   fullDescription: {
      type: String,
      //required: true,
      trim: true
   },
   //CODIGO ESTOQUE   
   stockCode: {
      type: String,
      //required: true,
      trim: true
   },
   //LOCAL SITE/OBRA
   client: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      //required: true
   },
   //LOCAÇÃO
   local: {
      type: Schema.Types.ObjectId,
      ref: "leases",
      //required: true
   },
   //SUBLOCAÇÃO
   sublease: {
      type: Schema.Types.ObjectId,
      ref: "subleases",
      //required: true
   },
   //BEM PATRIMONIAL
   patrimonialAsset: {
      type: String,
      required: false,
      trim: true
   },
   //DESCRIÇÃO
   description: {
      type: String,
      //required: true,
      trim: true
   },
   //FABRICANTE
   manufacturer: {
      type: String,
      required: false,
      trim: true
   },
   //MODELO
   model: {
      type: String,
      required: false,
      trim: true
   },
   //CAPACIDADE / ALCANCE
   capacityReach: {
      type: String,
      required: false,
      trim: true
   },
   //N DE SERIE
   serialNumber: {
      type: String,
      required: false,
      trim: true
   },
   //STATUS FISICO
   physicalStatus: {
      type: Schema.Types.ObjectId,
      ref: "status",
      //required: true
   },
   //TIPO DE EQUIPAMENTO
   kindOfEquipment: {
      type: Schema.Types.ObjectId,
      ref: "types",
      //required: true
   },
   //REQUER CERTIFICAÇÃO / CALIBRAÇÃO
   requiresCertificationCalibration: {
      type: String,
      required: false,
      trim: true
   },
   //QUANTIDADE ENTRADA
   inputAmount: {
      type: Number,
      required: false,
   },
   //QUANTIDADE SAIDA
   outputQuantity: {
      type: Number,
      required: false,
   },
   //UNIDADE
   unity: {
      type: Schema.Types.ObjectId,
      ref: "units",
      //required: true
   },
   //PESO KG
   weightKg: {
      type: Number,
      required: false,
   },
   //VALOR DE FACE
   faceValue: {
      type: Number,
      required: false,
   },
   //DIMENSÕES AXLXC
   dimensionsWxLxH: {
      type: String,
      required: false,
      trim: true
   },
   //CERTIFICADO
   certificate: {
      type: String,
      required: false,
      trim: true
   },
   //LABORATORIO / ENTIDADE
   entityLaboratory: {
      type: String,
      required: false,
      trim: true
   },
   //PERIODICIDADE
   frequency: {
      type: Schema.Types.ObjectId,
      ref: "breaks",
      //required: true
   },
   //DATA DE CALIBRAÇÃO
   calibrationDate: {
      type: String,
      required: false,
      trim: true
   },
   //VALIDADE CALIBRAÇÃO
   calibrationValidity: {
      type: String,
      required: false,
      trim: true
   },
   //STATUS DE CALIBRAÇÃO 
   calibrationStatus: {
      type: String,
      required: false,
      trim: true
   },
   //PO - PEDIDO DE COMPRA
   po: {
      type: String,
      required: false,
      trim: true
   },
   //CODIGO SAP
   sapCode: {
      type: String,
      required: false,
      trim: true
   },
   //CODIGO NCM
   ncmCode: {
      type: String,
      required: false,
      trim: true
   },
   //FORNECEDOR
   provider: {
      type: Schema.Types.ObjectId,
      ref: "providers",
      //required: true
   },
   //NOTA FISCAL
   invoce: {
      type: String,
      required: false,
      trim: true
   },
   //DATA DE RECEBIMENTO
   receivingDate: {
      type: String,
      required: false,
      trim: true
   },
   //OBSERVAÇÃO
   note: {
      type: String,
      required: false,
      trim: true
   },
   //STATUS ATIVO
   activeStatus: {
      type: String,
      //default: Date.now()
   },
   //DATA DE LANÇAMENTO
   releaseDateOf: {
      type: String,
      //default: Date.now()
   },
   //USUARIO LANÇAMENTO
   userLaunch: {
      type: String,
      //default: Date.now()
   },
   //EMAIL LANÇAMENTO
   emailLaunch: {
      type: String,
      //default: Date.now()
   },
   //DATA DE EDIÇÃO
   editionDate: {
      type: String,
      //default: Date.now()
   },
   //USUARIO DE EDIÇÃO
   userEdtion: {
      type: String,
      //required: true,
   },
   //EMAIL DE EDIÇÃO
   emailEdtion: {
      type: String,
      //required: true,
   },
   //N DO PEDIDO
   requestNumber: {
      type: String,
      //required: true,
   },
   //LOCAL SOLICITANTE
   requestLocation: {
      type: String,
      //required: true,
   },
   //USUARIO PEDIDO
   requestUser: {
      type: String,
      //required: true,
   },
   //EMAIL PEDIDO
   requestEmail: {
      type: String,
      //required: true,
   },
   //ORIGEM PEDIDO
   requestOrigin: {
      type: String,
      //required: true,
   },
   //RESPONSÁVEL
   responsibleSite: {
      type: String
      //required: true 
   },
   responsibleMaterial: {
      type: Schema.Types.ObjectId,
      ref: "collaborators",
      //required: true 
   },
   //ATIVOS CONTÁBEIS
   accountingAssets: {
      type: Boolean,
      default: "true"
   },
   //ACTIVE
   active: {
      type: Boolean,
      default: "true"
   },
   //VALOR TOTAL
   totalFaceValue: {
      type: Number
   },
   //PESO TOTAL
   totalWeightKg: {
      type: Number
   },
   //TAGS
   tags: [{
      type: String
   }]
})

mongoose.model("products", Product)