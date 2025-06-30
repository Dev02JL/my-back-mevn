const request = require('supertest');
const app = require('../src/app');

describe('Auth Routes', () => {

  it('devrait enregistrer un nouvel utilisateur avec succès', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Utilisateur créé avec succès.');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('name', 'Test User');
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('ne devrait pas enregistrer un utilisateur avec un email déjà existant', async () => {
    // Créer un premier utilisateur
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User 1',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    // Tenter de créer un deuxième utilisateur avec le même email
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User 2',
        email: 'duplicate@example.com',
        password: 'password456',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Cet email est déjà utilisé.');
  });

}); 