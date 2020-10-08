const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

//CRIANDO O DOCUMENTO - ANÁLOGIA A TABELA NO BANCO DE DADOS
const Product = new Schema({
  //QRCODE
  qrcode: {
    type: String,
    lowercase: true,
    required: false,
  },
  //IMAGEM
  image: {
    type: String,
    require: true,
  },
  //IMAGEM
  key: {
    type: String,
    require: true,
  },
  //GRUPO
  group: {
    type: Schema.Types.ObjectId,
    ref: "groups",
    index: true
    //required: true
  },
  //SUBGRUPO
  subgroup: {
    type: Schema.Types.ObjectId,
    ref: "subgroups",
    index: true
    //required: true
  },
  //DESCRIÇÃO COMPLETA
  fullDescription: {
    type: String,
    //required: true,
    trim: true,
  },
  //CODIGO ESTOQUE
  stockCode: {
    type: String,
    //required: true,
    trim: true,
  },
  //LOCAL SITE/OBRA
  client: {
    type: Schema.Types.ObjectId,
    ref: "customers",
    index: true
    //required: true
  },
  //ÁREA DE LOCAÇÃO LOCAÇÃO
  localArea: {
    type: Schema.Types.ObjectId,
    ref: "rentalareas",
    index: true
    //required: true
  },
  //LOCAÇÃO
  local: {
    type: Schema.Types.ObjectId,
    ref: "leases",
    index: true
    //required: true
  },
  //SUBLOCAÇÃO
  sublease: {
    type: Schema.Types.ObjectId,
    ref: "subleases",
    index: true
    //required: true
  },
  //BEM PATRIMONIAL
  patrimonialAsset: {
    type: String,
    trim: true,
  },
  //DESCRIÇÃO
  description: {
    type: Schema.Types.ObjectId,
    ref: "items",
    index: true
    //required: true
  },
  //FABRICANTE
  manufacturer: {
    type: String,
    trim: true,
  },
  //MODELO
  model: {
    type: String,
    trim: true,
  },
  //CAPACIDADE / ALCANCE
  capacityReach: {
    type: Schema.Types.ObjectId,
    ref: "items",
    index: true
    //required: true
  },
  //N DE SERIE
  serialNumber: {
    type: String,
    trim: true,
  },
  //STATUS FISICO
  physicalStatus: {
    type: Schema.Types.ObjectId,
    ref: "status",
    index: true
    //required: true
  },
  //TIPO DE EQUIPAMENTO
  kindOfEquipment: {
    type: Schema.Types.ObjectId,
    ref: "types",
    index: true
    //required: true
  },
  //REQUER CERTIFICAÇÃO / CALIBRAÇÃO
  requiresCertificationCalibration: {
    type: String,
    trim: true,
  },
  //QUANTIDADE ENTRADA
  inputAmount: {
    type: Number,
  },
  //QUANTIDADE ENTRADA NO SITE
  inputAmountSite: {
    type: Number,
  },
  //QUANTIDADE SAIDA
  outputQuantity: {
    type: Number,
  },
  //QUANTIDADE ESTOQUE
  stockQuantity: {
    type: Number,
  },
  //QUANTIDADE ESTOQUE TOTAL
  stockTotal: {
    type: Number,
  },
  //UNIDADE
  unity: {
    type: Schema.Types.ObjectId,
    ref: "unitys",
    index: true
    //required: true
  },
  //PESO KG
  weightKg: {
    type: Number,
  },
  //VALOR DE FACE
  faceValue: {
    type: Number,
  },
  //DIMENSÕES AXLXC
  dimensionsWxLxH: {
    type: String,
    trim: true,
  },
  //CERTIFICADO
  certificate: {
    type: String,
    trim: true,
  },
  //LABORATORIO / ENTIDADE
  entityLaboratory: {
    type: String,
    trim: true,
  },
  //PERIODICIDADE
  frequency: {
    type: Schema.Types.ObjectId,
    ref: "breaks",
    index: true
    //required: true
  },
  //DATA DE CALIBRAÇÃO
  calibrationDate: {
    type: String,
    trim: true,
  },
  //VALIDADE CALIBRAÇÃO
  calibrationValidity: {
    type: String,
    trim: true,
  },
  //STATUS DE CALIBRAÇÃO
  calibrationStatus: {
    type: String,
    trim: true,
  },
  //PO - PEDIDO DE COMPRA
  po: {
    type: String,
    trim: true,
  },
  //CODIGO SAP
  sapCode: {
    type: String,
    trim: true,
  },
  //CODIGO NCM
  ncmCode: {
    type: String,
    trim: true,
  },
  //FORNECEDOR
  provider: {
    type: Schema.Types.ObjectId,
    ref: "providers",
    index: true
    //required: true
  },
  //NOTA FISCAL
  invoce: {
    type: String,
    trim: true,
  },
  //DATA DE RECEBIMENTO
  receivingDate: {
    type: String,
    trim: true,
  },
  //OBSERVAÇÃO
  note: {
    type: String,
    trim: true,
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
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    index: true
    //required: true
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
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    index: true
    //required: true
  },
  //EMAIL DE EDIÇÃO
  emailEdtion: {
    type: String,
    //required: true,
  },
  //ACTIVE
  active: {
    type: String,
    default: "true",
  },
  //TAGS
    tags: [{
      type: String,
    }],
});

Product.pre("save", function () {
  if (!this.image) {
    this.image = `${process.env.APP_URL}/files/${this.key}`;
  }
});

Product.pre("remove", function () {
  if (process.env.STORAGE_TYPE === "s3") {
    return s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: this.key
      })
      .promise()
      .then(response => {
        console.log(response.status);
      })
      .catch(response => {
        console.log(response.status);
      });
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, "..", "tmp", "uploads", this.key)
    );
  }
});


mongoose.model("products", Product);
