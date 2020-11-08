const mongoose = require("mongoose");
require("../models/Product");
const Product = mongoose.model("products");
require("../models/Group");
const Group = mongoose.model("groups");
require("../models/Subgroup");
const Subgroup = mongoose.model("subgroups");
require("../models/Warehouse");
const Warehouse = mongoose.model("warehouses");
require("../models/Location");
const Location = mongoose.model("locations");
require("../models/Sublease");
const Sublease = mongoose.model("subleases");
require("../models/Status");
const Status = mongoose.model("statuses");
require("../models/Type");
const Type = mongoose.model("types");
require("../models/Unity");
const Unity = mongoose.model("unitys");
require("../models/Interval");
const Interval = mongoose.model("intervals");
require("../models/Provider");
const Provider = mongoose.model("providers");
require("../models/Collaborator");
const Collaborator = mongoose.model("collaborators");
require("../models/Request");
const Request = mongoose.model("requests");
require("../models/Planning");
const Planning = mongoose.model("plannings");

//SITES
exports.sites = async (req, res) => {
  try {
    const warehouse = req.params.id;

    if (req.user.admin)
      warehouses = await Warehouse.find({ active: true })
        .sort({ description: "asc" })
        .lean();
    else warehouses = req.user.sites;

    const warehouseMatch = {
      $match: {
        warehouse: warehouse ? { $eq: warehouse } : { $in: warehouses.map(w => w._id) }
      }
    };

    const warehouseCard = await Product.aggregate([
      warehouseMatch,
      {
        $group: {
          _id: "$warehouse",
          qty: {
            $sum: 1
          },
          qtyStock: {
            $sum: "$qtyStock"
          },
          qtyReservation: {
            $sum: "$qtyReservation"
          },
          weightKg: {
            $sum: "$weightKg"
          },
          faceValue: {
            $sum: "$faceValue"
          }
        }
      },
      {
        $lookup:
        {
          from: "warehouses",
          localField: "_id",
          foreignField: "_id",
          as: "warehouse"
        }
      },
      { $unwind: "$warehouse" },
    ]);

    res.render("planning/sites", {
      warehouseCard,
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!" + err);
    res.redirect("/products");
  }
};


//DASHBOARD
exports.dashboard = async (req, res) => {
  try {
    const warehouse = req.params.id;

    if (req.user.admin)
      warehouses = await Warehouse.find({ active: true })
        .sort({ description: "asc" })
        .lean();
    else warehouses = req.user.sites;

    const warehouseMatch = {
      $match: {
        warehouse: warehouse ? { $eq: warehouse } : { $in: warehouses.map(w => w._id) }
      }
    };

    const warehouseChart = await Product.aggregate([
      warehouseMatch,
      { $group: { _id: "$warehouse", quant: { $sum: 1 }, quantity: { $sum: "$qtyStock" } } },
      { $lookup: { from: "warehouses", localField: "_id", foreignField: "_id", as: "warehouse" } }
    ]);

    const groupChart = await Product.aggregate([
      warehouseMatch,
      { $group: { _id: "$group", quant: { $sum: 1 }, quantity: { $sum: "$qtyStock" } } },
      { $lookup: { from: "groups", localField: "_id", foreignField: "_id", as: "group" } }
    ]);

    const typeChart = await Product.aggregate([
      warehouseMatch,
      { $group: { _id: "$type", quant: { $sum: 1 }, quantity: { $sum: "$qtyStock" } } },
      { $lookup: { from: "types", localField: "_id", foreignField: "_id", as: "type" } }
    ]);

    const statusChart = await Product.aggregate([
      warehouseMatch,
      { $group: { _id: "$status", quant: { $sum: 1 }, quantity: { $sum: "$qtyStock" } } },
      { $lookup: { from: "statuses", localField: "_id", foreignField: "_id", as: "status" } }
    ]);

    res.render("planning/dashboard", {
      warehouseChart,
      groupChart,
      typeChart,
      statusChart,
      warehouses
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!" + err);
    res.redirect("/products");
  }
};

exports.planning = async (req, res) => {
  try {
    const warehouse = req.params._id
    const siteNow = await Warehouse.findOne({ _id: req.params._id }).lean().populate("site")
    const warehouses = await Warehouse.find({ active: true })
      .sort({ description: "asc" })
      .lean();
    /*
    if(req.user.admin)
      warehouses = await Warehouse.find({ active: true })
      .sort({ description: "asc" })
      .lean();
    else warehouses = req.user.sites;
    */
    const groups = await Group.find({ active: true })
      .sort({ description: "asc" })
      .lean();

    const subgroups = await Subgroup.find({ active: true })
      .sort({ description: "asc" })
      .lean();

    const types = await Type.find({ active: true })
      .sort({ description: "asc" })
      .lean();

    const statuses = await Status.find({ active: true })
      .sort({ description: "asc" })
      .lean();

    const filtros = {
      $or: [],
      $and: [],
    };

    let {
      search,
      page,
      site,
      group,
      subgroup,
      type,
      status,
      limit,
    } = req.query;

    if (!!search) {
      const pattern = new RegExp(`.*${search}.*`);
      filtros["$or"].push(
        { description: { $regex: pattern, $options: 'i' } },
        { fullDescription: { $regex: pattern, $options: 'i' } },
        { tag: { $regex: pattern, $options: 'i' } },
        { user: { $regex: pattern, $options: 'i' } }
      );
    }

    if (!!site) filtros["$and"].push({ warehouse: site });
    if (!!group) filtros["$and"].push({ group: group });
    if (!!subgroup) filtros["$and"].push({ subgroup: subgroup });
    if (!!type) filtros["$and"].push({ type: type });
    if (!!status) filtros["$and"].push({ status: status });

    page = Number(page || 1);
    limit = limit ? Number(limit) : 10;

    if (filtros["$and"].length === 0) delete filtros["$and"];
    if (filtros["$or"].length === 0) delete filtros["$or"];

    const quant = await Product.find(filtros).estimatedDocumentCount();

    var products = await Product.find(filtros)
      .sort({
        editionDate: "desc",
      })
      .limit(limit).lean()
      .skip(page > 1 ? (page - 1) * limit : 0)
      .populate("group")
      .populate("subgroup")
      .populate("type")
      .populate("status")

    res.render("planning/planning", {
      products,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      warehouses,
      groups,
      subgroups,
      types,
      statuses,
      page,
      search,
      limit,
      site,
      group,
      subgroup,
      type,
      status,
      siteNow,
      warehouse
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!" + err);
    res.redirect("/products");
  }
};

exports.postPlanning = async (req, res) => {
  const { description, qtyRequest, warehouse } = req.body;

  if (!description || !qtyRequest) {
    res.render("planning/planning", {
      erros: [{
        texto: "Você precisa informar uma quantidade solicitada!",
      }],
    });
  } else {
    try {
      const request = await Request.create({
        description,
        qtyRequest,
        warehouse,
        user: req.user.name,
        tag: req.body.description
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
          .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
          .replace(/(^-+|-+$)/, "")
      });

      //console.log(request)
      req.flash("success_msg", "Produto solicitado, enviado para pedido!");
      res.redirect(`/planning/${warehouse}`);
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o Produto, tente novamente!" + err
      );
      res.redirect("/planning");
    }
  }
};

exports.requestFromWarehouse = async (req, res) => {
  try {
    const warehouseOrigin = req.params.id;
    const { description, tag, qtyRequest, warehouse } = req.body;
    const products = await Product.find({
      "warehouse": warehouseOrigin
    });
    const requests = description.map((description, i) => ({
      description,
      qtyRequest: qtyRequest[i],
      tag: tag[i],
      warehouse: warehouse,
      user: req.user.name
    }))

    await Request.create(requests);
    req.flash("success_msg", "Produtos solicitados com sucesso, enviado para pedido!");
    res.redirect(`/planning/request/${warehouse}`);
  } catch (e) {
    console.log(e);
  }
}

//VIZUALIZANDO PRODUTOS CARRINHO
exports.getRequest = async (req, res) => {
  try {
    const warehouse = req.params._id
    const siteNow = await Warehouse.findOne({ _id: warehouse }).lean().populate("site")
    const numberRequest = Date.now()
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
    limit = limit ? Number(limit) : 10;
    const quant = await Request.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const requests = await Request.aggregate([
      { $match: filtros.length > 0 ? { $or: filtros } : { status: "Em Andamento" } },
      { $unwind: "$description" },
      { $sort: { description: 1 } },
      { $skip: page > 1 ? (page - 1) * limit : 0 },
      { $limit: limit }
    ])
    res.render("planning/request", {
      requests,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file,
      quant,
      numberRequest,
      warehouse,
      siteNow
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!" + err);
    res.redirect("/planning");
  }
};

exports.products = async (req, res) => {
  try {
    const warehouse = await Warehouse.findOne({ _id: req.params._id }).lean().populate("site")
    if (req.user.admin)
      warehouses = await Warehouse.find({ active: true })
        .sort({ description: "asc" })
        .lean();
    else warehouses = req.user.sites;
    const quant = await Product.find({ warehouse: warehouse }).countDocuments()
    const products = await Product.find({ warehouse: warehouse }).lean()

    /*const products = await Product.aggregate([
      {
        $group: {
           _id: "$description",
           count: { $sum: 1 }
        }
      },
    ])*/

    res.render("planning/products", {
      products,
      warehouses,
      warehouse,
      quant
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!" + err);
    res.redirect("/products");
  }
};


//DELETANDO
exports.getDelete = async (req, res) => {
  await Request.deleteOne({ _id: req.params._id });
  try {
    req.flash("success_msg", "Produto deletado com Sucesso!");
    res.redirect("/products");
  } catch (err) {
    req.flash("error_msg", "Houve um erro interno!");
    res.redirect("/products");
  }
};

//FINALIZANDO SOLICITAÇÃO POR ID
exports.post = async (req, res) => {
  var erros = [];
  if (
    !req.body.qty ||
    typeof req.body.qty == undefined ||
    req.body.qty == null
  ) {
    erros.push({
      texto: "Você precisa informar uma quantidade solicitada!",
    });
  }
  if (erros.length > 0) {
    res.render("planning/products", {
      erros: erros,
    });
  } else {
    try {
      await Planning.create({
        product: req.body.product,
        //user:req.user.name,
      });
      //await plannings.save();
      req.flash("success_msg", "Pedido Finalizado!" + " " + req.user.nome);
      res.redirect("/planning");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o Produto, tente novamente!" + err
      );
      res.redirect("/planning");
    }
  }
};

//EDITANDO UM PEDIDO
exports.getUpdate = async (req, res) => {
  try {
    const file = req.file
    var request = await Request.findOne({ _id: req.params._id }).lean();
    res.render("planning/updateRequest", { request: request, file });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/planning");
  }
};

//POST FINALIZANDO PEDIDO
exports.postUpdate = async (req, res) => {
  var request = await Request.findOne({ _id: req.body._id });
  const file = req.file
  var erros = [];
  if (
    !req.body.note ||
    typeof req.body.note == undefined ||
    req.body.note == null
  ) {
    erros.push({
      texto: "Descreva alguma observação",
    });
  }
  if (erros.length > 0) {
    res.render("/planning/updateRequest", {
      file,
      erros: erros,
    });
  } else {
    try {
      request.image = req.file.location,
        request.key = req.file.key,
        request.note = req.body.note,

        await request.save();
      req.flash("success_msg", "Observação criada com sucesso!!!");
      res.redirect("/planning");
      console.log("Produto editado com sucesso!");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o tipo, tente novamente!" + err
      );
      res.redirect("/planning");
    }
  }
};

//VIZUALIZANDO PRODUTOS CARRINHO
exports.transfer = async (req, res) => {
  try {
    const warehouseOrigin = req.params.id;
    const requests = await Request.updateMany({
      warehouse: warehouseOrigin,
      //status: "Em andamento"
    }, {
      requestNumber: Date.now(),
      status: "Solicitado"

    })
    //await requests.save();
    console.log(requests)
    req.flash("success_msg", "Produtos solicitados com sucesso, enviado para pedido!");
    res.redirect("/planning");
  } catch (e) {
    console.log(e);
  }
}