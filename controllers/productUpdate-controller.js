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

//EDITANDO UM PRODUTO
exports.getUpdate = async (req, res) => {
  try {
    var product = await Product.findOne({
      _id: req.params.id,
    }).lean();
    var groups = await Group.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();
    var subgroups = await Subgroup.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();
    var customers = await Client.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();
    var leases = await Location.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();
    var subleases = await Sublease.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();
    var status = await Status.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();
    var types = await Type.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();
    var units = await Unity.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();
    var breaks = await Interval.find({
      active: true,
    })
      .sort({
        description: "asc",
      })
      .lean();
    var providers = await Provider.find({
      active: true,
    })
      .sort({
        name: "asc",
      })
      .lean();
    var collaborators = await Collaborator.find({
      active: true,
    })
      .sort({
        name: "asc",
      })
      .lean();
    res.render("products/editproducts", {
      user: req.user,
      groups: groups,
      subgroups: subgroups,
      customers: customers,
      leases: leases,
      subleases: subleases,
      status: status,
      types: types,
      units: units,
      breaks: breaks,
      providers: providers,
      product: product,
      collaborators: collaborators,
    });
  } catch (_err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products");
  }
};

exports.postUpdate = async (req, res) => {
  var product = await Product.findOne({
    _id: req.body.id,
  });
  var erros = [];
  if (req.body.group == "0") {
    erros.push({
      texto: "Grupo inválido, registre um grupo",
    });
  }
  if (req.body.subgroup == "0") {
    erros.push({
      texto: "Subgrupo inválido, registre um subgrupo",
    });
  }
  if (req.body.client == "0") {
    erros.push({
      texto: "Site inválido, registre um cliente",
    });
  }
  if (req.body.local == "0") {
    erros.push({
      texto: "Locação inválida, registre um local",
    });
  }
  if (req.body.sublease == "0") {
    erros.push({
      texto: "Sublocação inválida, registre um sublocação",
    });
  }
  if (req.body.physicalStatus == "0") {
    erros.push({
      texto: "Status inválido, registre um status",
    });
  }
  if (req.body.kindOfEquipment == "0") {
    erros.push({
      texto: "Tipo de equipamento inválido, registre um tipo de equipamento",
    });
  }

  if (req.body.unity == "0") {
    erros.push({
      texto: "Unidade inválida, registre uma unidade",
    });
  }

  if (req.body.frequency == "0") {
    erros.push({
      texto: "Periodicidade inválida, registre uma periodicidade",
    });
  }

  if (req.body.provider == "0") {
    erros.push({
      texto: "Fornecedor inválido, registre um fornecedor",
    });
  }

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
    !req.body.group ||
    typeof req.body.group == undefined ||
    req.body.group == null
  ) {
    erros.push({
      texto: "Grupo Inválido",
    });
  }

  if (req.body.description.length < 2) {
    erros.push({
      texto: "Descrição do produto muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("products/editproducts", {
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

      product.outputQuantity = 0;

      product.stockQuantity = req.body.inputAmount - req.body.outputQuantity;

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

      //product.responsibleSite= req.body.client,

      //product.responsibleMaterial= req.body.client,

      //product.totalFaceValue=req.body.inputAmount * req.body.faceValue,

      //product.totalWeightKg=req.body.inputAmount * req.body.weightKg,

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
      req.flash("success_msg", "Produto editado com Sucesso!");
      res.redirect("/products/request");
    } catch (err) {
      req.flash(
        "error_msg",
        "Houve um erro interno ao editar o Produto, tente Novamente!" + err
      );
      res.redirect("/products");
    }
  }
};
