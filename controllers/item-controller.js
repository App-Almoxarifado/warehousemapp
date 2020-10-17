const mongoose = require("mongoose");
require("../models/Item");
const Item = mongoose.model("items");


//EXIBINDO GRUPOS POR LISTA
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
    const quant = await Item.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const items = await Item.aggregate([
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

    res.render("items/items", {
      items,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      site,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/items");
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
    limit = limit ? Number(limit) : 5;
    const quant = await Item.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const items = await Item.aggregate([
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

    res.render("items/table", {
      items,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      site,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/items");
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
    const quant = await Item.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    //UTILIZANDO O AGGREGATE
    const items = await Item.aggregate([
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

    //console.log(items)
    //USANDO O FIND
    /*var items = await Item.find(filtros.length > 0 ? { $or: filtros } : {})
      .sort({ description: "asc" })
      .limit(limit)
      .skip(page > 1 ? (page - 1) * limit : 0)
      .populate("userEdition")
      .populate("userLaunch");*/


    res.render("items/TableDev", {
      //items: items.map((items) => items.toJSON()),
      items,
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
    res.redirect("/items");
  }
};


//CRIANDO UM TIPO
exports.getCreate = async (req, res) => {
  const file = req.file
  try {
    res.render("items/add", { file });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/items");
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
      texto: "Descrição do Item Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("./items/add", {
      file,
      erros: erros,
    });
  } else {
    try {
      const items = new Item({
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
      await items.save();
      req.flash("success_msg", "Item criado com sucesso!");
      res.redirect("/items");
      console.log("Item criado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
      );
      res.redirect("/items");
    }
  }
};

//EDITANDO UM TIPO
exports.getUpdate = async (req, res) => {
  try {
    const file = req.file
    var item = await Item.findOne({ _id: req.params.id }).lean();
    res.render("items/edit", { item: item, file });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/items");
  }
};

exports.postUpdate = async (req, res) => {
  var item = await Item.findOne({ _id: req.body.id });
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
      texto: "Descrição do Item Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("items/edit", {
      erros: erros,
    });
  } else {
    try {
      (item.qrcode = req.body.description
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
        .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
        .replace(/(^-+|-+$)/, "")), // Remove hífens extras do final ou do inicio da string
        (item.image = req.file.location),
        (item.key = req.file.key), //.slice(0, -1),
        (item.description = req.body.description),
        //(item.releaseDateOf = req.body.releaseDateOf),
        //(item.userLaunch = req.body.userLaunch),
        //(item.emailLaunch = req.body.emailLaunch),
        (item.editionDate = req.body.editionDate),
        (item.userEdtion = req.body.userEdtion),
        (item.emailEdtion = req.body.emailEdtion);

      await item.save();
      req.flash("success_msg", "Item editado com sucesso!");
      res.redirect("/items");
      console.log("Item editado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!"
      );
      res.redirect("/items");
    }
  }
};

//CRIANDO UM PRODUTO PELO ID
exports.getCreateId = async (req, res) => {
  try {
    const file = req.file
    var item = await Item.findOne({ _id: req.params.id }).lean();
    res.render("items/add_id", { item: item, file });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/items");
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
      texto: "Descrição do Item Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("items/add_id", {
      file,
      erros: erros,
    });
  } else {
    try {
      const items = new Item({
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
      await items.save();
      req.flash("success_msg", "Item criado com sucesso!");
      res.redirect("/items");
      console.log("Item criado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
      );
      res.redirect("/items");
    }
  }
};


//DELETANDO UM TIPO
exports.getDelete = async (req, res) => {
  await Item.remove({ _id: req.params.id });
  try {
    req.flash("success_msg", "Item deletado com Sucesso!");
    res.redirect("/items");
  } catch (err) {
    req.flash("error_msg", "Houve um erro interno!");
    res.redirect("/items");
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
      texto: "Descrição do Item Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("items/add", {
      erros: erros,
    });
  } else {
    try {
      const items = new Item({
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
      await items.save();
      req.flash("success_msg", "Item criado com sucesso!");
      res.redirect("/items");
      console.log("Item criado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!"
      );
      res.redirect("/items");
    }
  }
};

//EDITA UM NOVO PRODUTO COM UM CLIQUE
exports.postUpdateDevAdmin = async (req, res) => {
  var item = await Item.findOne({ _id: req.body.id });
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
      texto: "Descrição do Item Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("items/add", {
      erros: erros,
    });
  } else {
    try {
      (item.qrcode = req.body.description
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
        .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
        .replace(/(^-+|-+$)/, "")), // Remove hífens extras do final ou do inicio da string
        (item.image = req.body.image), //.slice(0, -1),
        (item.description = req.body.description),
        //(item.releaseDateOf = req.body.releaseDateOf),
        //(item.userLaunch = req.body.userLaunch),
        //(item.emailLaunch = req.body.emailLaunch),
        (item.editionDate = req.body.editionDate),
        (item.userEdtion = req.body.userEdtion),
        (item.emailEdtion = req.body.emailEdtion);

      await item.save();
      req.flash("success_msg", "Item editado com sucesso!");
      res.redirect("/items");
      console.log("Item editado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
      );
      res.redirect("/items");
    }
  }
};
