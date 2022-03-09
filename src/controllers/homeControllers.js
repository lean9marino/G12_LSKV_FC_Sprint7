const db = require("../database/models");

const homeController = {
   index: (req,res) =>{
        Promise.all([db.Categories.findAll(),db.Styles.findAll()])
        .then(([categories,styles])=>{
             return res.render("home1/home", 
             {
                  categories ,
                  styles
          });
        })
        .catch(err=>console.log(err));
        },
   locals: (req,res) =>{
        return res.render("locals");
        },
   contact: (req,res) =>{
        return res.render("contact");
        },
   business: (req,res) =>{
          return res.render("empresa")
        },
   logout: (req,res) => {
        delete req.session.a
        res.redirect('/')
   },
}

module.exports = homeController; 