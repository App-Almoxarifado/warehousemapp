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


//VIZUALIZANDO DASHBOARD
exports.getDashboard = async (req, res) => {
    try {
        var customers = await Client.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()

        var groups = await Group.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()

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

        var products = await Product
            .find(filtros.length > 0 ? {
                $or: filtros
            } : {})
            .sort({
                editionDate: "desc"
            })
            .limit(15)
            .skip(page && Number(page) > 1 ? Number(page - 1) * 15 : 0)
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
            .populate("unity")
            .populate("frequency")
            .populate("provider")

        res.render("dashboards/dashboards", {
            products: products.map(products => products.toJSON()),
            prev: Number(page) > 1,
            next: Number(page) * 15 < quant,
            customers: customers,
            groups: groups,
            page,
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/products/products")
    }
}


//VIZUALIZANDO DASHBOARD MOBILE
exports.getDashboardMobile = async (req, res) => {
    try {
        var customers = await Client.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()

        var groups = await Group.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()

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

        var products = await Product
            .find(filtros.length > 0 ? {
                $or: filtros
            } : {})
            .sort({
                editionDate: "desc"
            })
            .limit(5)
            .skip(page && Number(page) > 1 ? Number(page - 1) * 5 : 0)
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
            .populate("unity")
            .populate("frequency")
            .populate("provider")

        res.render("dashboards/mobile", {
            products: products.map(products => products.toJSON()),
            prev: Number(page) > 1,
            next: Number(page) * 5 < quant,
            customers: customers,
            groups: groups,
            page,
        })
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/products/products")
    }
}