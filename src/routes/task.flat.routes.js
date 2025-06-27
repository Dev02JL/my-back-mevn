const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const auth = require('../middlewares/auth.middleware');

// Suppression d'une tâche par son ID (à plat)
router.delete('/:taskId', auth, taskController.deleteTask);

// Mise à jour d'une tâche par son ID (à plat)
router.patch('/:taskId', auth, taskController.updateTask);

module.exports = router; 