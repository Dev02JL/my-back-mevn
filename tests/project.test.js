const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Project = require('../src/models/project.model');

describe('Project Routes', () => {
    let token;
    let userId;
    let projectId;

    beforeEach(async () => {
        const user = new User({ name: 'Project Tester', email: 'project@test.com', password: 'password' });
        await user.save();
        userId = user._id;

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'project@test.com',
                password: 'password'
            });
        token = res.body.token;

        const project = new Project({ title: 'Test Project', description: 'Test Desc', owner: userId, collaborators: [userId] });
        await project.save();
        projectId = project._id;
    });

    it('devrait créer un projet si authentifié', async () => {
        const res = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Nouveau Projet',
                description: 'Description du nouveau projet'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('title', 'Nouveau Projet');
    });

    it('ne devrait pas créer de projet si non authentifié', async () => {
        const res = await request(app)
            .post('/api/projects')
            .send({
                title: 'Projet non autorisé',
                description: 'devrait échouer'
            });
        
        expect(res.statusCode).toEqual(401);
    });

    it('devrait récupérer les projets de l\'utilisateur', async () => {
        const res = await request(app)
            .get('/api/projects')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].title).toBe('Test Project');
    });

    it('devrait supprimer un projet si l\'utilisateur est le propriétaire', async () => {
        const res = await request(app)
            .delete(`/api/projects/${projectId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Projet et tâches associées supprimés avec succès.');
    });
}); 