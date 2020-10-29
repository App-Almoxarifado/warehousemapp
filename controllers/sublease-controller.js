const mongoose = require("mongoose");
require("../models/Sublease");
const Sublease = mongoose.model("subleases");


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
    const quant = await Sublease.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const subleases = await Sublease.aggregate([
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

    res.render("subleases/read", {
      subleases,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/subleases");
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
    const quant = await Sublease.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const subleases = await Sublease.aggregate([
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
    res.render("subleases/table", {
      subleases,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/subleases");
  }
};


//CRIANDO 
exports.getCreate = async (req, res) => {
  const file = req.file
  try {
    res.render("subleases/create", { file });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/subleases");
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
      texto: "Descrição da sublocação muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("subleases/create", {
      file,
      erros: erros,
    });
  } else {
    try {
      const subleases = new Sublease({
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
      await subleases.save();
      req.flash("success_msg", "Sublocação criada com sucesso!");
      res.redirect("/subleases");
      console.log("Sublocação criada com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar a sublocação, tente novamente!" + err
      );
      res.redirect("/subleases");
    }
  }
};

//EDITANDO
exports.getUpdate = async (req, res) => {
  try {
    const file = req.file
    var sublease = await Sublease.findOne({ _id: req.params._id }).lean();
    res.render("subleases/update", { sublease, file });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/subleases");
  }
};

exports.postUpdate = async (req, res) => {
  var sublease = await Sublease.findOne({ _id: req.body._id });
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
      texto: "Descrição da sublocação muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("./subleases/update", {
      file,
      erros: erros,
    });
  } else {
    try {
      sublease.image = req.file.location
      sublease.key = req.file.key
      sublease.description = req.body.description
      sublease.createdAt = req.body.createdAt
      sublease.userCreated = req.body.userCreated
      sublease.emailCreated = req.body.emailCreated
      sublease.updatedAt = Date.now()
      sublease.userUpdated = req.body.userUpdated
      sublease.emailUpdated = req.body.emailUpdated
      sublease.tag = req.body.description
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
        .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
        .replace(/(^-+|-+$)/, "") +

        await sublease.save();
      req.flash("success_msg", "Sublocação editada com sucesso!");
      res.redirect("/subleases");
      console.log("sublocação editada com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar a sublocação, tente novamente!" + err
      );
      res.redirect("/subleases");
    }
  }
};


//DELETANDO
exports.getDelete = async (req, res) => {
  await Sublease.deleteOne({ _id: req.params._id });
  try {
    req.flash("success_msg", "Sublocação deletada com Sucesso!");
    res.redirect("/subleases");
  } catch (err) {
    req.flash("error_msg", "Houve um erro interno!");
    res.redirect("/subleases");
  }
};

