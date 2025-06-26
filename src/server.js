const app = require('./app');
const mongoose = require('mongoose');

// --- Database Connection ---
// L'URI de MongoDB devrait idéalement être dans un fichier .env
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mevn-app";

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('Connexion à MongoDB réussie.');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
    });
})
.catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1);
}); 