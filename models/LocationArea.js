const mongoose = require("mongoose");
//const mongoosePaginate = require("mongoose-paginate")

const Schema = mongoose.Schema;

const LocationArea = new Schema({
  qrcode: {
    type: String,
    lowercase: true,
    required: false,
  },
  image: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now(),
  },
  user: {
    type: String,
    default: "Daniel Soares de Albuquerque",
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
//Location.plugin(mongoosePaginate);
mongoose.model("rentalAreas", LocationArea);
