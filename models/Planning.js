const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Planning = new Schema({
    product: [{
        type: Schema.Types.ObjectId,
        ref: "requests",
        index: true
      }],
      request: {
        type: Schema.Types.ObjectId,
        ref: "products",
        index: true
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
      status: {
        type: String,
        default: "Processado",
      },
});

mongoose.model("plannings", Planning);
