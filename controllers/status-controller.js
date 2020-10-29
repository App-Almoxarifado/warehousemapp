const mongoose = require("mongoose");
require("../models/Status");
const Status = mongoose.model("statuses");


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
    const quant = await Status.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const statuses = await Status.aggregate([
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

    res.render("statuses/read", {
      statuses,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/statuses");
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
    const quant = await Status.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const statuses = await Status.aggregate([
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
    res.render("statuses/table", {
      statuses,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/statuses");
  }
};


//CRIANDO 
exports.getCreate = async (req, res) => {
  const file = req.file
  try {
    res.render("statuses/create", { file });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/statuses");
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
      texto: "Descrição do status muito pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("statuses/create", {
      file,
      erros: erros,
    });
  } else {
    try {
      const statuses = new Status({
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
      await statuses.save();
      req.flash("success_msg", "Status criado com sucesso!");
      res.redirect("/statuses");
      console.log("Status criado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar a área, tente novamente!" 
      );
      res.redirect("/statuses");
    }
  }
};

//EDITANDO
exports.getUpdate = async (req, res) => {
  try {
    const file = req.file
    var status = await Status.findOne({ _id: req.params._id }).lean();
    res.render("statuses/update", { status, file });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/statuses");
  }
};

exports.postUpdate = async (req, res) => {
  var status = await Status.findOne({ _id: req.body._id });
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
      texto: "Descrição do status muito pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("./statuses/update", {
      file,
      erros: erros,
    });
  } else {
    try {
      status.image = req.file.location
      status.key = req.file.key
      status.description = req.body.description
      status.createdAt = req.body.createdAt
      status.userCreated = req.body.userCreated
      status.emailCreated = req.body.emailCreated
      status.updatedAt = Date.now()
      status.userUpdated = req.body.userUpdated
      status.emailUpdated = req.body.emailUpdated
      status.tag = req.body.description
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
        .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
        .replace(/(^-+|-+$)/, "") +

        await status.save();
      req.flash("success_msg", "Status Editado com sucesso!");
      res.redirect("/statuses");
      console.log("Status Editado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar a área, tente novamente!" + err
      );
      res.redirect("/statuses");
    }
  }
};


//DELETANDO
exports.getDelete = async (req, res) => {
  await Status.deleteOne({ _id: req.params._id });
  try {
    req.flash("success_msg", "Status Deletado com Sucesso!");
    res.redirect("/statuses");
  } catch (err) {
    req.flash("error_msg", "Houve um erro interno!");
    res.redirect("/statuses");
  }
};

