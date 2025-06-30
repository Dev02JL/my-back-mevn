const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const auth = require('../middlewares/auth.middleware');

router.delete('/:taskId', auth, taskController.deleteTask);

router.patch('/:taskId', auth, taskController.updateTask);

module.exports = router; 