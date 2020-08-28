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
const Unity = mongoose.model("units");
require("../models/Interval");
const Interval = mongoose.model("breaks");
require("../models/Provider");
const Provider = mongoose.model("providers");
require("../models/Collaborator");
const Collaborator = mongoose.model("collaborators");

//VIZUALIZANDO PRODUTOS POR GRUPO
exports.getGroup = async (req, res) => {
  try {
  var group = await Group.findOne({ _id: req.params.id }).lean()
  if(group){
    var products = await Product.find({ group: group._id }).lean()
  }
  console.log(group)
      res.render("products/productorders", { group: group, products:products })
  } catch (_err) {
      req.flash("error_msg", "Ops, Houve um erro interno!" + err)
      res.redirect("/products")
  }
}


//VIZUALIZANDO PRODUTOS PARA FAZER PEDIDO
exports.getRequest = async (req, res) => {
  try {
    var customers = await Client.find({active: true,}).sort({description: "asc",}).lean();
    var groups = await Group.find({active: true,}).sort({description: "asc",}).lean();
    var subgroups = await Subgroup.find({active: true,}).sort({description: "asc",}).lean();
    var types = await Type.find({active: true,}).sort({description: "asc",}).lean();
    var statuses = await Status.find({active: true,}).sort({description: "asc",}).lean();
    
    const filtros= {
      $or: [],
      $and: []
    };

    let { search, page, site, group, subgroup, type, status, limit } = req.query;

    if (!!search) {
      const pattern = new RegExp(`.*${search}.*`);
      filtros["$or"].push(
        {qrcode: {$regex: pattern }},
        {description: {$regex: pattern }},
        {user: {$regex: pattern }}
      );
    }

    !!site && filtros["$and"].push({ client: site });
    if (!!group) filtros["$and"].push({ group: group });
    if (!!subgroup) filtros["$and"].push({ subgroup: subgroup });
    if (!!type) filtros["$and"].push({ kindOfEquipment: type });
    if (!!status) filtros["$and"].push({ physicalStatus: status });

    page = Number(page || 1);
    limit = limit ? Number(limit) : 10;

    if(filtros["$and"].length === 0) delete filtros["$and"];
    if(filtros["$or"].length === 0) delete filtros["$or"];

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
    res.render("products/productorders", {
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
      status
    });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products/products");
  }
};

//VIZUALIZANDO PRODUTOS CARRINHO
exports.getCart = async (req, res) => {
  try {
    var numberRequest = Date.now();
    var products = await Product.find({ active: "cart" })
      .lean()
      .populate("group")
      .populate("subgroup")
      .populate("client")
      .populate("physicalStatus")
      .populate("kindOfEquipment")
      .populate("kindOfEquipment")
      .populate("unity")
      .populate("frequancy")
      .populate("provider");

    var customers = await Client.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();

    console.log(req.user);
    return res.render("products/cartproducts", {
      user: req.user,
      products: products,
      customers: customers,
      numberRequest,
    });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products", {});
  }
  console.log(user);
};

//VIZUALIZANDO PRODUTOS CARRINHO
exports.getCart_request = async (req, res) => {
  try {
    var numberRequest = Date.now();
    var products = await Product.find({ active: "cart" })
      .lean()
      .populate("group")
      .populate("subgroup")
      .populate("client")
      //.populate("localArea")
      .populate("local")
      .populate("sublease")
      .populate("physicalStatus")
      .populate("kindOfEquipment")
      .populate("unity")
      .populate("frequancy")
      .populate("provider")
      .populate("userLaunch")
      .populate("userEdition");

    var customers = await Client.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();

    console.log(req.user);
    return res.render("products/productscart", {
      user: req.user,
      products: products,
      customers: customers,
      numberRequest,
    });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products", {});
  }
  console.log(user);
};

