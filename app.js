//DEPENDÊNCIAS
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require('express-session')
const flash = require('connect-flash')
const multer = require("multer")
const qr = require('qr-image')
const moment = require('moment')
const cors = require("cors")
var cookieParser = require('cookie-parser')
const path = require("path")
const app = express()

//ROTAS

//Grupos
const groupRoute = require('./routes/group-route')
//Produtos
const productRoute = require('./routes/product-route')
//Usuarios
const usuarioRoute = require("./routes/usuario-route")
//Painel Admin
const developerRoute = require("./routes/developer-route")
const passport = require("passport")
require("./config/auth")(passport)
const db = require("./config/db")



//Configurações
app.use(cors())
app.use(cookieParser())
//Sessões
app.use(session({
    secret: "warehousemapp",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
    next()
})

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '5mb'}))

//Handlebars
app.engine('handlebars', handlebars({
        defaultLayout: 'main',
        helpers: {
            formatDate: (date) => {
                return moment(date).format('DD/MM/YYYY')
            }
        }
    }))
    // Criação de Helpers customizados 
var hbs = handlebars.create({});
// verificar se valores são iguais
hbs.handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a && b && a.toString() == b.toString()) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

app.set('view engine', 'handlebars');

// Moongoose
mongoose.Promise = global.Promise;
mongoose.set("useNewUrlParser", true)
mongoose.set("useCreateIndex", true)
mongoose.set("useUnifiedTopology", true)
//mongoose.connect("mongodb+srv://bdappalmoxarifado:ddapj060814@cluster0-p1olg.mongodb.net/warehouseapp?retryWrites=true&w=majority").then(() => {
mongoose.connect(db.mongoURI).then(() => {    
console.log("conectado ao mongo")
}).catch((err) => {
    console.log("Erro ao se conectar" + err)
})


//public
app.use(express.static(path.join(__dirname, "public")))

//Carregando arquivo de upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

//Rotas
app.get("/", (req, res) => {
    res.render("index")
})

//Rota de upload
app.post("/upload", upload.single("file"), (_req, _res) => {
    console.log('Upload Realizado Com Sucesso!')
});


app.get('/qrcode', (req, res) => {
  const url = "https://warehousemapp.herokuapp.com/"
  const code = qr.image(url, {type: 'svg'})  
  res.type('svg')
  code.pipe(res)
})


//app.use('/group', group)
app.use('/groups', groupRoute)
app.use('/products', productRoute)
app.use('/usuarios', usuarioRoute)
app.use('/developers', developerRoute)


//Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Servidor rodando!")
})


