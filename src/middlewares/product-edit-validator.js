const {body} = require('express-validator'); 

const validator =[ 
    body('name').notEmpty().withMessage('Debe escribir un nombre.'),
    body('price').notEmpty().withMessage('Debe escribir un precio.'), 
    body('color').notEmpty().withMessage('Debe elegir almenos un color.'), 
    body('sizes').notEmpty().withMessage('Debe elegir almenos un talle.'), 
    body('description').notEmpty().withMessage('Debe escribir una descripcion.').bail()
        .isLength({min:30}).withMessage('Debe escribir como minimo 30 letras u caracteres.')
]
module.exports = validator; 