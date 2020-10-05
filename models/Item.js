const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const Type = new Schema({

    //CÓDIGO ESTOQUE
    stockCode: {
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
    //GRUPO
    group: {
        type: Schema.Types.ObjectId,
        ref: "groups",
        index: true
        //required: true
    },
    //SUBGRUPO
    subgroup: {
        type: Schema.Types.ObjectId,
        ref: "subgroups",
        index: true
        //required: true
    },
    //DESCRIÇÃO
    description: {
        type: String,
        required: true,
    },
    //CAPACIDADE / ALCANCE
    capacityReach: {
        type: String,
        trim: true,
    },  
    //DESCRIÇÃO COMPLETA
    fullDescription: {
        type: String,
        //required: true,
        trim: true,
    },
    //TIPO DE EQUIPAMENTO
    kindOfEquipment: {
        type: Schema.Types.ObjectId,
        ref: "types",
        index: true
        //required: true
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
    },
});

Type.pre("save", function () {
    if (!this.image) {
        this.image = `${process.env.APP_URL}/files/${this.key}`;
    }
});

Type.pre("remove", function () {
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


mongoose.model("types", Type);
