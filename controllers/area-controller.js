const mongoose = require("mongoose");
require("../models/Area");
const Area = mongoose.model("areas");


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
    const quant = await Area.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const areas = await Area.aggregate([
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

    res.render("areas/read", {
      areas,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/areas");
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
    const quant = await Area.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const areas = await Area.aggregate([
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
    res.render("areas/table", {
      areas,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/areas");
  }
};


//CRIANDO 
exports.getCreate = async (req, res) => {
  const file = req.file
  try {
    res.render("areas/create", { file });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/areas");
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
      texto: "Descrição da área muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("areas/create", {
      file,
      erros: erros,
    });
  } else {
    try {
      const areas = new Area({
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
      await areas.save();
      req.flash("success_msg", "Área criada com sucesso!");
      res.redirect("/areas");
      console.log("Área criada com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar a área, tente novamente!" + err
      );
      res.redirect("/areas");
    }
  }
};

//EDITANDO
exports.getUpdate = async (req, res) => {
  try {
    const file = req.file
    var area = await Area.findOne({ _id: req.params._id }).lean();
    res.render("areas/update", { area, file });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/areas");
  }
};

exports.postUpdate = async (req, res) => {
  var area = await Area.findOne({ _id: req.body._id });
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
      texto: "Descrição da área muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("./areas/update", {
      file,
      erros: erros,
    });
  } else {
    try {
      area.image = req.file.location
      area.key = req.file.key
      area.description = req.body.description
      area.createdAt = req.body.createdAt
      area.userCreated = req.body.userCreated
      area.emailCreated = req.body.emailCreated
      area.updatedAt = Date.now()
      area.userUpdated = req.body.userUpdated
      area.emailUpdated = req.body.emailUpdated
      area.tag = req.body.description
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
        .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
        .replace(/(^-+|-+$)/, "") +

        await area.save();
      req.flash("success_msg", "Área editada com sucesso!");
      res.redirect("/areas");
      console.log("Área editada com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar a área, tente novamente!" + err
      );
      res.redirect("/areas");
    }
  }
};


//DELETANDO
exports.getDelete = async (req, res) => {
  await Area.deleteOne({ _id: req.params._id });
  try {
    req.flash("success_msg", "Área deletada com Sucesso!");
    res.redirect("/areas");
  } catch (err) {
    req.flash("error_msg", "Houve um erro interno!");
    res.redirect("/areas");
  }
};

