const express = require('express');
const app = express();
const path = require('path');
const port = 3001;
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session=require("express-session");

app.set('view engine','ejs'); // Para "activar" ejs 
app.set('views',path.resolve(__dirname, './views')); // No hace falta, cuando se tiene a views en la parte principal 

app.use(express.static('public'));  // Para los archivos estáticos en el folder /public
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method')); // Para poder pisar el method="POST" en el formulario por PUT y DELETE
app.use(cookieParser());
app.use(session({secret:'secrets!!'}));
app.use(require('../src/middlewares/user-logged'))

const usersRoutes = require('./routers/userRoutes');
const productRoutes = require('./routers/productRoutes');
const homeRoutes = require('./routers/homeRoutes');

app.use('/', homeRoutes);
app.use('/products', productRoutes);
app.use('/users', usersRoutes);

app.use( (req,res,next)=>{
    res.status(404).render('not-found');
});

app.listen ( process.env.PORT || port, () =>{
    console.log(`Servidor funcionando en el puerto ${port}` )
})
