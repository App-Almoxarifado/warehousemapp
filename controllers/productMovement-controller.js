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

//MOVIMENTAÇÃO INTERNA
exports.getCreateMove = async (req, res) => {

    try {
        var product = await Product.findOne({
            _id: req.params.id
        }).lean()
        var products = await Product.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()
        var groups = await Group.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()
        var subgroups = await Subgroup.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()
        var customers = await Client.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()
        var leases = await Location.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()
        var subleases = await Sublease.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()
        var status = await Status.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()
        var types = await Type.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()
        var units = await Unity.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()
        var breaks = await Interval.find({
            active: true
        }).sort({
            description: "asc"
        }).lean()
        var providers = await Provider.find({
            active: true
        }).sort({
            name: "asc"
        }).lean()
        var collaborators = await Collaborator.find({
            active: true
        }).sort({
            name: "asc"
        }).lean()
        res.render("products/moveproducts", {
            user: req.user,
            products: products,
            groups: groups,
            subgroups: subgroups,
            customers: customers,
            leases: leases,
            subleases: subleases,
            status: status,
            types: types,
            units: units,
            breaks: breaks,
            providers: providers,
            product: product,
            collaborators: collaborators
        })

    } catch (_err) {
        req.flash("error_msg", "Ops, Houve um erro interno!")
        res.redirect("/products")
    }
}

exports.postCreateMove = async (req, res, next) => {
    //let endImg = "https://warehousemapp.herokuapp.com/uploads/"
    var erros = []
    if (req.body.group == "0") {
        erros.push({
            texto: "Grupo inválido, registre um grupo"
        })
    }
    if (req.body.subgroup == "0") {
        erros.push({
            texto: "Subgrupo inválido, registre um subgrupo"
        })
    }
    if (req.body.client == "0") {
        erros.push({
            texto: "Site inválido, registre um cliente"
        })
    }
    if (req.body.local == "0") {
        erros.push({
            texto: "Locação inválida, registre um local"
        })
    }
    if (req.body.sublease == "0") {
        erros.push({
            texto: "Sublocação inválida, registre um sublocação"
        })
    }
    if (req.body.physicalStatus == "0") {
        erros.push({
            texto: "Status inválido, registre um status"
        })

    }
    if (req.body.kindOfEquipment == "0") {
        erros.push({
            texto: "Tipo de equipamento inválido, registre um tipo de equipamento"
        })

    }

    if (req.body.unity == "0") {
        erros.push({
            texto: "Unidade inválida, registre uma unidade"
        })

    }

    if (req.body.frequency == "0") {
        erros.push({
            texto: "Periodicidade inválida, registre uma periodicidade"
        })

    }

    if (req.body.provider == "0") {
        erros.push({
            texto: "Fornecedor inválido, registre um fornecedor"
        })

    }

    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        erros.push({
            texto: "Descricão Inválida"
        })
    }

    if (!req.body.group || typeof req.body.group == undefined || req.body.group == null) {
        erros.push({
            texto: "Grupo Inválido"
        })
    }

    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do produto muito pequena!"
        })
    }
    if (erros.length > 0) {
        res.render("products/takeproducts", {
            erros: erros
        })
    } else {
        try {
            const products = new Product({
                qrcode: req.body.patrimonialAsset
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                    .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                    .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                    .replace(/(^-+|-+$)/, '') +
                    req.body.description
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                        .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                        .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                        .replace(/(^-+|-+$)/, '') +
                    req.body.manufacturer
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                        .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                        .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                        .replace(/(^-+|-+$)/, '') +
                    req.body.model
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                        .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                        .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                        .replace(/(^-+|-+$)/, '') +
                    req.body.capacityReach
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                        .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                        .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                        .replace(/(^-+|-+$)/, '') +
                    req.body.serialNumber
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                        .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                        .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                        .replace(/(^-+|-+$)/, ''),

                image: req.body.image,

                group: req.body.group,

                subgroup: req.body.subgroup,

                fullDescription: req.body.patrimonialAsset + " " +
                    req.body.description + " " +
                    req.body.manufacturer + " " +
                    req.body.model + " " +
                    req.body.capacityReach + " " +
                    req.body.serialNumber,

                stockCode:             
                req.body.description
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                .replace(/(^-+|-+$)/, '') +
                req.body.capacityReach
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .replace(/([^\w]+|\s+)/g, '') // Retira espaço e outros caracteres 
                .replace(/\-\-+/g, '') // Retira multiplos hífens por um único hífen
                .replace(/(^-+|-+$)/, ''),

                client: req.body.client,

                local: req.body.local,

                sublease: req.body.sublease,

                patrimonialAsset: req.body.patrimonialAsset,

                description: req.body.description,

                manufacturer: req.body.manufacturer,

                model: req.body.model,

                capacityReach: req.body.capacityReach,

                serialNumber: req.body.serialNumber,

                physicalStatus: req.body.physicalStatus,

                kindOfEquipment: req.body.kindOfEquipment,

                requiresCertificationCalibration: req.body.requiresCertificationCalibration,

                inputAmount: req.body.inputAmount.replace(",", "."),

                outputQuantity: req.body.outputQuantity.replace(",", "."),

                stockQuantity: req.body.inputAmount - req.body.outputQuantity,

                unity: req.body.unity,

                weightKg: req.body.weightKg,

                faceValue: req.body.faceValue.replace(",", "."),

                dimensionsWxLxH: req.body.dimensionsWxLxH,

                certificate: req.body.certificate,

                entityLaboratory: req.body.entityLaboratory,

                frequency: req.body.frequency,

                calibrationDate: req.body.calibrationDate,

                calibrationValidity: req.body.calibrationValidity,

                calibrationStatus: req.body.calibrationStatus,

                po: req.body.po,

                sapCode: req.body.sapCode,

                ncmCode: req.body.ncmCode,

                provider: req.body.provider,

                invoce: req.body.invoce,

                receivingDate: req.body.receivingDate,

                note: req.body.note,

                releaseDateOf: req.body.releaseDateOf,

                userLaunch: req.body.userLaunch,

                emailLaunch: req.body.emailLaunch,

                userLaunch: req.body.userLaunch,

                editionDate: req.body.editionDate,

                userEdtion: req.body.userEdtion,

                emailEdtion: req.body.emailEdtion,

                requestUser: req.body.requestUser,

                requestOrigin: req.body.requestOrigin,

                responsibleSite: req.body.requestOrigin,

                responsibleMaterial: req.body.responsibleMaterial,

                //totalFaceValue:req.body.inputAmount * req.body.faceValue,

                //totalWeightKg:req.body.inputAmount * req.body.weightKg,

                tags: [req.body.group,
                req.body.subgroup,
                req.body.client,
                req.body.local,
                req.body.sublease,
                req.body.client,
                req.body.physicalStatus,
                req.body.kindOfEquipment,
                req.body.provider
                ]
            })

            await products.save()
            req.flash("success_msg", "Produto criado com sucesso!")
            res.redirect("/products/request")

        } catch (err) {
            req.flash("error_msg", "Ops, Houve um erro ao salvar o Produto, tente novamente!" + err)
            res.render("/products")
        }
    }
}