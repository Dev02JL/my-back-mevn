require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const Project = require('../src/models/project.model');
const Task = require('../src/models/task.model');
const bcrypt = require('bcryptjs');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // Nettoyer la base
  await User.deleteMany();
  await Project.deleteMany();
  await Task.deleteMany();

  // Créer des utilisateurs
  const password = await bcrypt.hash('password123', 10);
  const users = await User.insertMany([
    { name: 'Alice', email: 'alice@test.com', password },
    { name: 'Bob', email: 'bob@test.com', password },
    { name: 'Charlie', email: 'charlie@test.com', password }
  ]);

  // Créer un projet
  const project = await Project.create({
    title: 'Projet Démo',
    description: 'Un projet de démonstration',
    owner: users[0]._id,
    collaborators: [users[0]._id, users[1]._id]
  });

  // Créer des tâches
  await Task.insertMany([
    {
      title: 'Tâche 1',
      description: 'Première tâche',
      status: 'to do',
      project: project._id,
      assignee: users[0]._id
    },
    {
      title: 'Tâche 2',
      description: 'Deuxième tâche',
      status: 'in progress',
      project: project._id,
      assignee: users[1]._id
    }
  ]);

  console.log('Jeu de données inséré avec succès !');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}); 