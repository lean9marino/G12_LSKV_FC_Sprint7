const fs = require('fs');
const path = require('path');
const db=require("../database/models");
const { Op } = require("sequelize");
const { validationResult } = require('express-validator'); 
const log = console.log;
const err = console.error;

const productController = {
    prodDetail: async (req,res) =>{
        try{
            let product = await db.Products.findByPk(req.params.productId,
                {include: [ {association: 'ImageProduct'},
                            {association: 'Colours'},
                            {association: 'Sizes'}
                        ]})
            log('colores',product.Colours);
            log('sizes',product.Sizes);

            let prods = await db.Products.findAll({
                    where:{[Op.or]: [
                        { idCategory: product.idCategory }, 
                        { idStyle: product.idStyle }],
                        [Op.not]:[{id:product.id}]
                    },
                        limit:4,
                        include: [{association: 'ImageProduct'},
                        {association: "Styles"}]
                    })
            log('imgs',prods[0])
            return res.render("products/productDetail",{product, prods})
        }catch (err){
            err('err Prod Detail',err)
        }
        
    },
    
    list: async(req,res) => {
        log("Entre a producto List")
        try{
            let productList = await db.Products.findAll({
                include:[{association: 'Styles'}, {association: 'ImageProduct'}]
            })
            return res.render('products/productList', { productList });
        }catch (err){
            err('Error Prod List',err)
        }
    },

    create: async(req,res) => {
        try{
            let categories = await db.Categories.findAll(); 
            let sizes = await db.Sizes.findAll(); 
            let styles = await db.Styles.findAll(); 
            let colours = await db.Colours.findAll(); 
            return res.render("products/productCreate",{sizes,colours,styles,categories})
        }catch(err){
            err('Error Prod Create',err)
        }
    },

    store: async(req,res)=>{
        log('Entrando a Store del productController');
        log('Va el req.file: ')
        log(req.file);
        log('Va req.files: ')
        log(req.files);
        log('Aca va el BODY: ')
        log(req.body);
        if(req.body.color == undefined) req.body.color = [0];
        if(req.body.sizes == undefined) req.body.sizes = [0];
        const resultValidation = validationResult(req); 
        console.log(resultValidation.errors);
        if(resultValidation.errors.length > 0 ){ 
            try{
                let categories = await db.Categories.findAll(); 
                let sizes = await db.Sizes.findAll(); 
                let styles = await db.Styles.findAll(); 
                let colours = await db.Colours.findAll(); 
                return res.render('products/productCreate', { 
                    errors: resultValidation.mapped(), 
                    oldData: req.body,
                    categories, 
                    sizes,
                    styles, 
                    colours
                })
            }catch(err){
                err('Error Prod Store',err)
            }
            
        }else{ 
            let colorArray = req.body.color;
            let sizesArray = req.body.sizes;
            if(!Array.isArray(req.body.color)) colorArray = [req.body.color];
            if(!Array.isArray(req.body.sizes)) sizesArray = [req.body.sizes];
            let filenamesImgSec = [];
            if(req.files.images){ 
                for(let i =0; i < req.files.images.length; i++) filenamesImgSec.push(req.files.images[i].filename);
            }

            try{
                let prod = await db.Products.create({
                    name: req.body.name,
                    price: Number(req.body.price),
                    description: req.body.description, 
                    idStar: 1,
                    idCategory: req.body.category,
                    idStyle: req.body.Style,
                    discount: 0,
                    shipping: 0,
                })
                log("Creando producto" ,prod)
                log("id del producto",prod.id)

                db.Image_product.create({
                    urlName: req.files.image[0].filename,
                    idproducts: prod.id,
                    order: 1
                })
                filenamesImgSec.forEach((img,i,arr)=>{
                    db.Image_product.create({
                        urlName: img,
                        idproducts: prod.id,
                        order: 2 + i
                    })
                    .then(valor=>log(valor))
                    .catch(err => log(err));
                })
                colorArray.forEach(colour=>{
                    db.colours_product.create({
                        product_id:prod.id, 
                        colour_id: colour
                    })
                    .catch(err=>err('Error Color ',err)); 
                })
                sizesArray.forEach(size=>{
                    db.sizes_product.create({
                        product_id:prod.id,
                        size_id: size
                    })
                    .catch(err=>err('Error Sizes',err)); 
                })
                res.redirect('/products')
            }catch(err){
                err('Error Prod Store',err)
            }
        }
    },
    
    edition: async(req,res) => {
        try{
            let product = await db.Products.findByPk(req.params.id,
                {include: [ {association: 'ImageProduct'},
                            {association: 'Colours'},
                            {association: 'Sizes'}
            ]})
            let styles = await db.Styles.findAll()
            let categories = await db.Categories.findAll()
            let colours = await db.Colours.findAll()
            let sizes = await db.Sizes.findAll()
            return res.render("products/productEdition", { product,styles,categories,colours,sizes });
        }catch(err){
            err('Error Prod Edit',err)
        }
    },

    prodEdition: async(req,res)=>{
        let colorArray = req.body.color;
        let sizesArray = req.body.sizes;
        if(!Array.isArray(req.body.color)) colorArray = [req.body.color];
        if(!Array.isArray(req.body.sizes)) sizesArray = [req.body.sizes]; 

        let imgSecArray = req.body.imgSec; // ID de las imagenes seleccionadas en el form (para delete)
        if(!Array.isArray(req.body.imgSec)) imgSecArray = [req.body.imgSec];

        let filenamesImgSec = [];
        if(req.files.images){ 
            for(let i =0; i < req.files.images.length; i++) filenamesImgSec.push(req.files.images[i].filename);
        }

        log('Aca va Files:',req.files);
        log('Aca va BODY:',req.body);

        const resultValidation = validationResult(req); 
        log(resultValidation.errors);
        if( resultValidation.errors.length > 0 ){
            try{
                let product = await db.Products.findByPk(req.params.id,
                    {include: ['ImageProduct','Colours','Sizes'
                ]})
                let styles = await db.Styles.findAll()
                let categories = await db.Categories.findAll()
                let colours = await db.Colours.findAll()
                let sizes = await db.Sizes.findAll()
                let oldData = req.body;
                oldData.color = colorArray;
                oldData.sizes = sizesArray;
                oldData.imgSec = imgSecArray;
                log('Aca OldDATA: ',oldData);
                return res.render('products/productEdition', { 
                    errors: resultValidation.mapped(),
                    oldData,
                    categories, 
                    sizes,
                    styles,
                    colours,
                    product
                })
            }catch(err){
                err(err)
            }

        }else{
            try{
                db.Products.update(
                    {
                        name: req.body.name,
                        price: Number(req.body.price),
                        description: req.body.description, 
                        idStar: 1,
                        idCategory: Number(req.body.category),
                        idStyle: Number(req.body.Style),
                        discount: 0, 
                        shipping: 0,
                    },
                    {
                        where: {id: req.params.id}
                    }
                )
                db.colours_product.destroy({where:{product_id:req.params.id}})
                .then(()=>{// creacion de las a partir de los datos dentro de las arrays del form
                    colorArray.forEach(colour=>{
                        db.colours_product.create({
                            product_id:req.params.id, 
                            colour_id: colour
                        })
                        .catch(err=>log(err)); 
                    })
                 })

                db.sizes_product.destroy({where:{product_id:req.params.id}})
                .then(()=>{
                sizesArray.forEach(size=>{
                    db.sizes_product.create({
                        product_id:req.params.id,
                        size_id: size
                        })
                    .catch(err=>log(err)); 
                    })
                })
                imgSecArray.forEach( async imgSec=>{
                    log('ID Img a Eliminar',imgSec);
                    let imgS = await db.Image_product.findByPk(imgSec)
                    fs.unlink(path.join(__dirname,`../../public/images/products/${imgS.urlName}`),(err=>{
                        if(err) {
                            log('Eliminacion de imgs Sec:',err);
                        }else{ 
                            console.log("\nDeleted file: example_file.txt");
                        }
                    }))
                    db.Image_product.destroy({where:{
                        id:imgSec
                    }})
                })
                filenamesImgSec.forEach(img=>{
                    db.Image_product.create({
                        urlName: img,
                        idproducts: req.params.id,
                        order: 2 
                    })
                })

                if (req.files.image){
                    let imgPV = await db.Image_product.findOne({
                        where:{[Op.and]:[{idproducts:req.params.id},{order:1}]
                    }})//busqueda de la imagen principal
                    log("ImagenP vieja",imgPV)
                    fs.unlink(path.join(__dirname,`../../public/images/products/${imgPV.urlName}`),(err=>{
                        if(err) {
                            log(err);
                        }else{ 
                            console.log("\nDeleted file: example_file.txt");
                        }
                    }))
                    db.Image_product.update({//cambiando el urlname de la img principal
                        urlName: req.files.image[0].filename,
                    },{where:{[Op.and]:[{idproducts:req.params.id},{order:1}]}})
                }

                return res.redirect("/products")
            }catch(err){
                err(err)
            }
        }
    },

    filter: async (req,res)=>{ 
        const query = req.query; 
        console.log("Controller Filter: ",query);
        if (Object.keys(query)[0].indexOf('styles') == 0 ){ 
            try{
                let prods = await db.Products.findAll({
                    where:{
                        idStyle: query.styles
                    },
                    include: [{association: 'ImageProduct'},{association: 'category'},{association: 'Styles'}]
                })
                let Filtros = [prods[0].Styles];
                return res.render('products/productFilter',{productList:prods, Filtros });

            }catch(err){
                err('Error Prod filter',err)
            }
        }else{
            let filtro2 = query.category;
            if (query.category1) filtro2 = query.category1;
            try{
                let prods = await  db.Products.findAll({
                    where:{
                        [Op.or]: [
                            { idCategory: query.category }, 
                            { idCategory: filtro2 }
                          ]
                    },
                    include: [{association: 'ImageProduct'},{association: 'category'},{association: 'Styles'}]
                })
                let cate = await db.Categories.findAll({
                    where: {                    
                        [Op.or]: [
                        { id: query.category }, 
                        { id: filtro2 }
                    ]}
                })
                if(!Array.isArray(cate)) cate = [cate];
                return res.render('products/productFilter',{productList:prods, Filtros: cate});
            }catch(err){
                err(err)
            }
        }
    },

    search: async(req,res)=>{
        log('Entro al controller de Search')
        let query = req.query; 
        if(query.category != 0 && query.style == 0){
        // CASO CATEGORIA NO NULA 
            try{
                let prods = await db.Products.findAll({
                    where:{
                        [Op.and]:[
                            {idCategory: query.category},
                            {name: {[Op.like]: "%" + req.query.search + "%"}}
                        ]
                    },
                    include:[{association: 'ImageProduct'},{association: 'category'},{association: 'Styles'}]
                })
                return res.render('products/search',{productList:prods})
            }catch(err){
                err(err)
            }
        }else if(query.category == 0 && query.style != 0){
        // CASO STYLE NO NULO
            try{
                let prods = await db.Products.findAll({
                    where:{
                        [Op.and]:[
                            {idStyle: query.style},
                            {name: {[Op.like]: "%" + req.query.search + "%"}}
                        ]
                    },
                    include:[{association: 'ImageProduct'},{association: 'category'},{association: 'Styles'}]
                })
                return res.render('products/search',{productList:prods})
            }catch(err){
                err(err)
            }
            
        }else if(query.category == 0 && query.style == 0){ 
        // CASO AMBOS NULOS 
            try{
                let pros = await  db.Products.findAll({
                    where:{
                        name: {[Op.like]: "%" + req.query.search + "%"}
                    },
                    include:[{association: 'ImageProduct'},{association: 'category'},{association: 'Styles'}]
                })
                return res.render('products/search',{productList:prods})
            }catch(err){
                err(err)
            }
        }else{ 
        // CASO AMBOS NO NULOS
            try{
                let prods = await  db.Products.findAll({
                    where:{
                        [Op.and]:[
                            {idStyle: query.style},
                            {idCategory: query.category},
                            {name: {[Op.like]: "%" + req.query.search + "%"}}
                        ]
                    },
                    include:[{association: 'ImageProduct'},{association: 'category'},{association: 'Styles'}]
                })
                return res.render('products/search',{productList:prods})
            }catch(err){
                err(err)
            }
        }
    },

    prodCart: function (req,res){
        let prod = [req.params.id,req.body.cant,req.body.sizes,req.body.color]

        res.cookie('carrito', prod, {maxAge:60000*60*60});
        console.log("cokieeee",req.cookies.carrito)

        res.redirect('/products/productCart')
        res.redirect('/products/productCart')
    },
    prodCart1: function(req,res){
        if(req.cookies.carrito){
            log(req.cookies.carrito)
            db.Products.findByPk(req.cookies.carrito[0],
                {include: [ {association: 'ImageProduct'},
                            {association: 'Colours'},
                            {association: 'Sizes'}
            ]})
            .then(product =>{
                log('colores',product.Colours);
                log('sizes',product.Sizes);

                let size = product.Sizes.find(siz => siz.id == req.cookies.carrito[2])
                log("Talle encontrado:",size)

                let color = product.Colours.find(col => col.id == req.cookies.carrito[3])
                log("color encontrado:",color)

                let cant = Number(req.cookies.carrito[1])
                let total = product.price*cant
                
                return res.render("products/productCart",{product,size,color,cant,total}) 
            })
            .catch(err => log("error carrito", err))
            
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
            log(req.cookies.carrito)
            db.Products.findByPk(req.cookies.carrito[0],
                {include: [ {association: 'ImageProduct'},
                            {association: 'Colours'},
                            {association: 'Sizes'}
            ]})
            .then(product =>{
                log('colores',product.Colours);
                log('sizes',product.Sizes);

                let size = product.Sizes.find(siz => siz.id == req.cookies.carrito[2])
                log("Talle encontrado:",size)

                let color = product.Colours.find(col => col.id == req.cookies.carrito[3])
                log("color encontrado:",color)

                let cant = Number(req.cookies.carrito[1])
                let total = product.price*cant
                
                return res.render("products/productCart4",{product,size,color,cant,total}) 
            })
            .catch(err => log("error carrito", err))
        }else{
            return res.render("products/productCart4")
        }
    },
    destroy: async (req, res) =>{
        try{
            //Primero eliminamos las imagenes 
            let ArrayDeImgs = await db.Image_product.findAll({
                where:{idproducts:req.params.id}
            })
            if(!Array.isArray(ArrayDeImgs)) ArrayDeImgs = [ArrayDeImgs];
            ArrayDeImgs.forEach(img=>{
                fs.unlink(path.join(__dirname,`../../public/images/products/${img.urlName}`),(err => {
                    if (err) console.log(err);
                    else {
                      console.log("\nDeleted file: example_file.txt");
                    }
                }));
            })
            db.Image_product.destroy({
                where:{idproducts:req.params.id}
            })
            
            //Luego eliminamos los colores y sizes 
            db.colours_product.destroy({where:{product_id:req.params.id}});
            db.sizes_product.destroy({where:{product_id:req.params.id}})
            .then(()=>{
                db.Products.destroy({
                    where:{id: req.params.id}
                    })
            })
            return res.redirect("/products");
        }catch(err){
            err(err)
        }
    }
}
   
module.exports = productController;
