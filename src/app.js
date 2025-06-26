require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- Routes ---
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');

app.get('/', (req, res) => {
    res.send("<h1>API pour l'application MEVN</h1>");
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// --- Error Handling ---
const errorHandler = require('./middlewares/error.middleware');
app.use(errorHandler);

module.exports = app; 