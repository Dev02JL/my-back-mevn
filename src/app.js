require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskFlatRoutes = require('./routes/task.flat.routes');

app.get('/', (req, res) => {
    res.send("<h1>API pour l'application MEVN</h1>");
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskFlatRoutes);

const errorHandler = require('./middlewares/error.middleware');
app.use(errorHandler);

module.exports = app; 