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

exports.search = async (req, res) => {
  try {
    const warehouse = req.params._id;
    const siteNow = await Warehouse.findOne({ _id: req.params._id })
      .lean()
      .populate("site");

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
        { description: { $regex: pattern, $options: "i" } },
        { fullDescription: { $regex: pattern, $options: "i" } },
        { tag: { $regex: pattern, $options: "i" } },
        { user: { $regex: pattern, $options: "i" } }
      );
    }

    if (!!site)
      filtros["$and"].push({ warehouse: mongoose.Types.ObjectId(site) });
    if (!!group)
      filtros["$and"].push({ group: mongoose.Types.ObjectId(group) });
    if (!!subgroup)
      filtros["$and"].push({ subgroup: mongoose.Types.ObjectId(subgroup) });
    if (!!type) filtros["$and"].push({ type: mongoose.Types.ObjectId(type) });
    if (!!status)
      filtros["$and"].push({ status: mongoose.Types.ObjectId(status) });

    if (filtros["$and"].length === 0) delete filtros["$and"];
    if (filtros["$or"].length === 0) delete filtros["$or"];

    //NO SITE FILTRADO
    const siteProducts = await Product.aggregate([
      { $match: { warehouse: mongoose.Types.ObjectId(site) } },
      {
        $group: {
          _id: "$tag",
          stock: { $sum: "$qtyStock" },
          request: { $sum: "$qtyReservation" },
        },
      },
    ]);

    //TOTAL NA HBS
    const totalProducts = await Product.aggregate([
      {
        $group: {
          _id: "$tag",
          stock: { $sum: "$qtyStock" },
        },
      },
    ]);

    //PRODUTOS EM USO
    const hbs = "5f4517adcb7b9f1394dbc002";
    const useProducts = await Product.aggregate([
      { $match: { warehouse: { $nin: [mongoose.Types.ObjectId(hbs)] } } },
      {
        $group: {
          _id: "$tag",
          stock: { $sum: "$qtyStock" },
        },
      },
    ]);

    //PRODUTOS COM PENDÊNCIA
    const bad1 = "5f01252e038643547805dbec";
    const bad2 = "5f01252e038643547805dbed";
    const badProducts = await Product.aggregate([
      {
        $match: {
          status: {
            $in: [mongoose.Types.ObjectId(bad1), mongoose.Types.ObjectId(bad2)],
          },
        },
      },
      {
        $group: {
          _id: "$tag",
          stock: { $sum: "$qtyStock" },
        },
      },
    ]);

    //PRODUTOS EM USO
    const centralHbs = "5f4517adcb7b9f1394dbc002";
    const hbsProducts = await Product.aggregate([
      { $match: { warehouse: { $in: [mongoose.Types.ObjectId(centralHbs)] } } },
      {
        $group: {
          _id: "$tag",
          stock: { $sum: "$qtyStock" },
        },
      },
    ]);

    page = Number(page || 1);
    limit = limit ? Number(limit) : 10;

    const quant = await Product.find(filtros).estimatedDocumentCount();

    /* var products = await Product.find(filtros)
      .sort({
        editionDate: "desc",
      })
      .limit(limit)
      .lean()
      .skip(page > 1 ? (page - 1) * limit : 0)
      .populate("group")
      .populate("subgroup")
      .populate("type")
      .populate("status");*/

    console.log(filtros);
    const products = await Product.aggregate([
      { $match: filtros },
      { $match: { active: { $in: [true] } } },
      { $skip: page > 1 ? (page - 1) * limit : 0 },
      { $limit: limit },
      { $sort: { tag: 1 } },
      {
        $group: {
          _id: {
            type: "$type",
            tag: "$tag",
            group: "$group",
            subgroup: "$subgroup",
            //warehouse:"$warehouse",
            description: "$description",
          },
          qtySite: { $sum: "$qtyStock" },
          qtyRequest: { $sum: "$qtyReservation" },
          qty: { $sum: "$qtyStock" },
          qtyUse: { $sum: "$qtyStock" },
          badAmount: { $sum: "$qtyStock" },
          qtyHbs: { $sum: "$qtyStock" },
        },
      },
      {
        $lookup: {
          from: "groups",
          localField: "_id.group",
          foreignField: "_id",
          as: "group",
        },
      },
      { $unwind: "$group" },
      {
        $lookup: {
          from: "subgroups",
          localField: "_id.subgroup",
          foreignField: "_id",
          as: "subgroup",
        },
      },
      { $unwind: "$subgroup" },
      {
        $lookup: {
          from: "types",
          localField: "_id.type",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: "$type" },
      /*{
          $lookup:
          {
            from: "warehouses",
            localField: "_id.warehouse",
            foreignField: "_id",
            as: "warehouse"
          }
        },
        { $unwind: "$warehouse" },*/
    ]);
    // console.log(products)

    res.render("search/search", {
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
      warehouse,
      siteProducts,
      totalProducts,
      useProducts,
      badProducts,
      hbsProducts,
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!" + err);
    res.redirect("/search");
  }
};

//PRODUTOS
exports.products = async (req, res) => {
  try {
    const tag = req.params.tag;
    console.log(tag);
    const file = req.file;
    const filtros = [];
    let { search, page, limit } = req.query;
    if (!!search) {
      const pattern = new RegExp(`.*${search}.*`);
      filtros.push(
        { tag: { $regex: pattern, $options: "i" } },
        { name: { $regex: pattern, $options: "i" } },
        { capacityReach: { $regex: pattern, $options: "i" } },
        { description: { $regex: pattern, $options: "i" } },
        { fullDescription: { $regex: pattern, $options: "i" } }
      );
    }
    page = Number(page || 1);
    limit = limit ? Number(limit) : 5;
    const quant = await Product.find(
      filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const products = await Product.aggregate([
      {
        $match: filtros.length > 0 ? { $or: filtros } : { tag: { $in: [tag] } },
      },
      { $sort: { description: -1 } },
      { $skip: page > 1 ? (page - 1) * limit : 0 },
      { $limit: limit },
      {
        $lookup: {
          from: "collaborators",
          localField: "userCreated",
          foreignField: "_id",
          as: "created",
        },
      },
      { $unwind: "$created" },
      {
        $lookup: {
          from: "collaborators",
          localField: "userUpdated",
          foreignField: "_id",
          as: "updated",
        },
      },
      { $unwind: "$updated" },
      {
        $lookup: {
          from: "groups",
          localField: "group",
          foreignField: "_id",
          as: "group",
        },
      },
      { $unwind: "$group" },
      {
        $lookup: {
          from: "subgroups",
          localField: "subgroup",
          foreignField: "_id",
          as: "subgroup",
        },
      },
      { $unwind: "$subgroup" },
      {
        $lookup: {
          from: "types",
          localField: "type",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: "$type" },
    ]);

    res.render("search/products", {
      products,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      page,
      limit,
      file,
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products");
  }
};
