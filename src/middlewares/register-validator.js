const {body} = require('express-validator'); 
const path = require('path');
var db = require('../database/models');
const { Op } = require("sequelize");
const log = console.log; 

var fecha = new Date(); 
var mes = fecha.getMonth() + 1;  
var dia = fecha.getDate(); 
var anio = fecha.getFullYear();
var f = new Date(anio,mes,dia); 

const validator = [
    body('userName').notEmpty().withMessage('Debe escribir un nombre de usuario').bail()
        .isLength({min:3}).withMessage('Debe tener minimo 3 caracteres').bail()
        .custom( async (value,{req})=>{
            let user = await db.Users.findOne({
                where:{
                    userName : req.body.userName
                }
            })
            if(user != undefined) throw new Error('Elija otro nombre de Usuario');
            return true 
        }), 

    body('name').notEmpty().withMessage('Debe escribir un nombre'),
    
    body('surname').notEmpty().withMessage('Debe escribir un apellido'),
    
    body('email').notEmpty().withMessage('Debes escribir un correo electrónico').bail()
        .isEmail().withMessage('Debes escribir un formato de correo válido').bail()
        .custom(async (value, {req})=>{
            log('Entre a email-validator REGISTER');
            let user = await db.Users.findOne({
                where:{
                    email:req.body.email
                }
            })
            //.then(user => {
            console.log(user);
            if( user != undefined ) throw new Error('El un email ya registrado debe ingresar otro')
            //})
            //.catch(err=>log(err));
            return true;
        }),

    body('password').notEmpty().withMessage('Escriba una contraseña').bail()
        .isLength({min:6}).withMessage('Debe tener minimo 6 caracteres'), 
    
    body('confirmPassword').notEmpty().withMessage('Escriba una contraseña').bail()
        .isLength({min:6}).withMessage('Debe tener minimo 6 caracteres').bail()
        .custom((value, {req})=>{
            var pas = req.body.password; 
            var pass = req.body['confirmPassword']; 
            if (pas != pass) throw new Error('Debe poner la misma contraseña');
            return true;
        }), 

    body('dni').notEmpty().withMessage('Debe un DNI').bail()
        .isLength({min:7, max:9}).withMessage('Escriba un DNI valido'),

    body('fNac').notEmpty().withMessage('Debe elegir una fecha').bail()
        .trim()
        .isDate().withMessage('Debe ser una fecha valida'),

    body('image').custom((value, { req }) => {
        let file = req.file;  
        let acceptedExtensions = ['.jpg', '.png', '.gif'];
        if( file ) {
            let fileExtension = path.extname(file.originalname);
            if (!acceptedExtensions.includes(fileExtension.toLowerCase())) {
                throw new Error(`Las extensiones de archivo permitidas son ${acceptedExtensions.join(', ')}`);
            }
        }
        return true;
    }), 

]

module.exports = validator; 
