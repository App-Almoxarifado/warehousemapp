const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const Request = new Schema({
  //IMAGEM
  image: {
    type: String,
    require: true,
    default: "https://warehousemapp.s3.amazonaws.com/logo8.png"
  },
  //IMAGEM
  key: {
    type: String,
    require: true,
  },
  //DESCRIÇÃO
  description: {
    type: String,
    require: true,
  },
  //QTD EM ESTOQUE
  qtyStock: {
    type: Number,
    default: 0
  },
  //QTD RESERVADA
  qtyReservation: {
    type: Number,
    default: 0
  },
  //QTD REQUISITADA
  qtyRequest: {
    type: Number,
    //default: 0
  },
  tag: {
    type: String,
    lowercase: true,
    index: true,
  },
  note: {
    type: String,
    index: true,
  },
  warehouse: {
    type: Schema.Types.ObjectId,
    ref: "warehouses",
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    index: true,
  },
  requestNumber: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Em Andamento",
  },
});

Request.pre("save", function () {
  if (!this.image) {
    this.image = `${process.env.APP_URL}/files/${this.key}`;
  }
});

Request.pre("remove", function () {
  if (process.env.STORAGE_TYPE === "s3") {
    return s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: this.key,
      })
      .promise()
      .then((response) => {
        console.log(response.status);
      })
      .catch((response) => {
        console.log(response.status);
      });
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, "..", "tmp", "uploads", this.key)
    );
  }
});

mongoose.model("requests", Request);
