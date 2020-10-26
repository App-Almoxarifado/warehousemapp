const mongoose = require("mongoose");
require("../models/Group");
const Group = mongoose.model("groups");
require("../models/Subgroup");
const Subgroup = mongoose.model("subgroups");

//LISTA
exports.getList = async (req, res) => {
    try {
        const file = req.file
        const filtros = [];
        let { search, page, limit } = req.query;
        if (!!search) {
            const pattern = new RegExp(`.*${search}.*`);
            filtros.push(
                { tag: { $regex: pattern, $options: 'i' } },
                { description: { $regex: pattern, $options: 'i' } },
            );
        }
        page = Number(page || 1);
        limit = limit ? Number(limit) : 5;
        const quant = await Subgroup.find(
            filtros.length > 0 ? { $or: filtros } : {}
        ).estimatedDocumentCount();

        const subgroups = await Subgroup.aggregate([
            { $match: filtros.length > 0 ? { $or: filtros } : { active: true } },
            { $sort: { description: 1 } },
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
            {
                $lookup:
                {
                    from: "groups",
                    localField: "group",
                    foreignField: "_id",
                    as: "group"
                }
            },
            { $unwind: "$group" },
        ])

        res.render("subgroups/read", {
            subgroups,
            prev: Number(page) > 1,
            next: Number(page) * limit < quant,
            page,
            limit,
            file
        });
    } catch (err) {
        console.log(err);
        req.flash("error_msg", "Ops, Houve um erro interno!");
        res.redirect("/subgroups");
    }
};

//TABELA
exports.getTable = async (req, res) => {
    try {
        const file = req.file
        const filtros = [];
        let { search, page, limit } = req.query;
        if (!!search) {
            const pattern = new RegExp(`.*${search}.*`);
            filtros.push(
                { tag: { $regex: pattern, $options: 'i' } },
                { description: { $regex: pattern, $options: 'i' } },
            );
        }
        page = Number(page || 1);
        limit = limit ? Number(limit) : 5;
        const quant = await Subgroup.find(
            filtros.length > 0 ? { $or: filtros } : {}
        ).estimatedDocumentCount();

        const subgroups = await Subgroup.aggregate([
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
            {
                $lookup:
                {
                    from: "groups",
                    localField: "group",
                    foreignField: "_id",
                    as: "group"
                }
            },
            { $unwind: "$group" },
        ])
        res.render("subgroups/table", {
            subgroups,
            prev: Number(page) > 1,
            next: Number(page) * limit < quant,
            page,
            limit,
            file
        });
    } catch (err) {
        console.log(err);
        req.flash("error_msg", "Ops, Houve um erro interno!");
        res.redirect("/subgroups");
    }
};


//CRIANDO 
exports.getCreate = async (req, res) => {
    const file = req.file
    var groups = await Group.find({
        active: true,
    }).sort({
        description: "asc",
    }).lean();
    try {
        res.render("subgroups/create", { file, groups });
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!");
        res.redirect("/subgroups");
    }
};

exports.postCreate = async (req, res) => {
    const file = req.file
    var erros = [];
    if (req.body.group == "0") {
        erros.push({ texto: "Grupo inválido, registre um grupo" })
    }
    if (
        !req.body.description ||
        typeof req.body.description == undefined ||
        req.body.description == null
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
    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do Subgrupo muito Pequeno!",
        });
    }
    if (erros.length > 0) {
        res.render("subgroups/create", {
            file,
            erros: erros,
        });
    } else {
        try {
            const subgroups = new Subgroup({
                image: req.file.location,
                key: req.file.key,
                description: req.body.description,
                group: req.body.group,
                userCreated: req.body.userCreated,
                emailCreated: req.body.emailCreated,
                userUpdated: req.body.userUpdated,
                emailUpdated: req.body.emailUpdated,
                tag: req.body.description
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
                    .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
                    .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
                    .replace(/(^-+|-+$)/, "")
            });
            await subgroups.save();
            req.flash("success_msg", "Subgrupo criado com sucesso!");
            res.redirect("/subgroups");
            console.log("Subgrupo criado com sucesso!");
        } catch (err) {
            req.flash(
                "error_msg",
                "Ops, Houve um erro ao salvar o subgrupo, tente novamente!"
            );
            res.redirect("/subgroups");
        }
    }
};

//EDITANDO
exports.getUpdate = async (req, res) => {
    try {
        const file = req.file
        var subgroup = await Subgroup.findOne({ _id: req.params._id }).lean();
        var groups = await Group.find({
            active: true,
        }).sort({
            description: "asc",
        }).lean();
        res.render("subgroups/update", { subgroup, groups, file });
    } catch (_err) {
        req.flash("error_msg", "Ops, Houve um erro interno!");
        res.redirect("/subgroups");
    }
};

exports.postUpdate = async (req, res) => {
    var subgroup = await Subgroup.findOne({ _id: req.body._id });
    const file = req.file
    var erros = [];
    if (req.body.group == "0") {
        erros.push({ texto: "Grupo inválido, registre um grupo" })
    }
    if (
        !req.body.description ||
        typeof req.body.description == undefined ||
        req.body.description == null
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
    if (req.body.description.length < 2) {
        erros.push({
            texto: "Descrição do Grupo Muito Pequeno!",
        });
    }
    if (erros.length > 0) {
        res.render("./groups/update", {
            file,
            erros: erros,
        });
    } else {
        try {
            subgroup.image = req.file.location
            subgroup.key = req.file.key
            subgroup.description = req.body.description
            subgroup.group = req.body.group
            subgroup.createdAt = req.body.createdAt
            subgroup.userCreated = req.body.userCreated
            subgroup.emailCreated = req.body.emailCreated
            subgroup.updatedAt = Date.now()
            subgroup.userUpdated = req.body.userUpdated
            subgroup.emailUpdated = req.body.emailUpdated
            subgroup.tag = req.body.description
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Remove acentos
                .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
                .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
                .replace(/(^-+|-+$)/, "") +

                await subgroup.save();
            req.flash("success_msg", "Subgrupo editado com sucesso!");
            res.redirect("/subgroups");
            console.log("Subgrupo editado com sucesso!");
        } catch (err) {
            req.flash(
                "error_msg",
                "Ops, Houve um erro ao salvar o subgrupo, tente novamente!"
            );
            res.redirect("/subgroups");
        }
    }
};


//DELETANDO
exports.getDelete = async (req, res) => {
    await Subgroup.deleteOne({ _id: req.params._id });
    try {
        req.flash("success_msg", "Subgrupo deletado com Sucesso!");
        res.redirect("/subgroups");
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno!");
        res.redirect("/subgroups");
    }
};

