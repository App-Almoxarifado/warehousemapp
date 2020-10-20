const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Request = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
    index: true
  },
  qty: {
    type: Number,
    //required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: "true",
  },
});

mongoose.model("requests", Request);
