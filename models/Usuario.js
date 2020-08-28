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
  eAdmin: {
    type: Number,
    default: 0,
  },
  eDevAdmin: {
    type: Number,
    default: 0,
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
});
mongoose.model("usuarios", Usuario);
