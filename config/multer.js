const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "tmp", "uploads"));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(8, (err, hash) => {
                if (err) cb(err);

                file.key = `${hash.toString("hex")}-${file.originalname}`;

                cb(null, file.key);
            });
        }
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: (req, file, cb) => {
            crypto.randomBytes(8, (err, hash) => {
                if (err) cb(err);

                const fileName = `${hash.toString("hex")}-${file.originalname}`;

                cb(null, fileName);
            });
        }
    })
};


  if (process.env.NODE_ENV == "production") {  
module.exports = {
    dest: path.resolve(__dirname, "..", "tmp", "uploads"),
    storage: storageTypes[process.env.STORAGE_TYPE_S3],
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "application/zip",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type."));
        }
    }
}

} else {

    module.exports = {
        dest: path.resolve(__dirname, "..", "tmp", "uploads"),
        storage: storageTypes[process.env.STORAGE_TYPE_LOCAL],
        limits: {
            fileSize: 2 * 1024 * 1024
        },
        fileFilter: (req, file, cb) => {
            const allowedMimes = [
                "image/jpeg",
                "image/pjpeg",
                "image/png",
                "application/zip",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    
            ];
    
            if (allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error("Invalid file type."));
            }
        }
    }
}