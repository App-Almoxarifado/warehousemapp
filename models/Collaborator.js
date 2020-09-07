const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Collaborator = new Schema({
  qrcode: {
    type: String,
    lowercase: true,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  registration: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  contractor: {
    type: Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cpfCnpj: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cep: {
    type: String,
    required: true,
  },
  logradouro: {
    type: String,
    required: true,
  },
  bairro: {
    type: String,
    required: true,
  },
  cidade: {
    type: String,
    required: true,
  },
  uf: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
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

mongoose.model("collaborators", Collaborator);
