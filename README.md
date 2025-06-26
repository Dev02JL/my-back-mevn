# Backend MEVN (Node.js / Express / MongoDB)

## Prérequis
- Node.js >= 16
- npm >= 8
- Un accès à une base MongoDB (locale ou Atlas)

## Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd back-mevn
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
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

## Conseils
- Modifiez le fichier `.env` pour adapter la connexion à votre base MongoDB et votre secret JWT.
- Relancez `npm run seed` à chaque fois que vous voulez réinitialiser la base avec le jeu de données de démo.
- Utilisez Postman ou Insomnia pour tester les routes manuellement.

---

**Bon développement !** 