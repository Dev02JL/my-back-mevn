const jwt = require('jsonwebtoken');

// Charger la clé secrète depuis les variables d'environnement
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET n\'est pas défini.');
}

const authMiddleware = (req, res, next) => {
    // Le format du header est "Bearer TOKEN"
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Accès non autorisé, token manquant.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé, format du token invalide.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.userId }; // Attache l'ID de l'utilisateur à la requête
        next(); // Passe au prochain middleware ou au contrôleur
    } catch (error) {
        res.status(401).json({ message: 'Token invalide.' });
    }
};

module.exports = authMiddleware; 