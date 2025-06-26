const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Project = require('../src/models/project.model');
const Task = require('../src/models/task.model');

describe('Task Routes', () => {
    let token;
    let userId;
    let projectId;

    beforeEach(async () => {
        // Créer un utilisateur
        const user = new User({ name: 'Task Tester', email: 'task@test.com', password: 'password' });
        await user.save();
        userId = user._id;

        // Obtenir un token
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'task@test.com', password: 'password' });
        token = loginRes.body.token;

        // Créer un projet
        const project = new Project({ title: 'Project for Tasks', description: 'Desc', owner: userId, collaborators: [userId] });
        await project.save();
        projectId = project._id;
    });

    it('devrait créer une tâche dans un projet', async () => {
        const res = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Nouvelle Tâche',
                description: 'Description de la tâche'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('title', 'Nouvelle Tâche');
        expect(res.body.project).toBe(projectId.toString());
    });

    it('devrait récupérer les tâches d\'un projet', async () => {
        // Créer une tâche d'abord
        const task = new Task({ title: 'Task to get', description: '...', project: projectId, assignee: userId });
        await task.save();

        const res = await request(app)
            .get(`/api/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('Task to get');
    });
}); 