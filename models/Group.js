const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const Group = new Schema({
   //QRCODE
   qrcode: {
    type: String,
    lowercase: true,
    required: false,
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
  //DESCRIÇÃO
  description: {
    type: String,
    required: true,
  },
  //DATA DE LANÇAMENTO
  releaseDateOf: {
    type: String,
    //default: Date.now()
  },
  //USUARIO LANÇAMENTO
  userLaunch: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    index: true
    //required: true
  },
  //EMAIL LANÇAMENTO
  emailLaunch: {
    type: String,
    //default: Date.now()
  },
  //DATA DE EDIÇÃO
  editionDate: {
    type: String,
    //default: Date.now()
  },
  //USUARIO DE EDIÇÃO
  userEdtion: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    index: true
    //required: true
  },
  //EMAIL DE EDIÇÃO
  emailEdtion: {
    type: String,
    //required: true,
  },
  active: {
    type: Boolean,
    default: "true",
  }
});

Group.pre("save", function () {
  if (!this.image) {
    this.image = `${process.env.APP_URL}/files/${this.key}`;
  }
});

Group.pre("remove", function () {
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


mongoose.model("groups", Group);
