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
		log('Aca va el file: ');
		log(req.file);
		log(resultValidation.errors.length > 0);
		if (resultValidation.errors.length > 0) {
			return res.render('users/register', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
		}else{
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
				return res.redirect(`/`);
			})
			.catch(err=>log(err));
		}
	},

	delete: function(req,res){
		db.Users.destroy({where: {id:req.params.id}})
		db.Image_users.findOne({where:{idUsers:req.params.id}})
		.then(imgU=>{
			if( String(imgU.url_name) != "default.png" ){
				fs.unlink(path.join(__dirname,`../../public/images/users/${imgU.url_name}`),(err=>{
					if(err) log(err);
					else{ 
						console.log("\nDeleted file: example_file.txt");
						// Get the files in current directory
						// after deletion
					}
				})); 
			} 
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
			let f = user.date_of_birth; 
			let day = String(f.getDate()).length > 1 ? `${f.getDate()}` : `0${f.getDate()}`; 
			let month = String(f.getMonth()+1).length > 1 ? `${f.getMonth()+1}` : `0${f.getMonth()+1}`; 
			let year = String(f.getFullYear()).length > 1 ? `${f.getFullYear()}` : `0${f.getFullYear()}`; 
			let fecha = `${year}-${month}-${day}`;
			log('fecha', fecha)
			return res.render(`users/usuario`,{ element : user, fecha})
		})
		.catch(err=>log(err))
    }, 

	edition: (req,res) =>{
		db.Users.findByPk(req.params.id,
			{
				include:[{association: 'image_users'}]
			})
		.then(user=>{
			let f = user.date_of_birth; 
			let day = String(f.getDate()).length > 1 ? `${f.getDate()}` : `0${f.getDate()}`; 
			let month = String(f.getMonth()+1).length > 1 ? `${f.getMonth()+1}` : `0${f.getMonth()+1}`; 
			let year = String(f.getFullYear()).length > 1 ? `${f.getFullYear()}` : `0${f.getFullYear()}`; 

			let fecha = `${year}-${month}-${day}`;
			log('fecha', fecha)
			return res.render(`users/userEdit`,{ element : user, fecha })
		})
		.catch(err=>log(err))
	},

	update: async (req,res)=>{
		const resultValidation = validationResult(req);
		log('Aca va el file: ');
		log(req.file);
		let user = await db.Users.findOne({
			where: {id: req.params.id},
			include:['image_users']
		});
		log(resultValidation.errors.length > 0);
		if (resultValidation.errors.length > 0) {
			log(user);
			return res.render(`users/userEdit`, {
				errors: resultValidation.mapped(),
				oldData: req.body, 
				element: user
			});
		}else{
		db.Users.update({
			userName: req.body.userName, 
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
				where:{ idUsers: req.params.id }
			})
			.then(img=>{
				log(String(img.url_name));
				log(req.file)
				if(req.file != undefined){
					log('Entre a RE')
					db.Image_users.update({
						url_name:req.file.filename
					},{
						where:{idUsers : req.params.id}
					})
					if( String(img.url_name) != "default.png" ){
						fs.unlink(path.join(__dirname,`../../public/images/users/${img.url_name}`),(err=>{
							if(err) log(err);
							else{ 
								console.log("\nDeleted file: example_file.txt");
								// Get the files in current directory
								// after deletion	
							}
						})); 
					} 
				}else if(req.body['img-default'] == 'on' ){
					log('Entre al else')
					db.Image_users.update({
						url_name: "default.png"						
					},{
						where: { idUsers: req.params.id }
					})
					if( String(img.url_name) != "default.png" ){
						fs.unlink(path.join(__dirname,`../../public/images/users/${img.url_name}`),(err=>{
							if(err) log(err);
							else{ 
								console.log("\nDeleted file: example_file.txt");
								// Get the files in current directory
								// after deletion	
							}
						})); 
					}
				}
				res.redirect(`/users/${req.params.id}`);
			})
			.catch(err=>log(err))
		})
		.catch(err=>log(err))
		}
	}
}

module.exports = usersController;