//FINALIZANDO SOLICITAÇÃO POR ID
exports.postRequest = async (req, res) => {
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
      texto: "Descrição do produto muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("products/addproducts", {
      erros: erros,
    });
  } else {
    try {
      const products = new Product({
        qrcode:
          req.body.patrimonialAsset
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
            .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
            .replace(/(^-+|-+$)/, "") +
          req.body.description
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
            .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
            .replace(/(^-+|-+$)/, "") +
          req.body.manufacturer
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
            .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
            .replace(/(^-+|-+$)/, "") +
          req.body.model
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
            .replace(/(^-+|-+$)/, "") +
          req.body.serialNumber
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
            .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
            .replace(/(^-+|-+$)/, ""),

        image: req.body.image,

        group: req.body.group,

        subgroup: req.body.subgroup,

        fullDescription:
          req.body.patrimonialAsset +
          " " +
          req.body.description +
          " " +
          req.body.manufacturer +
          " " +
          req.body.model +
          " " +
          req.body.capacityReach +
          " " +
          req.body.serialNumber,

        stockCode:
          req.body.description
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
            .replace(/(^-+|-+$)/, ""),

        client: req.body.client,

        localArea: req.body.localArea,

        local: req.body.local,

        sublease: req.body.sublease,

        patrimonialAsset: req.body.patrimonialAsset,

        description: req.body.description,

        manufacturer: req.body.manufacturer,

        model: req.body.model,

        capacityReach: req.body.capacityReach,

        serialNumber: req.body.serialNumber,

        physicalStatus: req.body.physicalStatus,

        kindOfEquipment: req.body.kindOfEquipment,

        requiresCertificationCalibration:
          req.body.requiresCertificationCalibration,

        inputAmount: req.body.inputAmount.replace(",", "."),

        inputAmountSite: req.body.inputAmount.replace(",", "."),

        outputQuantity: 0,

        stockQuantity: req.body.inputAmount - req.body.outputQuantity,

        unity: req.body.unity,

        weightKg: req.body.weightKg,

        faceValue: req.body.faceValue.replace(",", "."),

        dimensionsWxLxH: req.body.dimensionsWxLxH,

        certificate: req.body.certificate,

        entityLaboratory: req.body.entityLaboratory,

        frequency: req.body.frequency,

        calibrationDate: req.body.calibrationDate,

        calibrationValidity: req.body.calibrationValidity,

        calibrationStatus: req.body.calibrationStatus,

        po: req.body.po,

        sapCode: req.body.sapCode,

        ncmCode: req.body.ncmCode,

        provider: req.body.provider,

        invoce: req.body.invoce,

        receivingDate: req.body.receivingDate,

        note: req.body.note,

        activeStatus: req.body.activeStatus,

        releaseDateOf: req.body.releaseDateOf,

        userLaunch: req.body.userLaunch,

        emailLaunch: req.body.emailLaunch,

        editionDate: req.body.editionDate,

        userEdtion: req.body.userEdtion,

        emailEdtion: req.body.emailEdtion,

        //responsibleSite: req.body.client,

        //responsibleMaterial: req.body.client,

        //totalFaceValue:req.body.inputAmount * req.body.faceValue,

        //totalWeightKg:req.body.inputAmount * req.body.weightKg,

        tags: [
          req.body.group,
          req.body.subgroup,
          req.body.client,
          req.body.local,
          req.body.sublease,
          req.body.client,
          req.body.physicalStatus,
          req.body.kindOfEquipment,
          req.body.responsibleMaterial,
        ],
      });
      await products.save();
      req.flash("success_msg", "Produto solicitado, enviado para pedido!");
      res.redirect("/products/request");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o Produto, tente novamente!" + err
      );
      res.redirect("/products");
    }
  }
};

