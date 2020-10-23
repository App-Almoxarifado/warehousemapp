const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const Request = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
    index: true
  },
  //IMAGEM
  image: {
    type: String,
    require: true,
  },
  //IMAGEM
  key: {
    type: String,
    require: true,
  },
  qty: {
    type: Number,
    //required: true
  },
  tag: {
    type: String,
    lowercase: true,
    index: true
  },
  note: {
    type: String,
    index: true
  },
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
        Key: this.key
      })
      .promise()
      .then(response => {
        console.log(response.status);
      })
      .catch(response => {
        console.log(response.status);
      });
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, "..", "tmp", "uploads", this.key)
    );
  }
});

mongoose.model("requests", Request);
