// Ce middleware est appelé quand une erreur est passée à next()
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log l'erreur pour le débogage

    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode);

    res.json({
        message: err.message,
        // En mode développement, on peut vouloir plus de détails
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

module.exports = errorHandler; 