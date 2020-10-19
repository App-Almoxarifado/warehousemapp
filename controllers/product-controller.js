const mongoose = require("mongoose");
require("../models/Product");
const Product = mongoose.model("products");
require("../models/Group");
const Group = mongoose.model("groups");
require("../models/Subgroup");
const Subgroup = mongoose.model("subgroups");
require("../models/Type");
const Type = mongoose.model("types");
require("../models/Request");
const Request = mongoose.model("requests");

//EXIBINDO TIPOS POR LISTA
exports.getList = async (req, res) => {
    try {
        const file = req.file
        const filtros = [];
        let { search, page, limit } = req.query;
        if (!!search) {
            const pattern = new RegExp(`.*${search}.*`);
            filtros.push(
                { tag: { $regex: pattern, $options: 'i' } },
                { name: { $regex: pattern, $options: 'i' } },
                { capacityReach: { $regex: pattern, $options: 'i' } },
                { description: { $regex: pattern, $options: 'i' } },
            );
        }
        page = Number(page || 1);
        limit = limit ? Number(limit) : 5;
        const quant = await Product.find(
            filtros.length > 0 ? { $or: filtros } : {}
        ).estimatedDocumentCount();

        const products = await Product.aggregate([
            { $match: filtros.length > 0 ? { $or: filtros } : { active: true } },
            { $sort: { description: -1 } },
            { $skip: page > 1 ? (page - 1) * limit : 0 },
            { $limit: limit },      
            {
                $lookup:
                {
                    from: "collaborators",
                    localField: "userCreated",
                    foreignField: "_id",
                    as: "created"
                }
            },
            { $unwind: "$created" },
            {
                $lookup:
                {
                    from: "collaborators",
                    localField: "userUpdated",
                    foreignField: "_id",
                    as: "updated"
                }
            },
            { $unwind: "$updated" },
        ])

        res.render("products/products", {
            products,
            prev: Number(page) > 1,
            next: Number(page) * limit < quant,
            page,
            limit,
            file
        });
    } catch (err) {
        console.log(err);
        req.flash("error_msg", "Ops, Houve um erro interno!");
        res.redirect("/products");
    }
};

