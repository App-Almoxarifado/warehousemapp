const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const Post = new Schema({
  /*   
   //NOME ORIGINAL DA IMAGEM
   name: {
     type: String,
   },
   //TAMANHO DA IMAGEM
   size: {
     type: Number,
   },
   //NOME GERADO JUNTO COM O HASH
   key: {
     type: String,
   },
   //S3 URL QUE A IMAGEM ESTÁ CONTIDA
   url: {
     type: String,
     //default: Date.now()
   },
   //DATA QUE O REGISTRO FOI CRIADO
   createAt: {
     type: Date,
     default:Date.now,
   },
   */
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

Post.pre("save", function () {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`;
  }
});

Post.pre("remove", function () {
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




mongoose.model("posts", Post);