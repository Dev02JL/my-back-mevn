const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET n\'est pas défini.');
}

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('Cet email est déjà utilisé.');
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ 
        message: 'Utilisateur créé avec succès.',
        user: { id: user._id, name: user.name, email: user.email }
    });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const isMatch = user && (await bcrypt.compare(password, user.password));

    if (!isMatch) {
        res.status(401);
        throw new Error('Identifiants invalides.');
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
        token,
        user: { id: user._id, name: user.name, email: user.email }
    });
}); 