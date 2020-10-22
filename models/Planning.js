const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Planning = new Schema({
    products: [{
        type: Schema.Types.ObjectId,
        ref: "requests",
        index: true
      }],
      site: {
        type: Schema.Types.ObjectId,
        ref: "customers",
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
