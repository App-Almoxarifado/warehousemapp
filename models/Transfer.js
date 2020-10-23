const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Transfer = new Schema({
  createdAt: {
    type: String,
    default: Date.now(),
  },
  deliveryDate: {
    type: String,
    default: Date.now(),
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "customers",
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "products",
      },
      quant: Number,
    },
  ],
});

mongoose.model("transfers", Transfer);