//EXIBINDO TIPOS POR TABELA
exports.getTable = async (req, res) => {
    try {
        const file = req.file
        const filtros = [];
        let { search, page, limit } = req.query;
        if (!!search) {
            const pattern = new RegExp(`.*${search}.*`);
            filtros.push(
                { tag: { $regex: pattern, $options: 'i' } },
                { name: { $regex: pattern, $options: 'i' } },
                { capacityReach: { $regex: pattern, $options: 'i' } },
                { description: { $regex: pattern, $options: 'i' } },
            );
        }
        page = Number(page || 1);
        limit = limit ? Number(limit) : 5;
        const quant = await Product.find(
            filtros.length > 0 ? { $or: filtros } : {}
        ).estimatedDocumentCount();

        const products = await Product.aggregate([
            { $match: filtros.length > 0 ? { $or: filtros } : { active: true } },
            { $sort: { description: -1 } },
            { $skip: page > 1 ? (page - 1) * limit : 0 },
            { $limit: limit },
            {
                $lookup:
                {
                    from: "collaborators",
                    localField: "userUpdated",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
        ])
        res.render("products/table", {
            products,
            prev: Number(page) > 1,
            next: Number(page) * limit < quant,
            page,
            limit,
            file
        });
    } catch (err) {
        console.log(err);
        req.flash("error_msg", "Ops, Houve um erro interno!");
        res.redirect("/products");
    }
};

//TABELA DE EDIÇÃO
exports.getTableDev = async (req, res) => {
    try {
        const file = req.file
        const filtros = [];
        let { search, page, limit } = req.query;
        if (!!search) {
            const pattern = new RegExp(`.*${search}.*`);
            filtros.push(
                { tag: { $regex: pattern, $options: 'i' } },
                { name: { $regex: pattern, $options: 'i' } },
                { capacityReach: { $regex: pattern, $options: 'i' } },
                { description: { $regex: pattern, $options: 'i' } },
            );
        }
        page = Number(page || 1);
        limit = limit ? Number(limit) : 5;
        const quant = await Product.find(
            filtros.length > 0 ? { $or: filtros } : {}
        ).estimatedDocumentCount();

        const products = await Product.aggregate([
            { $match: filtros.length > 0 ? { $or: filtros } : { active: true } },
            { $sort: { updatedAt: -1 } },
            { $skip: page > 1 ? (page - 1) * limit : 0 },
            { $limit: limit },
            {
                $lookup:
                {
                    from: "collaborators",
                    localField: "userUpdated",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
        ])
        res.render("products/TableDev", {
            //products: products.map((products) => products.toJSON()),
            products,
            prev: Number(page) > 1,
            next: Number(page) * limit < quant,
            page,
            limit,
            file
        });
    } catch (err) {
        console.log(err);
        req.flash("error_msg", "Ops, Houve um erro interno!");
        res.redirect("/products");
    }
};


//CRIANDO UM TIPO
exports.getCreate = async (req, res) => {
    var groups = await Group.find({
        active: true,
      }).sort({
        description: "asc",
      }).lean();
      const { gId } = req.query;
      var subgroups = await Subgroup.find(
        gId? {group: gId, } : {active: true,}
      ).sort({
        description: "asc",
      }).lean();
      var types = await Type.find({
        active: true,
      }).sort({
        description: "asc",
      }).lean();
    const file = req.file
    try {
        res.render("products/add", { file,idGroup: gId,groups,subgroups,types });
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!");
        res.redirect("/products");
    }
};

exports.postCreate = async (req, res) => {
    const file = req.file
    var erros = [];
    if (
        !req.body.name ||
        typeof req.body.name == undefined ||
        req.body.name == null
    ) {
        erros.push({
            texto: "Descricão Inválida",
        });
    }
    if (
        !req.body.image ||
        typeof req.body.image == undefined ||
        req.body.image == null
    ) {
        erros.push({
            texto: "Escolha uma foto",
        });
    }
    if (req.body.name.length < 2) {
        erros.push({
            texto: "Descrição do Produto Muito Pequeno!",
        });
    }
    if (erros.length > 0) {
        res.render("products/add", {
            file,
            erros: erros,
        });
    } else {
        try {
            const products = new Product({
                image: req.file.location,
                key: req.file.key,
                group: req.body.group,
                subgroup: req.body.subgroup,
                description: req.body.name + " " + req.body.capacityReach,
                name: req.body.name,
                capacityReach: req.body.capacityReach,
                kindOfEquipment: req.body.kindOfEquipment,
                userCreated: req.body.userCreated,
                emailCreated: req.body.emailCreated,
                userUpdated: req.body.userUpdated,
                emailUpdated: req.body.emailUpdated,
                tag: req.body.name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
                    .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
                    .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
                    .replace(/(^-+|-+$)/, "") +
                    req.body.capacityReach
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
                    .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
                    .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
                    .replace(/(^-+|-+$)/, "")
            });
            await Request.create({
                description:products._id
            });
            await products.save();
            req.flash("success_msg", "Produto criado com sucesso!");
            res.redirect("/products");
            console.log("Produto criado com sucesso!");
        } catch (err) {
            req.flash(
                "error_msg",
                "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
            );
            res.redirect("/products");
        }
    }
};

//EDITANDO UM TIPO
exports.getUpdate = async (req, res) => {
    try {
        const file = req.file
        var product = await Product.findOne({ _id: req.params.id }).lean();
        res.render("products/edit", { product: product, file });
    } catch (_err) {
        req.flash("error_msg", "Ops, Houve um erro interno!");
        res.redirect("/products");
    }
};

exports.postUpdate = async (req, res) => {
    var product = await Product.findOne({ _id: req.body.id });
    const file = req.file
    var erros = [];
    if (
        !req.body.name ||
        typeof req.body.name == undefined ||
        req.body.name == null
    ) {
        erros.push({
            texto: "Descricão Inválida",
        });
    }
    if (
        !req.body.image ||
        typeof req.body.image == undefined ||
        req.body.image == null
    ) {
        erros.push({
            texto: "Escolha uma foto",
        });
    }
    if (req.body.name.length < 2) {
        erros.push({
            texto: "Descrição do Produto Muito Pequeno!",
        });
    }
    if (erros.length > 0) {
        res.render("./products/edit", {
            file,
            erros: erros,
        });
    } else {
        try {
                product.image = req.file.location,
                product.key = req.file.key,
                product.description = req.body.name + " " + req.body.capacityReach,
                product.name = req.body.name,
                product.capacityReach = req.body.capacityReach,
                product.createdAt = req.body.createdAt,  
                product.userCreated = req.body.userCreated,
                product.emailCreated = req.body.emailCreated,
                product.updatedAt = Date.now(),   
                product.userUpdated = req.body.userUpdated,
                product.emailUpdated = req.body.emailUpdated,
                product.tag = req.body.name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
                    .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
                    .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
                    .replace(/(^-+|-+$)/, "") +
                req.body.capacityReach
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
                    .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
                    .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
                    .replace(/(^-+|-+$)/, "")

            await product.save();
            req.flash("success_msg", "Produto editado com sucesso!");
            res.redirect("/products");
            console.log("Produto editado com sucesso!");
        } catch (err) {
            req.flash(
                "error_msg",
                "Ops, Houve um erro ao salvar o tipo, tente novamente!"+err
            );
            res.redirect("/products");
        }
    }
};

//CRIANDO UM PRODUTO PELO ID
exports.getCreateId = async (req, res) => {
    try {
        const file = req.file
        var product = await Product.findOne({ _id: req.params.id }).lean();
        res.render("products/add_id", { product: product, file });
    } catch (_err) {
        req.flash("error_msg", "Ops, Houve um erro interno!");
        res.redirect("/products");
    }
};

exports.postCreateId = async (req, res) => {
    const file = req.file
    var erros = [];
    if (
        !req.body.description ||
        typeof req.body.description == undefined ||
        req.body.description == null
    ) {
        erros.push({
            texto: "Descricão Inválida",
        });
    }
    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do Produto Muito Pequeno!",
        });
    }
    if (erros.length > 0) {
        res.render("products/add_id", {
            file,
            erros: erros,
        });
    } else {
        try {
            const products = new Product({
                qrcode: req.body.description
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
                    .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
                    .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
                    .replace(/(^-+|-+$)/, ""), // Remove hífens extras do final ou do inicio da string
                image: req.file.location, //.slice(0, -1),
                key: req.file.key,
                description: req.body.description,
                releaseDateOf: req.body.releaseDateOf,
                userLaunch: req.body.userLaunch,
                emailLaunch: req.body.emailLaunch,
                editionDate: req.body.editionDate,
                userEdtion: req.body.userEdtion,
                emailEdtion: req.body.emailEdtion,
            });
            await products.save();
            req.flash("success_msg", "Produto criado com sucesso!");
            res.redirect("/products");
            console.log("Produto criado com sucesso!");
        } catch (err) {
            req.flash(
                "error_msg",
                "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
            );
            res.redirect("/products");
        }
    }
};


//DELETANDO UM TIPO
exports.getDelete = async (req, res) => {
    await Product.remove({ _id: req.params.id });
    try {
        req.flash("success_msg", "Produto deletado com Sucesso!");
        res.redirect("/products");
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno!");
        res.redirect("/products");
    }
};

//CRIA UM NOVO PRODUDO COM UM CLIQUE
exports.postCreateDevAdmin = async (req, res) => {
    var erros = [];
    if (
        !req.body.description ||
        typeof req.body.description == undefined ||
        req.body.description == null
    ) {
        erros.push({
            texto: "Descricão Inválida",
        });
    }
    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do Produto Muito Pequeno!",
        });
    }
    if (erros.length > 0) {
        res.render("products/add", {
            erros: erros,
        });
    } else {
        try {
            const products = new Product({
                qrcode: req.body.description
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
                    .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
                    .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
                    .replace(/(^-+|-+$)/, ""), // Remove hífens extras do final ou do inicio da string
                image: req.body.image, //.slice(0, -1),
                description: req.body.description,
                releaseDateOf: req.body.releaseDateOf,
                userLaunch: req.body.userLaunch,
                emailLaunch: req.body.emailLaunch,
                editionDate: req.body.editionDate,
                userEdtion: req.body.userEdtion,
                emailEdtion: req.body.emailEdtion,
            });
            await products.save();
            req.flash("success_msg", "Produto criado com sucesso!");
            res.redirect("/products");
            console.log("Produto criado com sucesso!");
        } catch (err) {
            req.flash(
                "error_msg",
                "Ops, Houve um erro ao salvar o tipo, tente novamente!"
            );
            res.redirect("/products");
        }
    }
};

