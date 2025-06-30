# Backend MEVN (Node.js / Express / MongoDB)

## Prérequis
- Node.js >= 16
- npm >= 8
- Un accès à une base MongoDB (locale ou Atlas)

## Installation

1. **Cloner le projet**
   ```bash
   git clone git@github.com:Dev02JL/my-back-mevn.git
   cd back-mevn
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Générer un JWT_SECRET robuste**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copiez la valeur générée dans le champ `JWT_SECRET` de votre fichier `.env`.

4. **Configurer les variables d'environnement**
   Créez un fichier `.env` à la racine du projet, par exemple :
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=<votre_secret_jwt>
   ```

## Lancer le serveur

- En développement (avec redémarrage auto) :
  ```bash
  npm run dev
  ```
- En production :
  ```bash
  npm start
  ```

## Peupler la base de données (jeu de données de test)

- Exécuter le script de seed :
  ```bash
  npm run seed
  ```
  Cela va insérer des utilisateurs, un projet et des tâches de démonstration.

## Lancer les tests

- **Tous les tests (en mémoire)** :
  ```bash
  npm test
  ```
- **Vérifier le jeu de données seed dans la vraie base** :
  ```bash
  npm test tests/seed.test.js
  ```

## Structure du projet

- `src/` : code source principal (modèles, routes, contrôleurs, middlewares)
- `scripts/seed.js` : script pour peupler la base
- `tests/` : tests automatisés (Jest + Supertest)

## Principales routes API

### Authentification
- `POST /api/auth/register` : inscription
- `POST /api/auth/login` : connexion

### Projets
- `GET /api/projects` : liste des projets de l'utilisateur
- `GET /api/projects/:projectId` : détail d'un projet (collaborateur seulement)
- `POST /api/projects` : créer un projet
- `PATCH /api/projects/:projectId` : modifier un projet (propriétaire seulement)
- `DELETE /api/projects/:projectId` : supprimer un projet (propriétaire seulement)
- `POST /api/projects/:projectId/collaborators` : ajouter un collaborateur (propriétaire seulement)

### Tâches
- `POST /api/projects/:projectId/tasks` : créer une tâche dans un projet
- `GET /api/projects/:projectId/tasks` : lister les tâches d'un projet
- `PATCH /api/tasks/:taskId` : modifier une tâche (à plat)
- `DELETE /api/tasks/:taskId` : supprimer une tâche (à plat)

## Conseils
- Modifiez le fichier `.env` pour adapter la connexion à votre base MongoDB et votre secret JWT.
- Relancez `npm run seed` à chaque fois que vous voulez réinitialiser la base avec le jeu de données de démo.
- Utilisez Postman ou Insomnia pour tester les routes manuellement.

---

**Bon développement !** 