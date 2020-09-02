const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Usuario = new Schema({
  name: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  nome: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  senha: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: "true",
  },
  admin: {
    type: Boolean,
    default: false
  },
  sites: [{
    type: Schema.Types.ObjectId,
    ref: "customers"
  }]
});
mongoose.model("usuarios", Usuario);
