const mongoose = require("mongoose");
const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

//MODELS
require("./models/Post");
const Post = mongoose.model("posts");
require("./models/Warehouse");
const Warehouse = mongoose.model("warehouses");
require("./models/Product");
const Product = mongoose.model("products");
//INDEX
routes.get("/", async (req, res) => {
    try {
        const warehouseSearch = await Warehouse.find({ 'description':{$nin:['Hbr Central Warehouse','Andritz Hydro Ltda']} })
        .sort({ description: "asc" })
        .lean();

        res.render("index", { warehouseSearch });
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!");
        res.redirect("/");
    }
});


//ROTA 404
routes.get("/404", (req, res) => {
    res.send("Erro 404!");
});


//ROTA PRA MOSTRAR AS IMAGEM SALVAS
routes.get("/uploads", async (req, res) => {
    try {
        var posts = await Post.find().lean();
        res.render("uploads/posts", { posts }
        );
    } catch (err) {
        req.flash("error_msg", "Ops, Houve um erro interno!");
        res.redirect("/types");
    }
})

//ROTA PARA UPLOAD DE IMAGEM
routes.post("/upload", multer(multerConfig).single("file"), async (req, res) => {
    try {
        const { originalname: name, size, key, location: url = "" } = req.file;
        const posts = new Post({
            name,
            size,
            key,
            url
        });
        await posts.save();
        req.flash("success_msg", "Imagem salva com sucesso!");
        //res.redirect("/");
        return console.log(posts);
    } catch (err) {
        req.flash(
            "error_msg",
            "Ops, Houve um erro ao salvar o tipo, tente novamente!"
        );
        res.redirect("/");
    }
})

//DELETANDO UM PRODUTO
routes.get("/uploads/delete/:id", async (req, res) => {
    const post = await Post.findById(req.params.id,);
    await post.remove()
    try {
        req.flash("success_msg", "Post deletado com Sucesso!");
        res.redirect("/");
    } catch (err) {
        req.flash("error_msg", "Houve um erro interno!");
        res.redirect("/");
    }
})


module.exports = routes;