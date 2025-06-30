const Project = require('../models/project.model');
const User = require('../models/user.model');
const Task = require('../models/task.model');
const asyncHandler = require('express-async-handler');

exports.createProject = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const ownerId = req.user.id;

    const newProject = new Project({
        title,
        description,
        owner: ownerId,
        collaborators: [ownerId]
    });

    await newProject.save();
    res.status(201).json(newProject);
});

exports.getProjects = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const projects = await Project.find({ collaborators: userId }).populate('owner', 'name email').populate('collaborators', 'name email');
    res.status(200).json(projects);
});

exports.updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { title, description } = req.body;
    const requesterId = req.user.id;

    const project = await Project.findById(projectId);

    if (!project) {
        res.status(404);
        throw new Error('Projet non trouvé.');
    }

    if (project.owner.toString() !== requesterId) {
        res.status(403);
        throw new Error('Action non autorisée.');
    }

    project.title = title || project.title;
    project.description = description || project.description;

    await project.save();
    res.status(200).json(project);
});

exports.deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const requesterId = req.user.id;

    const project = await Project.findById(projectId);

    if (!project) {
        res.status(404);
        throw new Error('Projet non trouvé.');
    }

    if (project.owner.toString() !== requesterId) {
        res.status(403);
        throw new Error('Action non autorisée.');
    }

    await Task.deleteMany({ project: projectId });
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: 'Projet et tâches associées supprimés avec succès.' });
});

exports.addCollaborator = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { email } = req.body;
    const requesterId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error('Projet non trouvé.');
    }

    if (project.owner.toString() !== requesterId) {
        res.status(403);
        throw new Error("Seul le propriétaire du projet peut ajouter des collaborateurs.");
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
        res.status(404);
        throw new Error("L'utilisateur à ajouter n'a pas été trouvé.");
    }

    if (project.collaborators.includes(userToAdd._id)) {
        res.status(400);
        throw new Error('Cet utilisateur est déjà un collaborateur.');
    }

    project.collaborators.push(userToAdd._id);
    await project.save();
    
    const updatedProject = await Project.findById(projectId).populate('owner', 'name email').populate('collaborators', 'name email');

    res.status(200).json(updatedProject);
});

exports.getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId)
        .populate('owner', 'name')
        .populate('collaborators', 'name');

    if (!project) {
        res.status(404);
        throw new Error('Projet non trouvé.');
    }

    if (!project.collaborators.map(u => u._id.toString()).includes(userId)) {
        res.status(403);
        throw new Error('Accès non autorisé à ce projet.');
    }

    res.status(200).json(project);
}); 