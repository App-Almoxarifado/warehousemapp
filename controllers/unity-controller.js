const mongoose = require("mongoose");
require("../models/Unity");
const Unity = mongoose.model("unitys");


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
    limit = limit ? Number(limit) : 10;
    const quant = await Unity.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const unitys = await Unity.aggregate([
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

    console.log(unitys)

    res.render("unitys/unitys", {
      unitys,
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
    res.redirect("/unitys");
  }
};

//EXIBINDO TABELA
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
    const quant = await Unity.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    //UTILIZANDO O AGGREGATE
    const unitys = await Unity.aggregate([
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

    //console.log(unitys)
    //USANDO O FIND
    /*var unitys = await Unity.find(filtros.length > 0 ? { $or: filtros } : {})
      .sort({ description: "asc" })
      .limit(limit)
      .skip(page > 1 ? (page - 1) * limit : 0)
      .populate("userEdition")
      .populate("userLaunch");*/


    res.render("unitys/table", {
      unitys,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      site,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!" + err);
    res.redirect("/unitys");
  }
};

//CRIANDO
exports.getCreate = async (req, res) => {
  const file = req.file
  try {
    res.render("unitys/add", { file });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/unitys");
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
  if (req.body.description.length < 2) {
    erros.push({
      texto: "Descrição do Tipo Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("unitys/add", {
      file,
      erros: erros,
    });
  } else {
    try {
      const unitys = new Unity({
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
      await unitys.save();
      req.flash("success_msg", "Tipo criado com sucesso!");
      res.redirect("/unitys");
      console.log("Tipo criado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
      );
      res.redirect("/unitys");
    }
  }
};

//EDITANDO
exports.getUpdate = async (req, res) => {
  try {
  const file = req.file
  var unity = await Unity.findOne({ _id: req.params.id }).lean();
    res.render("unitys/edit", { unity, file });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/unitys");
  }
};

exports.postUpdate = async (req, res) => {
  var unity = await Unity.findOne({ _id: req.body.id });
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
    res.render("unitys/edit", {
      erros: erros,
    });
  } else {
    try {
      (unity.qrcode = req.body.description
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
        .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
        .replace(/(^-+|-+$)/, "")), // Remove hífens extras do final ou do inicio da string
        (unity.image = req.file.location),
        (unity.key = req.file.key), //.slice(0, -1),
        (unity.description = req.body.description),
        //(unity.releaseDateOf = req.body.releaseDateOf),
        //(unity.userLaunch = req.body.userLaunch),
        //(unity.emailLaunch = req.body.emailLaunch),
        (unity.editionDate = req.body.editionDate),
        (unity.userEdtion = req.body.userEdtion),
        (unity.emailEdtion = req.body.emailEdtion);

      await unity.save();
      req.flash("success_msg", "Tipo editado com sucesso!");
      res.redirect("/unitys");
      console.log("Tipo editado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!"
      );
      res.redirect("/unitys");
    }
  }
};

//CRIANDO UM PRODUTO PELO ID
exports.getCreateId = async (req, res) => {
  try {
  const file = req.file
  var unity = await Unity.findOne({ _id: req.params.id }).lean();
    res.render("unitys/add_id", { unity: unity, file });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/unitys");
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
    res.render("unitys/add_id", {
      file,
      erros: erros,
    });
  } else {
    try {
      const unitys = new Unity({
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
      await unitys.save();
      req.flash("success_msg", "Tipo criado com sucesso!");
      res.redirect("/unitys");
      console.log("Tipo criado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
      );
      res.redirect("/unitys");
    }
  }
};
//DELETANDO UM TIPO
exports.getDelete = async (req, res) => {
  await Unity.remove({ _id: req.params.id });
  try {
    req.flash("success_msg", "Unidade deletada com Sucesso!");
    res.redirect("/unitys");
  } catch (err) {
    req.flash("error_msg", "Houve um erro interno!");
    res.redirect("/unitys");
  }
};

