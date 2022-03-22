const fs = require('fs');
const path = require('path');
const db=require("../database/models");
const { Op } = require("sequelize");
const { validationResult } = require('express-validator'); 
const log = console.log;

const productController = {
    prodDetail: (req,res) =>{
        db.Products.findByPk(req.params.productId,
            {include: [ {association: 'ImageProduct'},
                        {association: 'Colours'},
                        {association: 'Sizes'}
        ]})
        .then(product=>{
            log('colores',product.Colours);
            log('sizes',product.Sizes);
            db.Products.findAll({
                where:{[Op.or]: [
                    { idCategory: product.idCategory }, 
                    { idStyle: product.idStyle }
                    ]},
                    limit:4,
                    include: [{association: 'ImageProduct'},
                    {association: "Styles"}]
                })
            .then(prods=>{
                log('imgs',prods[0])
                return res.render("products/productDetail",{product, prods})
            })
            .catch(err => log(err));
        })
        .catch(err=>log(err))
    },
    
    list: (req,res) => {
        log("Entre a producto List")
        db.Products.findAll({
            include:[{association: 'Styles'}, {association: 'ImageProduct'}]
        })
        .then(productList=>{
            log('img',productList[0].ImageProduct[0].urlName)
            return res.render('products/productList', { productList });
        })
        .catch(err => console.log(err));
    },

    create: (req,res) => {
        Promise.all([db.Categories.findAll(),db.Sizes.findAll(),db.Styles.findAll(),db.Colours.findAll()])
        .then(([categories,sizes,styles,colours])=>{
            return res.render("products/productCreate",{sizes,colours,styles,categories})
        })
        .catch(err => log(err));
    },

    store: (req,res)=>{
        console.log('Entrando a Store del productController');
        console.log('Va el req.file: ')
        console.log(req.file);
        console.log('Va req.files: ')
        console.log(req.files);
        console.log('Aca va el BODY: ')
        console.log(req.body);
        const resultValidation = validationResult(req); 
        console.log(resultValidation.errors);
        if(resultValidation.errors.length > 0 ){ 
            Promise.all([db.Categories.findAll(),db.Sizes.findAll(),db.Styles.findAll(),db.Colours.findAll()])
            .then(([categories,sizes,styles,colours])=>{
                return res.render('products/productCreate', { 
                    errors: resultValidation.mapped(), 
                    oldData: req.body,
                    categories, 
                    sizes, 
                    colours,
                    styles
                })
            })
            .catch(err=>log(err))
        }else{ 
            let colorArray = req.body.color;
            let sizesArray = req.body.sizes;
            if(!Array.isArray(req.body.color)) colorArray = [req.body.color];
            if(!Array.isArray(req.body.sizes)) sizesArray = [req.body.sizes];
            let filenamesImgSec = [];
            if(req.files.images){ 
                for(let i =0; i < req.files.images.length; i++) filenamesImgSec.push(req.files.images[i].filename);
            }
            db.Products.create({
                name: req.body.name,
                price: Number(req.body.price),
                description: req.body.description, 
                idStar: 1,
                idCategory: req.body.category,
                idStyle: req.body.Style,
                discount: 0, 
                shipping: 0,
            })
            .then(prod => {
                console.log("Creando producto" ,prod)
                console.log("id del producto",prod.id)
                db.Image_product.create({
                    urlName: req.files.image[0].filename,
                    idproducts: prod.id,
                    order: 1
                })
                .then(res=> log("imagen",res))
                .catch(err => log(err));
                filenamesImgSec.forEach((img,i,arr)=>{
                    db.Image_product.create({
                        urlName: img,
                        idproducts: prod.id,
                        order: i + 2
                    })
                    .then(valor=>log(valor))
                    .catch(err => log(err));
                })
                colorArray.forEach(colour=>{
                    db.colours_product.create({
                        product_id:prod.id, 
                        colour_id: colour
                    })
                    .then()
                    .catch(err=>log(err)); 
                })
                sizesArray.forEach(size=>{
                    db.sizes_product.create({
                        product_id:prod.id,
                        size_id: size
                    })
                    .then()
                    .catch(err=>log(err)); 
                })
            })
            .catch(err => log(err))
            return res.redirect('/'); 
        }
    },
    
    edition: (req,res) => {
        Promise.all([
            db.Products.findByPk(req.params.id,
                {include: [ {association: 'ImageProduct'},
                            {association: 'Colours'},
                            {association: 'Sizes'}
            ]}),
            db.Styles.findAll(),
            db.Categories.findAll(),
            db.Colours.findAll(),
            db.Sizes.findAll()
        ])
        .then(([product,styles,categories,colours,size]) => {
            let colour = colours[0]
            log('colors',product.Colours.find(e=>e.id==colour.id));
            return res.render("products/productEdition", { product,styles,categories,colours,size });
        })
        .catch(err => console.log("producto",err));
    },

    prodEdition: (req,res)=>{
    db.Products.findByPk(req.params.id)
        .then(product => {
            db.Image_product.findOne({where:{idproducts : req.params.id}})
            .then(resI =>  {
                let imgP = resI.urlName
                let colorArray = req.body.color;
                let sizesArray = req.body.sizes;
                if(!Array.isArray(req.body.color)) colorArray = [req.body.color];
                if(!Array.isArray(req.body.sizes)) sizesArray = [req.body.sizes];  
                log("Aca color",colorArray); 
                log("Aca va size", sizesArray)
                let imgSecArray = req.body.imgSec;
                if(!Array.isArray(req.body.imgSec)) imgSecArray = [req.body.imgSec];
                console.log('Aca va Files: ');
                console.log(req.files);
                if (req.files.image){
                    fs.unlinkSync(path.join(__dirname,`../../public/images/products/${imgP.urlName}`))
                    imgP = req.files.image[0].filename;
                }
                if (req.files.images){
                    product['img-se'].forEach(img => {
                        if ( ! imgSecArray.find( imagen => imagen ==  img) ){
                            console.log("Elimina la imagen", img )
                            fs.unlinkSync(path.join(__dirname,`../../public/images/products/${img}`))
                        }
                    });
                    for(let i =0; i < req.files.images.length; i++) imgSecArray.push(req.files.images[i].filename);
                }
                console.log('Aca va BODY: ');
                console.log(req.body);
                db.Products.update(
                {
                    name: req.body.name,
                    price: Number(req.body.price),
                    description: req.body.description, 
                    idStar: 1,
                    idCategory: req.body.category,
                    idStyles: req.body.Style,
                    idColour: colorArray[0],
                    idSize: sizesArray[0]
                },
                {
                    where: {id: product.id}
                })
                .then(()=>{
                    db.Image_product.update({
                        urlName: imgP,
                        idproducts: product.id
                    },
                    {
                        where: {idproducts: product.id}
                    })
                    .then(resImg=>{
                            console.log("imagen",resImg)
                            res.redirect(`/products/${req.params.id}`);
                    })
                    .catch(err => log(err))
                })
                .catch(err => console.log("imagen",err))
            })
            .catch(err => log("imagen",err))
        })
        .catch(err => log("producto",err))
    },

    filter: (req,res)=>{ 
        const query = req.query; 
        console.log("Controller Filter: ",query);
        if (Object.keys(query)[0].indexOf('styles') == 0 ){ 
            db.Products.findAll({
                where:{
                    idStyle: query.styles
                },
                include: [{association: 'ImageProduct'},{association: 'category'},{association: 'Styles'}]
            })
            .then(prods=>{
                let Filtros = [prods[0].Styles];
                return res.render('products/productFilter',{productList:prods, Filtros });
            })
            .catch(err=> console.log(err))
        }else{
            var filtro2 = query.category;
            if (query.category1) filtro2 = query.category1;
            Promise.all([
                db.Products.findAll({
                    where:{
                        [Op.or]: [
                            { idCategory: query.category }, 
                            { idCategory: filtro2 }
                          ]
                    },
                    include: [{association: 'ImageProduct'},{association: 'category'},{association: 'Styles'}]
                }),
                db.Categories.findAll({
                    where: {                    
                        [Op.or]: [
                        { id: query.category }, 
                        { id: filtro2 }
                    ]}
                })
            ])
            .then(([prods,cate])=>{
                if(!Array.isArray(cate)) cate = [cate];
                return res.render('products/productFilter',{productList:prods, Filtros: cate});
            })
            .catch(err=> console.log(err))
        }
    },

    search: (req,res)=>{
        //category, style, search
        log('Entro al controller de Search')
        let query = req.query; 
        if(query.category != 0 && query.style == 0){
        // CASO CATEGORIA NO NULA 
            db.Products.findAll({
                where:{
                    [Op.and]:[
                        {idCategory: query.category},
                        {name: {[Op.like]: "%" + req.query.search + "%"}}
                    ]
                },
                include:[{association: 'ImageProduct'},{association: 'category'},{association: 'Styles'}]
            })
            .then(prods=>{ 
                return res.render('products/search',{productList:prods})
            })
            .catch(err=>log(err))
        }else if(query.category == 0 && query.style != 0){
        // CASO STYLE NO NULO
            db.Products.findAll({
                where:{
                    [Op.and]:[
                        {idStyle: query.style},
                        {name: {[Op.like]: "%" + req.query.search + "%"}}
                    ]
                },
                include:[{association: 'ImageProduct'},{association: 'category'},{association: 'Styles'}]
            })
            .then(prods=>{ 
                return res.render('products/search',{productList:prods})
            })
            .catch(err=>log(err))
        }else if(query.category == 0 && query.style == 0){ 
        // CASO AMBOS NULOS 
            db.Products.findAll({
                where:{
                    name: {[Op.like]: "%" + req.query.search + "%"}
                },
                include:[{association: 'ImageProduct'},{association: 'category'},{association: 'Styles'}]
            })
            .then(prods=>{ 
                return res.render('products/search',{productList:prods})
            })
        }else{ 
        // CASO AMBOS NO NULOS
            db.Products.findAll({
                where:{
                    [Op.and]:[
                        {idStyle: query.style},
                        {idCategory: query.category},
                        {name: {[Op.like]: "%" + req.query.search + "%"}}
                    ]
                },
                include:[{association: 'ImageProduct'},{association: 'category'},{association: 'Styles'}]
            })
            .then(prods=>{ 
                return res.render('products/search',{productList:prods})
            })
            .catch(err=>log(err))
        }
    },

    prodCart: function (req,res){
        //console.log("id del producto ",req.params.id)
        //console.log("cantidad ",req.body.cant)
        //console.log("color ",req.body.color)
        //console.log("talle ",req.body.sizes)
        console.log(localStorage.getItem("carrito"))
        let prod = {id:req.params.id,cant:req.body.cant,color:req.body.color,size:req.body.sizes}

        
        
        res.redirect('/products/productCart')
    },
    prodCart1: function(req,res){
        if(req.cookies.carrito){
            let products = localStorage.getItem("carrito")
            return res.render("products/productCart",{products})
        }else{
            return res.render("products/productCart")
        }
    },
    
    prodCart2: function(req,res) {
        return res.render("products/productCart2")
    },
    
    prodCart3: function(req,res) {
        return res.render("products/productCart3")
    },
    
    prodCart4: function(req,res) {
        if(req.cookies.carrito){
            let products = localStorage.getItem("carrito")
            return res.render("products/productCart4",{products})
        }else{
            return res.render("products/productCart4")
        }
    },
    destroy: (req, res) =>{
        //Primero eliminamos las imagenes 
        db.Image_product.findAll({where:{idproducts:req.params.id}})
        .then(ArrayDeImgs =>{
            ArrayDeImgs.forEach(img=>{
                console.log(path.join(__dirname,`../../public/images/products/${img.urlName}`))
                fs.unlinkSync(path.join(__dirname,`../../public/images/products/${img.urlName}`))
            })
            //Hay que ver si se eliminan todas las imagenes 
            db.Image_product.destroy({
                where:{idproducts:req.params.id}
            })
            .then(db.Products.destroy({
                where:{id: req.params.id}
            }))
            .catch(err=>log(err));
        })
    res.redirect("/products")
    }
}
   
module.exports = productController;
