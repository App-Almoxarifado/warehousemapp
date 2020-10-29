const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const Product = new Schema({
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
  //ARMAZEN OBRA
  warehouse: {
    type: Schema.Types.ObjectId,
    ref: "warehouses",
    index: true
    //required: true
  },
  //ÁREA DE ARMAZENAMENTO
  area: {
    type: Schema.Types.ObjectId,
    ref: "areas",
    index: true
    //required: true
  },
  //LOCAÇÃO
  location: {
    type: Schema.Types.ObjectId,
    ref: "locations",
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
  //STATUS DO EQUIPAMENTO
  status: {
    type: Schema.Types.ObjectId,
    ref: "statuses",
    index: true
    //required: true
  },
  //TIPO DE EQUIPAMENTO
  type: {
    type: Schema.Types.ObjectId,
    ref: "types",
    index: true
    //required: true
  },
  //PADRÃO DE UNIDADE
  unity: {
    type: Schema.Types.ObjectId,
    ref: "unitys",
    index: true
    //required: true
  },
  //INTERVALO DE CALIBRAÇÃO
  interval: {
    type: Schema.Types.ObjectId,
    ref: "intervals",
    index: true
    //required: true
  },
  //FORNECEDOR
  provider: {
    type: Schema.Types.ObjectId,
    ref: "providers",
    index: true
    //required: true
  },
  //DESCRIÇÃO DO PRODUTO
  description: {
    type: String,
    //required: true,
    trim: true
  },
  //DESCRIÇÃO COMPLETA DO PRODUTO
  fullDescription: {
    type: String,
    //required: true,
    trim: true
  },
  //TAG
  tag: {
    type: String,
    //required: true,
    lowercase: true,
    trim: true
  },
  //TAG PESQUISA
  tagSearch: {
    type: String,
    //required: true,
    lowercase: true,
    trim: true
  },
  //PATRIMONIO DO PRODUTO
  patrimony: {
    type: String,
    //required: true,
    trim: true
  },
  //PATRIMONIO HBS DO PRODUTO
  hbsCode: {
    type: String,
    //required: true,
    trim: true
  },
  //NOME DO PRODUTO
  name: {
    type: String,
    //required: true,
    trim: true
  },
  //FABRICANTE DO PRODUTO
  manufacturer: {
    type: String,
    //required: true,
    trim: true
  },
  //MODELO DO PRODUTO
  model: {
    type: String,
    //required: true,
    trim: true
  },
  //CAPACIDADE/ALCANCE DO PRODUTO
  capacityReach: {
    type: String,
    //required: true,
    trim: true
  },
  //N° DE SÉRIE DO PRODUTO
  serialNumber: {
    type: String,
    //required: true,
    trim: true
  },
  //REQUER CERTIFICAÇÃO?
  requiresCertification: {
    type: String,
    //required: true,
    trim: true
  },
  //QTD EM ESTOQUE
  qtyStock: {
    type: Number,
    default: 0
  },
  //QTD RESERVADA
  qtyReservation: {
    type: Number,
    default: 0
  },
  //QTD REQUISITADA
  qtyRequest: {
    type: Number,
    default: 0
  },
  //PESO KG
  weightKg: {
    type: Number,
    default: 0
  },
  //VALOR DE FACE
  faceValue: {
    type: Number,
    default: 0
  },
  //DIMENSÕES DO PRODUTO
  dimensionsWxLxH: {
    type: String,
    //required: true,
    trim: true
  },
  //CERTIFICADO
  certificate: {
    type: String,
    //required: true,
    trim: true
  },
  //ENTIDADE LABORATÓRIO CERTIFICAÇÃO
  entityLaboratory: {
    type: String,
    //required: true,
    trim: true
  },
  //DATA DA CERTIFICAÇÃO
  calibrationDate: {
    type: String,
    //required: true,
    trim: true
  },
  //DATA DE VENCIMENTO CERTIFICAÇÃO
  calibrationValidity: {
    type: String,
    //required: true,
    trim: true
  },
  //STATUS CALIBRAÇÃO
  calibrationStatus: {
    type: String,
    //required: true,
    trim: true
  },
  //PEDIDO DE COMPRA
  po: {
    type: String,
    //required: true,
    trim: true
  },
  //CÓDIGO SAP
  sapCode: {
    type: String,
    //required: true,
    trim: true
  },
  //CÓDIGO NCM
  ncmCode: {
    type: String,
    //required: true,
    trim: true
  },
  //NF RECEBIMENTO
  invoce: {
    type: String,
    //required: true,
    trim: true
  },
  //DATA NF RECEBIMENTO
  receivingDate: {
    type: String,
    //required: true,
    trim: true
  },
  //OBSERVAÇÃO
  note: {
    type: String,
    //required: true,
    trim: true
  },
  //DATA MOBILIZAÇÃO
  mobilization: {
    type: String,
    //required: true,
    trim: true
  },
  //DATA DESMOBILIZAÇÃO
  demobilization: {
    type: String,
    //required: true,
    trim: true
  },
  //NF MOBILIZAÇÃO
  invoiceMobilization: {
    type: String,
    //required: true,
    trim: true
  },
  //NF DESMOBILIZAÇÃO
  invoiceDemobilization: {
    type: String,
    //required: true,
    trim: true
  },
  //DATA DE LANÇAMENTO
  createdAt: {
    type: Date,
    default: Date.now()
  },
  //USUARIO LANÇAMENTO
  userCreated: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    index: true
    //required: true
  },
  //EMAIL LANÇAMENTO
  emailCreated: {
    type: String,
    lowercase: true,
  },
  //DATA DE EDIÇÃO
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  //USUARIO DE EDIÇÃO
  userUpdated: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    index: true
    //required: true
  },
  //EMAIL DE EDIÇÃO
  emailUpdated: {
    type: String,
    lowercase: true,
  },
  active: {
    type: Boolean,
    default: "true",
  },

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