//EDITA UM NOVO PRODUTO COM UM CLIQUE
exports.postUpdateDevAdmin = async (req, res) => {
    var type = await Product.findOne({ _id: req.body.id });
    var erros = [];
    if (
        !req.body.description ||
        typeof req.body.description == undefined ||
        req.body.description == null
    ) {
        erros.push({
            texto: "Descricão Inválida",
        });
    }
    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do Produto Muito Pequeno!",
        });
    }
    if (erros.length > 0) {
        res.render("products/add", {
            erros: erros,
        });
    } else {
        try {
            (type.qrcode = req.body.description
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Remove acentos
                .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
                .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
                .replace(/(^-+|-+$)/, "")), // Remove hífens extras do final ou do inicio da string
                (type.image = req.body.image), //.slice(0, -1),
                (type.description = req.body.description),
                //(type.releaseDateOf = req.body.releaseDateOf),
                //(type.userLaunch = req.body.userLaunch),
                //(type.emailLaunch = req.body.emailLaunch),
                (type.editionDate = req.body.editionDate),
                (type.userEdtion = req.body.userEdtion),
                (type.emailEdtion = req.body.emailEdtion);

            await type.save();
            req.flash("success_msg", "Produto editado com sucesso!");
            res.redirect("/products");
            console.log("Produto editado com sucesso!");
        } catch (err) {
            req.flash(
                "error_msg",
                "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
            );
            res.redirect("/products");
        }
    }
};
