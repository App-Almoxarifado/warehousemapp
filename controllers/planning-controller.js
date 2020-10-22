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
const Location = mongoose.model("leases");
require("../models/Sublease");
const Sublease = mongoose.model("subleases");
require("../models/Status");
const Status = mongoose.model("status");
require("../models/Type");
const Type = mongoose.model("types");
require("../models/Unity");
const Unity = mongoose.model("unitys");
require("../models/Interval");
const Interval = mongoose.model("breaks");
require("../models/Provider");
const Provider = mongoose.model("providers");
require("../models/Collaborator");
const Collaborator = mongoose.model("collaborators");
require("../models/Request");
const Request = mongoose.model("requests");
require("../models/Planning");
const Planning = mongoose.model("plannings");



//DASHBOARD
exports.dashboard = async (req, res) => {
  try {
    /*
    const customers = await Client.find({ active: true })
      .sort({ description: "asc" })
      .lean();
    */
    
    if(req.user.admin)
      customers = await Client.find({ active: true })
      .sort({ description: "asc" })
      .lean().populate("site");
    else customers = req.user.sites;
    
    const groups = await Group.find({ active: true })
      .sort({ description: "asc" })
      .lean();

    const subgroups = await Subgroup.find({ active: true })
      .sort({ description: "asc" })

      .lean();

    const types = await Type.find({ active: true })
      .sort({ description: "asc" })
      .lean();

    /*
    const statuses = await Status.find({ active: true })
      .sort({ description: "asc" })
      .lean();
      */

    const filtros = {
      $or: [],
      $and:[],
    };

    let {
      search,
      page,
      //site,
      group,
      subgroup,
      type,
      //status,
      limit,
    } = req.query;

    if (!!search) {
      const pattern = new RegExp(`.*${search}.*`);
      filtros["$or"].push(
        { description: { $regex: pattern, $options: 'i' } },
        { capacityReach: { $regex: pattern, $options: 'i' } },
        { stockCode: { $regex: pattern, $options: 'i' } }
      );
    }

    //if (!!site) filtros["$and"].push({ client: site });
    if (!!group) filtros["$and"].push({ group: group });
    if (!!subgroup) filtros["$and"].push({ subgroup: subgroup });
    if (!!type) filtros["$and"].push({ kindOfEquipment: type });
    //if (!!status) filtros["$and"].push({ physicalStatus: status });

    page = Number(page || 1);
    limit = limit ? Number(limit) : 10;

    if (filtros["$and"].length === 0) delete filtros["$and"];
    if (filtros["$or"].length === 0) delete filtros["$or"];

    const quant = await Product.find(filtros).estimatedDocumentCount();

    const stock = await Product.aggregate([
      {
        $group: {
          _id: "$group",
          quant: {
            $sum: 1
          },
          quantity: {
            $sum: "$description"
          },
          qu: {
            $sum: "$description"
          }
        }
      }
    ])
    //console.log(stock)
    
    const groupChart = await Product.aggregate([
      {
        $match: filtros.length > 0 ? { $or: filtros } : {}
      },
      {
        $group: {
          _id: "$group",
          quant: {
            $sum: 1
          },
          quantity: {
            $sum: "$stockQuantity"
          }
        }
      },
      {
        $lookup:
        {
          from: "groups",
          localField: "_id",
          foreignField: "_id",
          as: "group"
        }
      }
    ])

    const typeChart = await Product.aggregate([
      {
        $match: filtros.length > 0 ? { $or: filtros } : { active: true }
      },
      {
        $group: {
          _id: "$kindOfEquipment",
          quant: {
            $sum: 1
          },
          quantity: {
            $sum: "$stockQuantity"
          }
        }
      },
      {
        $lookup:
        {
          from: "types",
          localField: "_id",
          foreignField: "_id",
          as: "tp"
        }
      }
    ])

    var products = await Product.find(filtros)
      .sort({
        editionDate: "desc",
      })
      .limit(limit).lean()
      .skip(page > 1 ? (page - 1) * limit : 0)
      .populate("group")
      .populate("subgroup")
      .populate("client")
      .populate("local")
      .populate("sublease")
      .populate("physicalStatus")
      .populate("kindOfEquipment")
      .populate("unity")
      .populate("frequency")
      .populate("provider")
      .populate("userLaunch")
      .populate("userEdition")
      .populate("unity")
      .populate("frequency")
      .populate("provider");
    //console.log(groupChart)
    res.render("planning/planning", {
      products,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      customers,
      group,
      groups,
      subgroups,
      types,
      page,
      search,
      limit,
      subgroup,
      type,
      stock,
      groupChart,
      typeChart
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products");
  }
};


exports.request = async (req, res) => {
  try {
    var siteId = await Client.findOne({ _id: req.params.id }).lean();
    if (siteId) {
      if(req.user.admin)
      var customers = await Client.findOne({_id: siteId})
      .lean();
      else customers = req.user.sites;
    }
    const groups = await Group.find({ active: true })
      .sort({ description: "asc" })
      .lean();

    const subgroups = await Subgroup.find({ active: true })
      .sort({ description: "asc" })
      .lean();

    const types = await Type.find({ active: true })
      .sort({ description: "asc" })
      .lean();

    const filtros = {
      $or: [],
      $and: [],
    };

    let {
      search,
      page,
      group,
      subgroup,
      type,
      limit,
    } = req.query;

    if (!!search) {
      const pattern = new RegExp(`.*${search}.*`);
      filtros["$or"].push(
        { tag: { $regex: pattern, $options: 'i' } },
        { name: { $regex: pattern, $options: 'i' } },
        { capacityReach: { $regex: pattern, $options: 'i' } },
        { description: { $regex: pattern, $options: 'i' } },
      );
    }
    if (!!group) filtros["$and"].push({ group: group });
    if (!!subgroup) filtros["$and"].push({ subgroup: subgroup });
    if (!!type) filtros["$and"].push({ kindOfEquipment: type });

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
      .populate("kindOfEquipment")
      
    res.render("planning/products", {
      products,
      prev: Number(page) > 1,
      next: Number(page) * limit < quant,
      group,
      groups,
      subgroups,
      types,
      page,
      search,
      limit,
      subgroup,
      type,
      siteId,
      customers,
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!"+err);
    res.redirect("/products");
  }
};
exports.postRequest = async (req, res) => {
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
      const requests = new Request({
        product:req.body._id,
        qty:req.body.qty,
        user:req.user.name,
        tag:req.body.tag
      });
      await requests.save();
      req.flash("success_msg", "Produto solicitado, enviado para pedido!");
      res.redirect("/planning/products/" + requests.product);
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o Produto, tente novamente!" + err
      );
      res.redirect("/planning");
    }
  }
};

//VIZUALIZANDO PRODUTOS CARRINHO
exports.getRequest = async (req, res) => {
  try {
    var siteId = await Client.findOne({ _id: req.params.id }).lean();
    if (siteId) {
      if(req.user.admin)
      var customers = await Client.findOne({_id: siteId})
      .lean();
      else customers = req.user.sites;
    }

    const file = req.file
    const filtros = [];
    let { search, page, limit } = req.query;
    if (!!search) {
        const pattern = new RegExp(`.*${search}.*`);
        filtros.push(
            { tag: { $regex: pattern, $options: 'i' } },
            { note: { $regex: pattern, $options: 'i' } },

        );
    }
    page = Number(page || 1);
    limit = limit ? Number(limit) : 5;
    const quant = await Request.find(
        filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const requests = await Request.aggregate([
        { $match: filtros.length > 0 ? { $or: filtros } : { active: true } },
        { $sort: { description: -1 } },
        { $skip: page > 1 ? (page - 1) * limit : 0 },
        { $limit: limit },      
        {
            $lookup:
            {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "prodImg"
            }
        },
        { $unwind: "$prodImg" },
        {
          $lookup:
          {
              from: "products",
              localField: "product",
              foreignField: "_id",
              as: "prodDesc"
          }
      },
      { $unwind: "$prodDesc" },
    ])

    res.render("planning/request", {
        requests,
        prev: Number(page) > 1,
        next: Number(page) * limit < quant,
        page,
        limit,
        file,
        quant,
        customers,
        siteId
    });
} catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/planning");
}
};

//FINALIZANDO SOLICITAÇÃO POR ID
exports.postPlanning = async (req, res) => {
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
      const plannings = new Planning({
        products:req.body._id,
        user:req.user.name,
        site:req.body.site
      });
      await plannings.save();
      req.flash("success_msg", "Pedido Finalizado!" + " " + req.user.nome);
      res.redirect("/planning");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o Produto, tente novamente!" 
      );
      res.redirect("/planning");
    }
  }
};


