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

exports.products = async (req, res) => {
    try {
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
  
      res.render("planning/products", {
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
        status
      });
    } catch (err) {
      console.log(err);
      req.flash("error_msg", "Ops, Houve um erro interno!" + err);
      res.redirect("/products");
    }
  };