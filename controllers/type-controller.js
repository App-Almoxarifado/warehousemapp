const mongoose = require("mongoose");
require("../models/Type");
const Type = mongoose.model("types");
require("../models/Client");
const Client = mongoose.model("customers");

//EXIBINDO TIPOS POR LISTA
exports.getList = async (req, res) => {
  try {
    var customers = await Client.find({ active: true })
      .sort({ description: "asc" })
      .lean();
    const filtros = [];
    let { search, page, site, limit } = req.query;
    if (!!search) {
      const pattern = new RegExp(`.*${search}.*`);
      filtros.push(
        { qrcode: { $regex: pattern } },
        { description: { $regex: pattern } },
        { user: { $regex: pattern } }
      );
    }
    page = Number(page || 1);
    limit = limit ? Number(limit) : 10;
    const quant = await Type.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();
    var types = await Type.find(filtros.length > 0 ? { $or: filtros } : {})
      .sort({ description: "asc" })
      .limit(limit)
      .skip(page > 1 ? (page - 1) * limit : 0)
      .lean()
      .populate(["userLaunch", "userEdition"]);

    res.render("types/types", {
      types: types,
      customers: customers,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      site,
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/types");
  }
};

//EXIBINDO TIPOS POR TABELA
exports.getTable = async (req, res) => {
  try {
    var customers = await Client.find({ active: true })
      .sort({ description: "asc" })
      .lean();

    const filtros = [];
    let { search, page, site, limit } = req.query;
    if (!!search) {
      const pattern = new RegExp(`.*${search}.*`);
      filtros.push(
        { qrcode: { $regex: pattern } },
        { description: { $regex: pattern } },
        { user: { $regex: pattern } }
      );
    }

    page = Number(page || 1);
    limit = limit ? Number(limit) : 10;

    const quant = await Type.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    var types = await Type.find(filtros.length > 0 ? { $or: filtros } : {})
      .sort({ description: "asc" })
      .limit(limit)
      .skip(page > 1 ? (page - 1) * limit : 0)

      .populate("userEdition")
      .populate("userLaunch");
    res.render("types/typestable", {
      types: types.map((types) => types.toJSON()),
      customers: customers,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      site,
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/types");
  }
};

//CRIANDO UM TIPO
exports.getCreate = async (req, res) => {
  try {
    res.render("types/addtypes");
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/types");
  }
};

exports.postCreate = async (req, res) => {
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
      texto: "Descrição do Tipo Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("types/addtypes", {
      erros: erros,
    });
  } else {
    try {
      const types = new Type({
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
      texto: "Descrição do Tipo Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("types/addtypes", {
      erros: erros,
    });
  } else {
    try {
      const types = new Type({
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

//EDITA UM NOVO PRODUTO COM UM CLIQUE
exports.postUpdateDevAdmin = async (req, res) => {
  var type = await Type.findOne({ _id: req.body.id });
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
      texto: "Descrição do Tipo Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("types/addtypes", {
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
        (type.releaseDateOf = req.body.releaseDateOf),
        (type.userLaunch = req.body.userLaunch),
        (type.emailLaunch = req.body.emailLaunch),
        (type.editionDate = req.body.editionDate),
        (type.userEdtion = req.body.userEdtion),
        (type.emailEdtion = req.body.emailEdtion);

      await type.save();
      req.flash("success_msg", "Tipo editado com sucesso!");
      res.redirect("/types");
      console.log("Tipo editado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
      );
      res.redirect("/types");
    }
  }
};
