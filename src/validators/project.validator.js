const { body } = require('express-validator');

exports.projectValidator = [
    body('title', 'Le titre est requis').not().isEmpty().trim(),
    body('description', 'La description est requise').not().isEmpty().trim()
]; 