const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Type = new Schema({
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
  //DESCRIÇÃO
  description: {
    type: String,
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

mongoose.model("types", Type);
