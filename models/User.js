const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const User = new Schema({
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
  password: {
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
  eAdmin: {
    type: Number,
    default: 0
  },
  eDevAdmin: {
    type: Number,
    default: 0
  },
  sites: [{
    type: Schema.Types.ObjectId,
    ref: "warehouses",
  }]
});

User.pre("save", function () {
  if (!this.image) {
    this.image = `${process.env.APP_URL}/files/${this.key}`;
  }
});

User.pre("remove", function () {
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


mongoose.model("users", User);
