const mongoose = require("mongoose")
require("../models/Product")
const Product = mongoose.model("products")
require("../models/Group")
const Group = mongoose.model("groups")
require("../models/Subgroup")
const Subgroup = mongoose.model("subgroups")
require("../models/Client")
const Client = mongoose.model("customers")
require("../models/Location")
const Location = mongoose.model("leases")
require("../models/Sublease")
const Sublease = mongoose.model("subleases")
require("../models/Status")
const Status = mongoose.model("status")
require("../models/Type")
const Type = mongoose.model("types")
require("../models/Unity")
const Unity = mongoose.model("units")
require("../models/Interval")
const Interval = mongoose.model("breaks")
require("../models/Provider")
const Provider = mongoose.model("providers")
require("../models/Collaborator")
const Collaborator = mongoose.model("collaborators")

//PRODUTOS POR LISTA
exports.getList = async(req, res) => {
    try {
        const filtros = [];
        let {
            search,
            page
        } = req.query;
        if (search) {
            const pattern = new RegExp(`.*${search}.*`)
            filtros.push({
                qrcode: {
                    $regex: pattern
                }
            })
            filtros.push({
                description: {
                    $regex: pattern
                }
            })
            filtros.push({
                user: {
                    $regex: pattern
                }
            })
            filtros.push({
                tags: {
                    $regex: pattern
                }
            })
        }

        page = page || 1;

        const total = await Product
            .find({}).count()

        const totalOk = await Product
            .find({ physicalStatus: "5f01252e038643547805dbeb" }).count()

        const totalBad = await Product
            .find({ physicalStatus: "5f01252e038643547805dbed" }).count()

        const totalMaintenance = await Product
            .find({ physicalStatus: "5f01252e038643547805dbec" }).count()

        const totalCalibration = await Product
            .find({ requiresCertificationCalibration: "Sim" }).count()

        const totalActive = await Product
            .find({ accountingAssets: "true" }).count()

        const group01 = await Product
            .find({ group: "5ef5b7baf96c3802ec2aad09" }).count()

        const group02 = await Product
            .find({ group: "5ef5b7baf96c3802ec2aad0a" }).count()

        const group03 = await Product
            .find({ group: "5ef5b7baf96c3802ec2aad0b" }).count()

        const group04 = await Product
            .find({ group: "5ef5b7baf96c3802ec2aad0c" }).count()

        const group05 = await Product
            .find({ group: "5ef5b7baf96c3802ec2aad0d" }).count()

        const group06 = await Product
            .find({ group: "5ef5b7baf96c3802ec2aad0e" }).count()

        const quant = await Product
            .find(filtros.length > 0 ? {
                $or: filtros
            } : {}).estimatedDocumentCount()

        var products = await Product
            .find(filtros.length > 0 ? {
                $or: filtros
            } : {})
            .sort({
                editionDate: "desc"
            })
            .limit(3)
            .skip(page && Number(page) > 1 ? Number(page - 1) * 3 : 0)
            .populate("group")
            .populate("subgroup")
            .populate("client")
            .populate("local")
            .populate("sublease")
            .populate("physicalStatus")
            .populate("kindOfEquipment")
            .populate("kindOfEquipment")
            .populate("unity")
            .populate("frequency")
            .populate("provider")
            .populate("userLaunch")
            .populate("userEdition")

        res.render("products/products", {
            products: products.map(products => products.toJSON()),
            prev: Number(page) > 1,
            next: Number(page) * 3 < quant,
            page,
            total,
            totalOk,
            totalBad,
            totalMaintenance,
            totalCalibration,
            totalActive,
            group01,
            group02,
            group03,
            group04,
            group05,
            group06
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/products/products")
    }
}


//PRODUTOS POR TABELA
exports.getListTable = async(req, res) => {
    try {
        var cod = Date.now()
        const filtros = [];
        let {
            search,
            page
        } = req.query;
        if (search) {
            const pattern = new RegExp(`.*${search}.*`)
            filtros.push({
                qrcode: {
                    $regex: pattern
                }
            })
            filtros.push({
                description: {
                    $regex: pattern
                }
            })
            filtros.push({
                user: {
                    $regex: pattern
                }
            })
            filtros.push({
                tags: {
                    $regex: pattern
                }
            })
        }

        page = page || 1;

        const quant = await Product
            .find(filtros.length > 0 ? {
                $or: filtros
            } : {}).estimatedDocumentCount()

        const total = await Product
            .find({}).count()

        var products = await Product
            .find(filtros.length > 0 ? {
                $or: filtros
            } : {})
            .sort({
                fullDescription: "asc"
            })
            .limit(5)
            .skip(page && Number(page) > 1 ? Number(page - 1) * 5 : 0)
            .populate("group")
            .populate("subgroup")
            .populate("client")
            .populate("physicalStatus")
            .populate("kindOfEquipment")
            //.populate("calibrationStatus")
        res.render("products/productstables", {
            products: products.map(products => products.toJSON()),
            prev: Number(page) > 1,
            next: Number(page) * 5 < quant,
            quant,
            total,
            cod,
            page
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/products/products")
    }
}