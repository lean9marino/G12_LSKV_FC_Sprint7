const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
let db = require('../database/models');
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const { connect } = require('http2');
const log = console.log; 



const usersController = {
    login: function(req,res) {
		res.render('users/login')
    },
    session: function (req,res){
		const resultValidation = validationResult(req);
		log('Resultados de Validacion BACK')
		log(resultValidation);
		log('Req Body')
		log(req.body)
		if (resultValidation.isEmpty()) {
            let usuario=undefined;
			db.Users.findAll()
			.then(users=> {
				for (let i=0; i<users.length; i++) {
					if(users[i].email==req.body.email || users[i].userName==req.body.email ){
						var esPass = bcrypt.compareSync(req.body.password,users[i].password);
						if(esPass){
							usuario = users[i];
							break;
						}
					}
				}
				if(usuario== undefined){
					return res.render('users/login', {errors: [
						{msg: 'Lo sentimos, no encontramos tu cuenta'}
					]})	
				}
				console.log(usuario)
				req.session.a=usuario;
				res.redirect(`/users/${req.session.a.id}`)
			});
		}else {
			return res.render("users/login", {errors: resultValidation.errors})
		}
	},
    register: function(req,res) {
        return res.render("users/register");
    },
	store: function(req, res){
		const resultValidation = validationResult(req);
		console.log('Aca va el file: ');
		console.log(req.file);
		console.log(resultValidation.errors)
		if (resultValidation.errors.length > 0) {
			return res.render('users/register', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
		}else {
			console.log('Aca va el BODY: ')
			console.log(req.body);
			const contraEncritada = bcrypt.hashSync(req.body.password,10); 
			console.log('contraEncritada:');
			console.log(contraEncritada);
			db.Users.create({
				userName: req.body.userName, 
				name: req.body.name, 
				email: req.body.email, 
				dni: Number(req.body.dni), 
				date_of_birth: req.body.fNac, 
				password: contraEncritada,
				lastName: req.body.surname,
				idRoles: 0
			})
			.then(user=>{
				if (req.file){
					db.Image_users.create({
						url_name:req.file.filename,
						idUsers: user.id
					})
				}else { 
					db.Image_users.create({
						url_name:'default.png',
						idUsers: user.id
					})
				}
			})
			.catch(err=>log(err));
			return res.redirect(`/`);
		}
	},

	delete: function(req,res){
		db.Users.destroy({where: {id:req.params.id}})
		db.Image_users.findOne({where:{idUsers:req.params.id}})
		.then(imgU=>{
			fs.unlinkSync(path.join(__dirname,`../../public/images/users/${imgU.url_name}`))
			db.Image_users.destroy({where: {idUsers:req.params.id}})
			return res.redirect('/users');
		})
		.catch(err=>log(err))
	},

	list: (req,res)=>{
		db.Users.findAll({
			include: [{association: 'image_users'}]
		})
		.then(users =>{
			res.render('users/usersList',{ users });
		})
		.catch(err=>log(err))
	},

	usuario: (req,res)=>{
		db.Users.findByPk(req.params.id,
			{
				include:[{association: 'image_users'}]
			})
		.then(user=>{
			return res.render('users/usuario',{ element : user});
		})
		.catch(err=>log(err))
    }, 

	edition: (req,res) =>{
		db.Users.findByPk(req.params.id,
			{
				include:[{association: 'image_users'}]
			})
		.then(user=>{
			return res.render(`users/userEdit`,{ element : user});
		})
		.catch(err=>log(err))
	}, 
	update: (req,res)=>{
		db.Users.update({
			userName: req.body['user-name'], 
			name: req.body.name, 
			email: req.body.email, 
			dni: Number(req.body.dni), 
			date_of_birth: req.body.fNac, 
			lastName: req.body.surname,
			idRoles: 0
		},{
			where:{id:req.params.id}
		})
		.then(user=>{
			log('Aca va BODY: '); 
			log(req.body); 
			log('Aca va File: '); 
			log(req.file); 
			db.Image_users.findOne({
				where:{
					idUsers:user.id
				}
			})
			.then(img=>{
				if(req.file){
					if(img != null) fs.unlinkSync(path.join(__dirname,`../../public/images/users/${img.url_name}`)); 
					db.Image_users.update({
						url_name:req.file.filename
					},{
						where:{idUsers:user.id}
					})
				}else if(req.body['img-default'] == 'on'){
					if(img != null) fs.unlinkSync(path.join(__dirname,`../../public/images/users/${img.url_name}`)); 
				}else { 
					db.Image_users.create({
						url_name:req.file.filename,
						idUsers: user.id
					})
				}
				res.redirect(`/users/${req.params.id}`);
			})
			.catch(err=>log(err))
		})
		.catch(err=>log(err))
	}
}

module.exports = usersController;