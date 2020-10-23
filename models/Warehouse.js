const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Warehouse = new Schema({
  //DESCRIÇÃO
  description: {
    type: Schema.Types.ObjectId,
    ref: "products",
    index: true
    //required: true
  },
  //FABRICANTE  
  manufacturer: {
    type: String,
  },
  //MODELO
  model: {
    type: String,
  },
  //OBRA
  site: {
    type: Schema.Types.ObjectId,
    ref: "customers",
    index: true
  },
  //QUANTIDADE
  qty: {
    type: Number,
    //default: Date.now()
  },
  //USUARIO LANÇAMENTO
  userCreated: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    index: true
    //required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  //ATIVO?
  active: {
    type: Boolean,
    default: "true",
  }
});


mongoose.model("warehouses", Warehouse);
