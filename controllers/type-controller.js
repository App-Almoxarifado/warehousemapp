const mongoose = require("mongoose");
require("../models/Type");
const Type = mongoose.model("types");


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
    const quant = await Type.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const types = await Type.aggregate([
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

    res.render("types/read", {
      types,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/types");
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
    const quant = await Type.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const types = await Type.aggregate([
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
    res.render("types/table", {
      types,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/types");
  }
};


//CRIANDO 
exports.getCreate = async (req, res) => {
  const file = req.file
  try {
    res.render("types/create", { file });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/types");
  }
};

exports.postCreate = async (req, res) => {
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
      texto: "Descrição do tipo muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("types/create", {
      file,
      erros: erros,
    });
  } else {
    try {
      const types = new Type({
        image: req.file.location,
        key: req.file.key,
        description: req.body.description,
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
      await types.save();
      req.flash("success_msg", "Tipo criado com sucesso!");
      res.redirect("/types");
      console.log("Tipo criado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!"
      );
      res.redirect("/types");
    }
  }
};

//EDITANDO
exports.getUpdate = async (req, res) => {
  try {
    const file = req.file
    var type = await Type.findOne({ _id: req.params._id }).lean();
    res.render("types/update", { type, file });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/types");
  }
};

exports.postUpdate = async (req, res) => {
  var type = await Type.findOne({ _id: req.body._id });
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
      texto: "Descrição do tipo muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("./types/update", {
      file,
      erros: erros,
    });
  } else {
    try {
      type.image = req.file.location
      type.key = req.file.key
      type.description = req.body.description
      type.createdAt = req.body.createdAt
      type.userCreated = req.body.userCreated
      type.emailCreated = req.body.emailCreated
      type.updatedAt = Date.now()
      type.userUpdated = req.body.userUpdated
      type.emailUpdated = req.body.emailUpdated
      type.tag = req.body.description
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
        .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
        .replace(/(^-+|-+$)/, "") +

        await type.save();
      req.flash("success_msg", "Área editada com sucesso!");
      res.redirect("/types");
      console.log("área editada com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
      );
      res.redirect("/types");
    }
  }
};


//DELETANDO
exports.getDelete = async (req, res) => {
  await Type.deleteOne({ _id: req.params._id });
  try {
    req.flash("success_msg", "Área deletada com Sucesso!");
    res.redirect("/types");
  } catch (err) {
    req.flash("error_msg", "Houve um erro interno!");
    res.redirect("/types");
  }
};

