const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Client = new Schema({
  qrcode: {
    type: String,
    lowercase: true,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  initials: {
    type: String,
    required: true,
  },
  costCenter: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  socialReason: {
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
  ie: {
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
  complemento: {
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
  date: {
    type: String,
    default: Date.now(),
  },
  ic: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    required: true,
  },
  pm: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    required: true,
  },
  responsibleMaterial: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    required: true,
  },
  active: {
    type: Boolean,
    default: "true",
  },
  tags: [
    {
      type: String,
    },
  ],
});

mongoose.model("customers", Client);
