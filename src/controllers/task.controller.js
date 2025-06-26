const Task = require('../models/task.model');
const Project = require('../models/project.model');
const asyncHandler = require('express-async-handler');

// Créer une nouvelle tâche dans un projet
exports.createTask = asyncHandler(async (req, res) => {
    const { title, description, assignee } = req.body;
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error('Projet non trouvé.');
    }
    if (!project.collaborators.includes(userId)) {
        res.status(403);
        throw new Error('Accès non autorisé à ce projet.');
    }
    
    if (assignee && !project.collaborators.includes(assignee)) {
        res.status(400);
        throw new Error("L'utilisateur assigné doit être un collaborateur du projet.");
    }

    const newTask = new Task({
        title,
        description,
        project: projectId,
        assignee: assignee || userId
    });

    await newTask.save();
    res.status(201).json(newTask);
});

// Obtenir toutes les tâches d'un projet
exports.getTasksByProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project || !project.collaborators.includes(userId)) {
        res.status(403);
        throw new Error('Accès non autorisé à ce projet.');
    }

    const tasks = await Task.find({ project: projectId }).populate('assignee', 'name email');
    res.status(200).json(tasks);
});

// Mettre à jour une tâche
exports.updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, assignee } = req.body;
    const userId = req.user.id;

    const task = await Task.findById(taskId).populate('project');

    if (!task) {
        res.status(404);
        throw new Error('Tâche non trouvée.');
    }

    if (!task.project.collaborators.includes(userId)) {
        res.status(403);
        throw new Error("Action non autorisée sur cette tâche.");
    }
    
    if (assignee && !task.project.collaborators.includes(assignee)) {
         res.status(400);
         throw new Error("L'utilisateur assigné doit être un collaborateur du projet.");
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.assignee = assignee || task.assignee;

    await task.save();
    res.status(200).json(task);
});

// Supprimer une tâche
exports.deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(taskId).populate('project');

    if (!task) {
        res.status(404);
        throw new Error('Tâche non trouvée.');
    }

    const isOwner = task.project.owner.toString() === userId;
    const isAssignee = task.assignee.toString() === userId;

    if (!isOwner && !isAssignee) {
        res.status(403);
        throw new Error('Action non autorisée.');
    }

    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: 'Tâche supprimée avec succès.' });
}); 