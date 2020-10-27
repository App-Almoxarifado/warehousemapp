const mongoose = require("mongoose");
require("../models/Product");
const Product = mongoose.model("products");
require("../models/Group");
const Group = mongoose.model("groups");
require("../models/Subgroup");
const Subgroup = mongoose.model("subgroups");
require("../models/Client");
const Client = mongoose.model("customers");
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

//VIZUALIZANDO DASHBOARD
exports.getDashboard = async (req, res) => {
  try {
    var customers = await Client.find({ active: true })
      .sort({ description: "asc" })
      .lean();
    var groups = await Group.find({ active: true })
      .sort({ description: "asc" })
      .lean();
    var subgroups = await Subgroup.find({ active: true })
      .sort({ description: "asc" })
      .lean();
    var types = await Type.find({ active: true })
      .sort({ description: "asc" })
      .lean();
    var statuses = await Status.find({ active: true })
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
        { qrcode: { $regex: pattern } },
        { description: { $regex: pattern } },
        { user: { $regex: pattern } }
      );
    }

    !!site && filtros["$and"].push({ client: site });
    if (!!group) filtros["$and"].push({ group: group });
    if (!!subgroup) filtros["$and"].push({ subgroup: subgroup });
    if (!!type) filtros["$and"].push({ kindOfEquipment: type });
    if (!!status) filtros["$and"].push({ physicalStatus: status });

    page = Number(page || 1);
    limit = limit ? Number(limit) : 5;

    if (filtros["$and"].length === 0) delete filtros["$and"];
    if (filtros["$or"].length === 0) delete filtros["$or"];

    const quant = await Product.find(filtros).estimatedDocumentCount();

    var products = await Product.find(filtros)
      .sort({
        editionDate: "desc",
      })
      .limit(limit)
      .skip(page > 1 ? (page - 1) * limit : 0)
      .populate("group")
      .populate("subgroup")
      .populate("client")
      .populate("local")
      .populate("sublease")
      .populate("physicalStatus")
      .populate("kindOfEquipment")
      .populate("kindOfEquipment")
      .populate("unity")
      .populate("frequency")
      .populate("provider")
      .populate("userLaunch")
      .populate("userEdition")
      .populate("unity")
      .populate("frequency")
      .populate("provider");
    res.render("dashboards/dashboards", {
      products: products.map((products) => products.toJSON()),
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      customers,
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
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products");
  }
};

//VIZUALIZANDO DASHBOARD MOBILE
exports.getDashboardMobile = async (req, res) => {
  try {
    var customers = await Client.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();

    var groups = await Group.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();

    const filtros = [];
    let { search, page } = req.query;
    if (search) {
      const pattern = new RegExp(`.*${search}.*`);
      filtros.push({
        qrcode: {
          $regex: pattern,
        },
      });
      filtros.push({
        description: {
          $regex: pattern,
        },
      });
      filtros.push({
        user: {
          $regex: pattern,
        },
      });
      filtros.push({
        tags: {
          $regex: pattern,
        },
      });
    }

    page = page || 1;

    const quant = await Product.find(
      filtros.length > 0
        ? {
            $or: filtros,
          }
        : {}
    ).estimatedDocumentCount();

    var products = await Product.find(
      filtros.length > 0
        ? {
            $or: filtros,
          }
        : {}
    )
      .sort({
        editionDate: "desc",
      })
      .limit(5)
      .skip(page && Number(page) > 1 ? Number(page - 1) * 5 : 0)
      .populate("group")
      .populate("subgroup")
      .populate("client")
      .populate("local")
      .populate("sublease")
      .populate("physicalStatus")
      .populate("kindOfEquipment")
      .populate("kindOfEquipment")
      .populate("unity")
      .populate("frequency")
      .populate("provider")
      .populate("userLaunch")
      .populate("userEdition")
      .populate("unity")
      .populate("frequency")
      .populate("provider");

    res.render("dashboards/mobile", {
      products: products.map((products) => products.toJSON()),
      prev: Number(page) > 1,
      next: Number(page) * 5 < quant,
      customers: customers,
      groups: groups,
      page,
    });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products/products");
  }
};
