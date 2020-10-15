const mongoose = require("mongoose");
require("../models/Type");
const Type = mongoose.model("types");


//EXIBINDO TIPOS POR LISTA
exports.getList = async (req, res) => {
  try {
    const file = req.file
    const filtros = [];
    let { search, page, site, limit } = req.query;
    if (!!search) {
      const pattern = new RegExp(`.*${search}.*`);
      filtros.push(
        { qrcode: { $regex: pattern, $options: 'i' } },
        { description: { $regex: pattern, $options: 'i' } },
        { user: { $regex: pattern, $options: 'i' } }
      );
    }
    page = Number(page || 1);
    limit = limit ? Number(limit) : 5;
    const quant = await Type.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const types = await Type.aggregate([
      { $match: filtros.length > 0 ? { $or: filtros } : {active:true} },
      { $skip: page > 1 ? (page - 1) * limit : 0 },
      { $limit: limit },
      { $sort: { description: 1 } },
      {
        $lookup:
        {
          from: "collaborators",
          localField: "userEdtion",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
    ])

    res.render("types/types", {
      types,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      site,
      file
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
    const file = req.file
    const filtros = [];
    let { search, page, site, limit } = req.query;
    if (!!search) {
      const pattern = new RegExp(`.*${search}.*`);
      filtros.push(
        { qrcode: { $regex: pattern, $options: 'i' } },
        { description: { $regex: pattern, $options: 'i' } },
        { user: { $regex: pattern, $options: 'i' } }
      );
    }
    page = Number(page || 1);
    limit = limit ? Number(limit) : 10;
    const quant = await Type.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    //UTILIZANDO O AGGREGATE
    const types = await Type.aggregate([
      //{ $match: filtros.length > 0 ? { $or: filtros } : { active: true, emailLaunch: req.user.email } },
      { $match: filtros.length > 0 ? { $or: filtros } : {} },
      { $sort: { description: 1 } },
      { $limit: limit },
      { $skip: page > 1 ? (page - 1) * limit : 0 },
      {
        $lookup:
        {
          from: "collaborators",
          localField: "userEdtion",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
    ])

    //console.log(types)
    //USANDO O FIND
    /*var types = await Type.find(filtros.length > 0 ? { $or: filtros } : {})
      .sort({ description: "asc" })
      .limit(limit)
      .skip(page > 1 ? (page - 1) * limit : 0)
      .populate("userEdition")
      .populate("userLaunch");*/


    res.render("types/table", {
      //types: types.map((types) => types.toJSON()),
      types,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      site,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/types");
  }
};

//TABELA DE EDIÇÃO
exports.getTableDev = async (req, res) => {
  try {
    const file = req.file
    const filtros = [];
    let { search, page, site, limit } = req.query;
    if (!!search) {
      const pattern = new RegExp(`.*${search}.*`);
      filtros.push(
        { qrcode: { $regex: pattern, $options: 'i' } },
        { description: { $regex: pattern, $options: 'i' } },
        { user: { $regex: pattern, $options: 'i' } }
      );
    }
    page = Number(page || 1);
    limit = limit ? Number(limit) : 10;
    const quant = await Type.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    //UTILIZANDO O AGGREGATE
    const types = await Type.aggregate([
      //{ $match: filtros.length > 0 ? { $or: filtros } : { active: true, emailLaunch: req.user.email } },
      { $match: filtros.length > 0 ? { $or: filtros } : {} },
      { $sort: { description: 1 } },
      { $limit: limit },
      { $skip: page > 1 ? (page - 1) * limit : 0 },
      {
        $lookup:
        {
          from: "collaborators",
          localField: "userEdtion",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
    ])

    //console.log(types)
    //USANDO O FIND
    /*var types = await Type.find(filtros.length > 0 ? { $or: filtros } : {})
      .sort({ description: "asc" })
      .limit(limit)
      .skip(page > 1 ? (page - 1) * limit : 0)
      .populate("userEdition")
      .populate("userLaunch");*/


    res.render("types/TableDev", {
      //types: types.map((types) => types.toJSON()),
      types,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      site,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/types");
  }
};


//CRIANDO UM TIPO
exports.getCreate = async (req, res) => {
  const file = req.file
  try {
    res.render("types/add", { file });
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
      texto: "Descrição do Tipo Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("types/add", {
      file,
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
      await types.save();
      req.flash("success_msg", "Tipo criado com sucesso!");
      res.redirect("/types");
      console.log("Tipo criado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
      );
      res.redirect("/types");
    }
  }
};

//EDITANDO UM TIPO
exports.getUpdate = async (req, res) => {
  try {
    const file = req.file
    var type = await Type.findOne({ _id: req.params.id }).lean();
    res.render("types/edit", { type: type, file });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/types");
  }
};

exports.postUpdate = async (req, res) => {
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
  if (
    !req.body.image ||
    typeof req.body.image == undefined ||
    req.body.image == null
  ) {
    erros.push({
      texto: "Você precisa escolher uma imagem!!!",
    });
  }
  if (req.body.description.length < 2) {
    erros.push({
      texto: "Descrição do Tipo Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("types/edit", {
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
        (type.image = req.file.location),
        (type.key = req.file.key), //.slice(0, -1),
        (type.description = req.body.description),
        //(type.releaseDateOf = req.body.releaseDateOf),
        //(type.userLaunch = req.body.userLaunch),
        //(type.emailLaunch = req.body.emailLaunch),
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
        "Ops, Houve um erro ao salvar o tipo, tente novamente!"
      );
      res.redirect("/types");
    }
  }
};

//CRIANDO UM PRODUTO PELO ID
exports.getCreateId = async (req, res) => {
  try {
    const file = req.file
    var type = await Type.findOne({ _id: req.params.id }).lean();
    res.render("types/add_id", { type: type, file });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/types");
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
      texto: "Descrição do Tipo Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("types/add_id", {
      file,
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
      await types.save();
      req.flash("success_msg", "Tipo criado com sucesso!");
      res.redirect("/types");
      console.log("Tipo criado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
      );
      res.redirect("/types");
    }
  }
};


//DELETANDO UM TIPO
exports.getDelete = async (req, res) => {
  await Type.remove({ _id: req.params.id });
  try {
    req.flash("success_msg", "Tipo deletado com Sucesso!");
    res.redirect("/types");
  } catch (err) {
    req.flash("error_msg", "Houve um erro interno!");
    res.redirect("/types");
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
    res.render("types/add", {
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
    res.render("types/add", {
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