//VIZUALIZANDO PEDIDOS
exports.getTransfer = async (req, res) => {
  try {
    var siteId = await Client.findOne({ _id: req.params.id }).lean();
    if (siteId) {
      if(req.user.admin)
      var customers = await Client.findOne({_id: siteId})
      .lean();
      else customers = req.user.sites;
    }

    const file = req.file
    const filtros = [];
    let { search, page, limit } = req.query;
    if (!!search) {
        const pattern = new RegExp(`.*${search}.*`);
        filtros.push(
            { tag: { $regex: pattern, $options: 'i' } },
            { note: { $regex: pattern, $options: 'i' } },

        );
    }
    page = Number(page || 1);
    limit = limit ? Number(limit) : 5;
    const quant = await Request.find(
        filtros.length > 0 ? { $or: filtros } : {}
    ).estimatedDocumentCount();

    const plannings = await Planning.aggregate([
        { $match: filtros.length > 0 ? { $or: filtros } : { active: true } },
        { $sort: { description: -1 } },
        { $skip: page > 1 ? (page - 1) * limit : 0 },
        { $limit: limit },  
        { $unwind : "$products" },
        {
          $lookup:
          {
              from: "requests",
              localField: "products",
              foreignField: "_id",
              as: "prodImg"
          }
      },
      { $unwind: "$prodImg" },
      {
        $lookup:
        {
            from: "requests",
            localField: "products",
            foreignField: "_id",
            as: "prodDesc"
        }
    },
    { $unwind: "$prodDesc" },    
    ])

    res.render("planning/transfer", {
        plannings,
        prev: Number(page) > 1,
        next: Number(page) * limit < quant,
        page,
        limit,
        file,
        quant,
        customers,
        siteId
    });
} catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/planning");
}
};

