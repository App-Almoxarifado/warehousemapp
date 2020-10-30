const mongoose = require("mongoose");
require("../models/Product");
const Product = mongoose.model("products");
require("../models/Group");
const Group = mongoose.model("groups");
require("../models/Subgroup");
const Subgroup = mongoose.model("subgroups");
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
        { name: { $regex: pattern, $options: 'i' } },
        { capacityReach: { $regex: pattern, $options: 'i' } },
        { description: { $regex: pattern, $options: 'i' } },
        { fullDescription: { $regex: pattern, $options: 'i' } }
      );
    }
    page = Number(page || 1);
    limit = limit ? Number(limit) : 5;
    const quant = await Product.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const products = await Product.aggregate([
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
      {
        $lookup:
        {
          from: "subgroups",
          localField: "subgroup",
          foreignField: "_id",
          as: "subgroup"
        }
      },
      { $unwind: "$subgroup" },
      {
        $lookup:
        {
          from: "types",
          localField: "type",
          foreignField: "_id",
          as: "type"
        }
      },
      { $unwind: "$type" }
    ])

    res.render("products/read", {
      products,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products");
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
        { name: { $regex: pattern, $options: 'i' } },
        { capacityReach: { $regex: pattern, $options: 'i' } },
        { description: { $regex: pattern, $options: 'i' } },
        { fullDescription: { $regex: pattern, $options: 'i' } }
      );
    }
    page = Number(page || 1);
    limit = limit ? Number(limit) : 5;
    const quant = await Product.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const products = await Product.aggregate([
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
      {
        $lookup:
        {
          from: "subgroups",
          localField: "subgroup",
          foreignField: "_id",
          as: "subgroup"
        }
      },
      { $unwind: "$subgroup" },
      {
        $lookup:
        {
          from: "types",
          localField: "type",
          foreignField: "_id",
          as: "type"
        }
      },
      { $unwind: "$type" }
    ])
    res.render("products/table", {
      products,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products");
  }
};


//CRIANDO 
exports.getCreate = async (req, res) => {
  var groups = await Group.find({
    active: true,
  }).sort({
    description: "asc",
  }).lean();
  const { gId } = req.query;
  var subgroups = await Subgroup.find(
    gId ? { group: gId, } : { active: true, }
  ).sort({
    description: "asc",
  }).lean();
  var types = await Type.find({
    active: true,
  }).sort({
    description: "asc",
  }).lean();
  const file = req.file
  try {
    res.render("products/create", { file, idGroup: gId, groups, subgroups, types });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products");
  }
};

exports.postCreate = async (req, res) => {
  const file = req.file
  var erros = [];
  if (
    !req.body.name ||
    typeof req.body.name == undefined ||
    req.body.name == null
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
  if (req.body.name.length < 2) {
    erros.push({
      texto: "Descrição do Produto Muito Pequeno!",
    });
  }
  if (erros.length > 0) {
    res.render("products/add", {
      file,
      erros: erros,
    });
  } else {
    try {
      const products = new Product({
        image: req.file.location,
        key: req.file.key,
        group: req.body.group,
        subgroup: req.body.subgroup,
        description: req.body.name + " " + req.body.capacityReach,
        name: req.body.name,
        capacityReach: req.body.capacityReach,
        type: req.body.type,
        userCreated: req.body.userCreated,
        emailCreated: req.body.emailCreated,
        userUpdated: req.body.userUpdated,
        emailUpdated: req.body.emailUpdated,
        tag: req.body.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
          .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
          .replace(/(^-+|-+$)/, "") +
          req.body.capacityReach
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
            .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
            .replace(/(^-+|-+$)/, "")
      });
      await products.save();
      req.flash("success_msg", "Produto criado com sucesso!");
      res.redirect("/products");
      console.log("Produto criado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o produto, tente novamente!" + err
      );
      res.redirect("/products");
    }
  }
};

//EDITANDO
exports.getUpdate = async (req, res) => {
  try {
    const file = req.file
    var product = await Product.findOne({ _id: req.params._id }).lean();
    var groups = await Group.find({ active: true, }).sort({ description: "asc", }).lean();
    var subgroups = await Subgroup.find({ active: true, }).sort({ description: "asc", }).lean();
    var types = await Type.find({ active: true, }).sort({ description: "asc", }).lean();
    res.render("products/update", { product, file, groups, subgroups, types });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products");
  }
};

exports.postUpdate = async (req, res) => {
  var product = await Product.findOne({ _id: req.body._id });
  const file = req.file
  var erros = [];
  if (
    !req.body.name ||
    typeof req.body.name == undefined ||
    req.body.name == null
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
  if (req.body.name.length < 2) {
    erros.push({
      texto: "Descrição do fornecedor muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("./products/update", {
      file,
      erros: erros,
    });
  } else {
    try {
      product.image = req.file.location
      product.key = req.file.key
      product.description = req.body.name + " " + req.body.capacityReach
      product.name = req.body.name
      product.group = req.body.group
      product.subgroup = req.body.subgroup
      product.type= req.body.type
      product.capacityReach = req.body.capacityReach
      product.createdAt = req.body.createdAt
      product.userCreated = req.body.userCreated
      product.emailCreated = req.body.emailCreated
      product.updatedAt = Date.now()
      product.userUpdated = req.body.userUpdated
      product.emailUpdated = req.body.emailUpdated
      product.tag = req.body.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
        .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
        .replace(/(^-+|-+$)/, "") +
        req.body.capacityReach
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
          .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
          .replace(/(^-+|-+$)/, "")
      await product.save();
      req.flash("success_msg", "Produto editado com sucesso!");
      res.redirect("/products");
      console.log("Produto editado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o produto, tente novamente!" + err
      );
      res.redirect("/products");
    }
  }
};


//DELETANDO
exports.getDelete = async (req, res) => {
  await Product.deleteOne({ _id: req.params._id });
  try {
    req.flash("success_msg", "Produto deletado com Sucesso!");
    res.redirect("/products");
  } catch (err) {
    req.flash("error_msg", "Houve um erro interno!");
    res.redirect("/products");
  }
};