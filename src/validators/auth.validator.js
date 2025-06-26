const { body } = require('express-validator');

exports.registerValidator = [
    body('name', 'Le nom est requis').not().isEmpty(),
    body('email', 'Veuillez fournir un email valide').isEmail(),
    body('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 })
];

exports.loginValidator = [
    body('email', 'Veuillez fournir un email valide').isEmail(),
    body('password', 'Le mot de passe ne peut pas être vide').not().isEmpty()
]; 