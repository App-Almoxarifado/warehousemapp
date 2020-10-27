const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const Warehouse = new Schema({
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
  //DESCRIÇÃO
  description: {
    type: String,
    required: true,
    trim: true
  },
  //DESCRIÇÃO DE ACORDO COM O SAP
  sapName: {
    type: String,
    //required: true,
    trim: true
  },
  //CENTRO DE CUSTO
  costCenter: {
    type: String,
    //required: true,
    trim: true
  },
  //PLANTA DO PROJETO
  plant: {
    type: String,
    //required: true,
    trim: true
  },
  //CLIENTE DA OBRA
  client: {
    type: String,
    //required: true,
    trim: true
  },
  //ENDEREÇO COMPLETO
  address: {
    type: String,
    //required: true,
    trim: true
  },
  //CEP DO CLIENTE
  cep: {
    type: String,
    //required: true,
    trim: true
  },
  //LOGRADOURO DO CLIENTE
  logradouro: {
    type: String,
    //required: true,
    trim: true
  },
  //BAIRRO DO CLIENTE
  bairro: {
    type: String,
    //required: true,
    trim: true
  },
  //COMPLEMENTO DO ENDEREÇO DO CLIENTE
  complemento: {
    type: String,
    //required: true,
    trim: true
  },
  //CIDADE
  cidade: {
    type: String,
    //required: true,
    trim: true
  },
  //ESTADO - UF
  uf: {
    type: String,
    //required: true,
    trim: true
  },
  //NÚMERO
  number: {
    type: String,
    //required: true,
    trim: true
  },
  //IC
  ic: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    index: true
    //required: true
  },
  //IC EMAIL
  icEmail: {
    type: String,
    lowercase: true,
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
  //TAG
  tag: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
});

Warehouse.pre("save", function () {
  if (!this.image) {
    this.image = `${process.env.APP_URL}/files/${this.key}`;
  }
});

Warehouse.pre("remove", function () {
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


mongoose.model("warehouses", Warehouse);
