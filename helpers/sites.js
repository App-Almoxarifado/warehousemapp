const mongoose = require("mongoose");

require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

module.exports = async (req,res,next) => {
    if(req.isAuthenticated()){
        const user = await Usuario.findById(req.user._id).populate("sites",).lean();
        req.user = user;
        res.locals.sites = user.sites;
        next();
    }
    else {
        req.flash(
        "error_msg",
        "Ops, Você precisa de permissão especial para acessar está área, solicite o desenvolvedor!"
        );
        res.redirect("/");
    }
}