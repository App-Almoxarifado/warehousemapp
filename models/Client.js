const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const Client = new Schema({
  qrcode: {
    type: String,
    lowercase: true,
    required: false,
  },
  image: {
    type: String,
    required: false,
    trim:true
  },
  //IMAGEM
  key: {
    type: String,
    //require: true,
    trim:true
  },
  description: {
    type: String,
    required: true,
    trim:true
  },
  initials: {
    type: String,
    //required: true,
    trim:true
  },
  costCenter: {
    type: String,
    //required: true,
    trim:true
  },
  name: {
    type: String,
    required: true,
    trim:true
  },
  email: {
    type: String,
    required: true,
    trim:true
  },
  socialReason: {
    type: String,
    //required: true,
    trim:true
  },
  phone: {
    type: String,
    required: true,
    trim:true
  },
  cpfCnpj: {
    type: String,
    required: true,
    trim:true
  },
  ie: {
    type: String,
    required: true,
    trim:true
  },
  address: {
    type: String,
    required: true,
    trim:true
  },
  cep: {
    type: String,
    required: true,
    trim:true
  },
  logradouro: {
    type: String,
    required: true,
    trim:true
  },
  bairro: {
    type: String,
    required: true,
    trim:true
  },
  complemento: {
    type: String,
    required: true,
    trim:true
  },
  cidade: {
    type: String,
    required: true,
    trim:true
  },
  uf: {
    type: String,
    required: true,
    trim:true
  },
  number: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    default: Date.now(),
  },
  ic: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    required: true,
  },
  icEmail: {
    type: String,
    trim:true
  },
  pm: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    required: true,
  },
  pmEmail: {
    type: String,
    trim:true
  },
  responsibleMaterial: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    required: true,
  },
  responsibleMaterialEmail: {
    type: String,
    trim:true
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
  active: {
    type: Boolean,
    default: "true",
  },
});

Client.pre("save", function () {
  if (!this.image) {
    this.image = `${process.env.APP_URL}/files/${this.key}`;
  }
});

Client.pre("remove", function () {
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

mongoose.model("customers", Client);