//COLOCANDO PRODUTO NO CARRINHO COM UM CLIQUE
exports.updateRequest = async (req, res) => {
  var product = await Product.findOne({ _id: req.body.id });
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
      texto: "Descrição do produto muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("products/addproducts", {
      erros: erros,
    });
  } else {
    try {
      product.qrcode =
        req.body.patrimonialAsset
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
          .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
          .replace(/(^-+|-+$)/, "") +
        req.body.description
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
          .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
          .replace(/(^-+|-+$)/, "") +
        req.body.manufacturer
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
          .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
          .replace(/(^-+|-+$)/, "") +
        req.body.model
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
          .replace(/(^-+|-+$)/, "") +
        req.body.serialNumber
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove acentos
          .replace(/([^\w]+|\s+)/g, "") // Retira espaço e outros caracteres
          .replace(/\-\-+/g, "") // Retira multiplos hífens por um único hífen
          .replace(/(^-+|-+$)/, "");

      product.image = req.body.image;

      product.group = req.body.group;

      product.subgroup = req.body.subgroup;

      product.fullDescription =
        req.body.patrimonialAsset +
        " " +
        req.body.description +
        " " +
        req.body.manufacturer +
        " " +
        req.body.model +
        " " +
        req.body.capacityReach +
        " " +
        req.body.serialNumber;

      product.stockCode =
        req.body.description
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
          .replace(/(^-+|-+$)/, "");

      product.client = req.body.client;

      product.localArea = req.body.localArea;

      product.local = req.body.local;

      product.sublease = req.body.sublease;

      product.patrimonialAsset = req.body.patrimonialAsset;

      product.description = req.body.description;

      product.manufacturer = req.body.manufacturer;

      product.model = req.body.model;

      product.capacityReach = req.body.capacityReach;

      product.serialNumber = req.body.serialNumber;

      product.physicalStatus = req.body.physicalStatus;

      product.kindOfEquipment = req.body.kindOfEquipment;

      product.requiresCertificationCalibration =
        req.body.requiresCertificationCalibration;

      product.inputAmount = req.body.inputAmount.replace(",", ".");

      product.inputAmountSite = req.body.inputAmount.replace(",", ".");

      product.outputQuantity = req.body.outputQuantity.replace(",", ".");

      //product.stockQuantity = req.body.inputAmount - req.body.outputQuantity

      product.unity = req.body.unity;

      product.weightKg = req.body.weightKg;

      product.faceValue = req.body.faceValue.replace(",", ".");

      product.dimensionsWxLxH = req.body.dimensionsWxLxH;

      product.certificate = req.body.certificate;

      product.entityLaboratory = req.body.entityLaboratory;

      product.frequency = req.body.frequency;

      product.calibrationDate = req.body.calibrationDate;

      product.calibrationValidity = req.body.calibrationValidity;

      product.calibrationStatus = req.body.calibrationStatus;

      product.po = req.body.po;

      product.sapCode = req.body.sapCode;

      product.ncmCode = req.body.ncmCode;

      product.provider = req.body.provider;

      product.invoce = req.body.invoce;

      product.receivingDate = req.body.receivingDate;

      product.note = req.body.note;

      product.activeStatus = req.body.activeStatus;

      product.releaseDateOf = req.body.releaseDateOf;

      product.userLaunch = req.body.userLaunch;

      product.emailLaunch = req.body.emailLaunch;

      product.editionDate = req.body.editionDate;

      product.userEdtion = req.body.userEdtion;

      product.emailEdtion = req.body.emailEdtion;

      //product.responsibleSite= req.body.client

      //product.responsibleMaterial= req.body.client

      //product.totalFaceValue=req.body.inputAmount * req.body.faceValue

      //product.totalWeightKg=req.body.inputAmount * req.body.weightKg

      product.active = "cart";

      product.tags = [
        req.body.group,
        req.body.subgroup,
        req.body.client,
        req.body.local,
        req.body.sublease,
        req.body.client,
        req.body.physicalStatus,
        req.body.kindOfEquipment,
        req.body.responsibleMaterial,
      ];

      await product.save();
      req.flash("success_msg", "Produto solicitado!");
      res.redirect("/products/cart");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o Produto, tente novamente!" 
      );
      res.redirect("/products");
    }
  }
};
