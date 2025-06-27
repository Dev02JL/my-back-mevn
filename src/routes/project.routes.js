const express = require('express');
const router = express.Router();
const { createProject, getProjects, addCollaborator, updateProject, deleteProject, getProjectById } = require('../controllers/project.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const taskRouter = require('./task.routes'); // Importer le routeur des tâches
const { projectValidator } = require('../validators/project.validator');
const validate = require('../middlewares/validator.middleware');

// Toutes les routes ici sont protégées et nécessitent un token valide.
router.use(authMiddleware);

// Imbriquer les routes des tâches
router.use('/:projectId/tasks', taskRouter);

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', projectValidator, validate, createProject);

// @route   GET /api/projects
// @desc    Get all projects for a user
// @access  Private
router.get('/', getProjects);

// @route   GET /api/projects/:projectId
// @desc    Get project details by ID
// @access  Private (collaborators only)
router.get('/:projectId', getProjectById);

// @route   PUT /api/projects/:projectId
// @desc    Update a project
// @access  Private (Owner only)
router.put('/:projectId', projectValidator, validate, updateProject);

// @route   PATCH /api/projects/:projectId
// @desc    Update a project (title, description)
// @access  Private (Owner only)
router.patch('/:projectId', projectValidator, validate, updateProject);

// @route   DELETE /api/projects/:projectId
// @desc    Delete a project
// @access  Private (Owner only)
router.delete('/:projectId', deleteProject);

// @route   POST /api/projects/:projectId/collaborators
// @desc    Add a collaborator to a project
// @access  Private (Owner only)
router.post('/:projectId/collaborators', addCollaborator);

module.exports = router; 