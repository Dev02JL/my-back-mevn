const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Charger la clé secrète depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET n\'est pas défini.');
}

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // La validation est maintenant gérée par express-validator

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400); // Bad Request
        throw new Error('Cet email est déjà utilisé.');
    }

    // Create a new user (password will be hashed by the pre-save hook)
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ 
        message: 'Utilisateur créé avec succès.',
        user: { id: user._id, name: user.name, email: user.email }
    });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // La validation est maintenant gérée par express-validator

    // Check if user exists
    const user = await User.findOne({ email });

    // Compare password
    const isMatch = user && (await bcrypt.compare(password, user.password));

    if (!isMatch) {
        res.status(401); // Unauthorized
        throw new Error('Identifiants invalides.');
    }

    // Create and sign JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
        token,
        user: { id: user._id, name: user.name, email: user.email }
    });
}); 