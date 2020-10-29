const mongoose = require("mongoose");
require("../models/Unity");
const Unity = mongoose.model("unitys");


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
    const quant = await Unity.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const unitys = await Unity.aggregate([
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

    res.render("unitys/read", {
      unitys,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/unitys");
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
    const quant = await Unity.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const unitys = await Unity.aggregate([
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
    res.render("unitys/table", {
      unitys,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/unitys");
  }
};


//CRIANDO 
exports.getCreate = async (req, res) => {
  const file = req.file
  try {
    res.render("unitys/create", { file });
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
      texto: "Descrição da unidade muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("unitys/create", {
      file,
      erros: erros,
    });
  } else {
    try {
      const unitys = new Unity({
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
      await unitys.save();
      req.flash("success_msg", "Unidade criada com sucesso!");
      res.redirect("/unitys");
      console.log("Unidade criada com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar a unidade, tente novamente!" + err
      );
      res.redirect("/unitys");
    }
  }
};

//EDITANDO
exports.getUpdate = async (req, res) => {
  try {
    const file = req.file
    var unity = await Unity.findOne({ _id: req.params._id }).lean();
    res.render("unitys/update", { unity, file });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/unitys");
  }
};

exports.postUpdate = async (req, res) => {
  var unity = await Unity.findOne({ _id: req.body._id });
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
      texto: "Descrição da unidade muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("./unitys/update", {
      file,
      erros: erros,
    });
  } else {
    try {
      unity.image = req.file.location
      unity.key = req.file.key
      unity.description = req.body.description
      unity.createdAt = req.body.createdAt
      unity.userCreated = req.body.userCreated
      unity.emailCreated = req.body.emailCreated
      unity.updatedAt = Date.now()
      unity.userUpdated = req.body.userUpdated
      unity.emailUpdated = req.body.emailUpdated
      unity.tag = req.body.description
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
        .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
        .replace(/(^-+|-+$)/, "") +

        await unity.save();
      req.flash("success_msg", "Unidade editada com sucesso!");
      res.redirect("/unitys");
      console.log("unidade editada com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar a unidade, tente novamente!" + err
      );
      res.redirect("/unitys");
    }
  }
};


//DELETANDO
exports.getDelete = async (req, res) => {
  await Unity.deleteOne({ _id: req.params._id });
  try {
    req.flash("success_msg", "Unidade deletada com Sucesso!");
    res.redirect("/unitys");
  } catch (err) {
    req.flash("error_msg", "Houve um erro interno!");
    res.redirect("/unitys");
  }
};

