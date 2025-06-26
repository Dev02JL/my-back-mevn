const express = require('express');
// L'option { mergeParams: true } est cruciale pour accéder aux paramètres de l'URL du routeur parent (ex: :projectId)
const router = express.Router({ mergeParams: true }); 
const { createTask, getTasksByProject, updateTask, deleteTask } = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Protéger toutes les routes de ce fichier
router.use(authMiddleware);

// @route   POST /api/projects/:projectId/tasks
// @desc    Create a new task in a project
// @access  Private (collaborators only)
router.post('/', createTask);

// @route   GET /api/projects/:projectId/tasks
// @desc    Get all tasks from a project
// @access  Private (collaborators only)
router.get('/', getTasksByProject);

// @route   PUT /api/projects/:projectId/tasks/:taskId
// @desc    Update a task
// @access  Private (collaborators only)
router.put('/:taskId', updateTask);

// @route   DELETE /api/projects/:projectId/tasks/:taskId
// @desc    Delete a task
// @access  Private (owner or assignee)
router.delete('/:taskId', deleteTask);

module.exports = router; 