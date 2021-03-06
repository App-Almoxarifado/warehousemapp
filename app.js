//DEPENDÊNCIAS
require("dotenv").config();
const compression = require("compression");
const express = require("express");
const handlebars = require("express-handlebars");
const helpers = require('handlebars-helpers')();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const qr = require("qr-image");
const moment = require("moment");
const morgan = require("morgan");
const methodOverride = require("method-override");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const app = express();

// MODELS

require("./models/Warehouse");
const Warehouse = mongoose.model("warehouses");

//ROTAS

//Grupos
const groupRoute = require("./routes/group-route");
//Subgrupos
const subgroupRoute = require("./routes/subgroup-route");
//Usuarios
const userRoute = require("./routes/user-route");
//Painel Admin
const developerRoute = require("./routes/developer-route");
//Colaboradores
const collaboratorRoute = require("./routes/collaborator-route");
//Fornecedores
const providerRoute = require("./routes/provider-route");
//Clientes
const clientRoute = require("./routes/client-route");
//áreas de locação
const areaRoute = require("./routes/area-route");
//Locações
const locationRoute = require("./routes/location-route");
//Sublocações
const subleaseRoute = require("./routes/sublease-route");
//Intervalos de Certificação/Calibração
const intervalRoute = require("./routes/interval-route");
//Unidades
const unityRoute = require("./routes/unity-route");
//Status
const statusRoute = require("./routes/status-route");
//Tipos de Equipamentos
const typesRoute = require("./routes/type-route");
//Produtos 
const productRoute = require("./routes/product-route");
//Planejamento
const planningRoute = require("./routes/planning-route");
//PEDIDOS
const requestRoute = require("./routes/request-route");
//Obras
const warehouseRoute = require("./routes/warehouse-route");
//PEDIDOS
const transferRoute = require("./routes/transfer-route");
//CONSULTA
const searchRoute = require("./routes/search-route");

const passport = require("passport");
require("./config/auth")(passport);
const db = require("./config/db");

//Configurações
app.use(compression());
app.use("/favicon.ico", express.static("images/favicon.ico"));
app.use(cors());
app.use(cookieParser());

//SESSÕES
app.use(
  session({
    secret: "warehousemapp",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//MIDDLEWARE
app.use(async (req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.warehouseSearch = await Warehouse.find({ 'description':{$nin:['Hbr Central Warehouse','Andritz Hydro Ltda']} })
        .sort({ description: "asc" })
        .lean();
  if (!req.user) {
    const path = `${req.baseUrl}${req.path}`;
    if(/^([A-Za-z0-9]+\/)+/g.test(path) && path !== "/") return res.redirect("/users/login");
  } else {
    res.locals.user = req.user;
    res.locals.sites = req.user.sites;
    req.user.eAdmin = req.user.eAdmin == 1;
    req.user.eDevAdmin = req.user.eDevAdmin == 1;
  }
  next();
});

//BODY PARSER - EXPRESS LIDAR LIDAR COM REQUISIÇÕES URLENCODED, FACILITAR O ENVIO DE ARQUIVOS
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit:50000 }));
//BODY PARSER - EXPRESS LIDAR COM REQUISIÇÕES FORMATO JSON
app.use(bodyParser.json({ limit: "50mb" }));

app.use(methodOverride("_method"));
//LIB DE LOG
app.use(morgan("dev"));
//SALVAR AS IMAGENS EM AMBIENTE DE PRODUÇÃO
app.use(
  "/files",
  express.static(path.resolve(__dirname, "tmp", "uploads"))
);

//HANDLEBARS
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    helpers: {
      formatDate: (date) => {
        return moment(date).format("DD/MM/YYYY HH:mm:ss");
      },
    },
  })
);
// Criação de Helpers customizados
var hbs = handlebars.create({});
// verificar se valores são iguais
hbs.handlebars.registerHelper("if_eq", function (a, b, opts) {
  if (a && b && a.toString() == b.toString()) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

hbs.handlebars.registerHelper("json",(value,opts) => {
  return opts.fn(JSON.stringify(value))
});

hbs.handlebars.registerHelper("find_by_id",(list,_id,opts) => {
  const item = list.find(element => element._id === _id);
  return opts.fn(item)
});

//ESTOQUE OBRA FILTRADA OU ATIVA
hbs.handlebars.registerHelper("find_with_key",(keyValue,list,key,opts) => {
  const item = list.find(element => element[key] == keyValue);
  return opts.fn(item || ({ stock: 0, request: 0}))
});

//ESTOQUE TOTAL
hbs.handlebars.registerHelper("find_with_total",(keyValue,list,key,opts) => {
  const item = list.find(element => element[key] == keyValue);
  return opts.fn(item || ({ stock: 0, request: 0}))
});

//ESTOQUE EM USO - MENOS ALMOX. CENTRAL
hbs.handlebars.registerHelper("find_with_use",(keyValue,list,key,opts) => {
  const item = list.find(element => element[key] == keyValue);
  return opts.fn(item || ({ stock: 0, request: 0}))
});

//ESTOQUE PENDÊNCIAS
hbs.handlebars.registerHelper("find_with_bad",(keyValue,list,key,opts) => {
  const item = list.find(element => element[key] == keyValue);
  return opts.fn(item || ({ stock: 0, request: 0}))
});

//ESTOQUE ALMOXARIFADO CENTRAL
hbs.handlebars.registerHelper("find_with_hbs",(keyValue,list,key,opts) => {
  const item = list.find(element => element[key] == keyValue);
  return opts.fn(item || ({ stock: 0, request: 0}))
});


app.set("view engine", "handlebars");

// Moongoose
//mongoose.Promise = global.Promise;
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
//mongoose.connect("mongodb+srv://bdappalmoxarifado:ddapj060814@cluster0-p1olg.mongodb.net/warehouseapp?retryWrites=true&w=majority").then(() => {
mongoose
  .connect(db.mongoURI)
  .then(() => {
    console.log("conectado ao mongo");
  })
  .catch((err) => {
    console.log("Erro ao se conectar" + err);
  });

//public
app.use(express.static(path.join(__dirname, "public")));



app.get("/qrcode", (req, res) => {
  const url = "https://warehousemapp.herokuapp.com/";
  const code = qr.image(url, { type: "svg" });
  res.type("svg");
  code.pipe(res);
});

app.use(require("./routes"));
app.use("/groups", groupRoute);
app.use("/subgroups", subgroupRoute);
app.use("/users", userRoute);
app.use("/developers", developerRoute);
app.use("/providers", providerRoute);
app.use("/collaborators", collaboratorRoute);
app.use("/warehouses", clientRoute);
app.use("/areas", areaRoute);
app.use("/locations", locationRoute);
app.use("/subleases", subleaseRoute);
app.use("/intervals", intervalRoute);
app.use("/unitys", unityRoute);
app.use("/statuses", statusRoute);
app.use("/types", typesRoute);
app.use("/products", productRoute);
app.use("/planning", planningRoute);
app.use("/requests", requestRoute);
app.use("/warehouses", warehouseRoute);
app.use("/search", searchRoute);

app.use((req, res) => {
  res.render("404");
});

//Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando!");
});
