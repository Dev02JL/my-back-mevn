require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const Project = require('../src/models/project.model');
const Task = require('../src/models/task.model');

let connection;
let UserModel, ProjectModel, TaskModel;

beforeAll(async () => {
  connection = await mongoose.createConnection(process.env.MONGO_URI);
  UserModel = connection.model('User', User.schema);
  ProjectModel = connection.model('Project', Project.schema);
  TaskModel = connection.model('Task', Task.schema);
});

afterAll(async () => {
  await connection.close();
});

describe('Vérification du jeu de données seed', () => {
  it('devrait trouver les utilisateurs du seed', async () => {
    const users = await UserModel.find({ email: { $in: ['alice@test.com', 'bob@test.com', 'charlie@test.com'] } });
    expect(users.length).toBe(3);
  });

  it('devrait trouver le projet de démo', async () => {
    const project = await ProjectModel.findOne({ title: 'Projet Démo' });
    expect(project).not.toBeNull();
    expect(project.description).toBe('Un projet de démonstration');
  });

  it('devrait trouver les tâches du projet', async () => {
    const project = await ProjectModel.findOne({ title: 'Projet Démo' });
    const tasks = await TaskModel.find({ project: project._id });
    expect(tasks.length).toBe(2);
    const titles = tasks.map(t => t.title);
    expect(titles).toContain('Tâche 1');
    expect(titles).toContain('Tâche 2');
  });
}); 