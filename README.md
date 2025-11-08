<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


## OAuth (Google & Facebook) configuration

This project implements Google and Facebook OAuth in `src/auth/strategies/*` and exposes the following endpoints (the app uses the global prefix `/api/v1`):

- Start Google login: GET /api/v1/auth/google
- Google callback:    GET /api/v1/auth/google/redirect
- Start Facebook login: GET /api/v1/auth/facebook
- Facebook callback:    GET /api/v1/auth/facebook/redirect

## Environment Variables Configuration

> 📖 **Guides détaillés** : 
> - [ENV_SETUP.md](./ENV_SETUP.md) : Instructions complètes sur la configuration des credentials OAuth
> - [GUIDE_OAUTH.md](./GUIDE_OAUTH.md) : **Guide étape par étape avec captures d'écran** pour obtenir et configurer les credentials Google et Facebook
> - [GUIDE_EMAIL.md](./GUIDE_EMAIL.md) : Configuration de l'envoi d'emails de vérification
> - [GUIDE_TEST_EMAIL.md](./GUIDE_TEST_EMAIL.md) : **Guide de test complet** pour tester la vérification d'email

Create a `.env` file in the root directory with the following variables:

```env
# Application Configuration
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/dam_backend

# JWT Configuration (REQUIRED - minimum 20 characters)
JWT_SECRET=your_jwt_secret_key_minimum_20_characters_long

# Frontend URL (optional, for OAuth redirects)
FRONTEND_URL=http://localhost:3000

# Google OAuth2 Configuration
# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/google/redirect

# Facebook OAuth2 Configuration (optional)
# Get these from: https://developers.facebook.com/apps
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
FACEBOOK_CALLBACK_URL=http://localhost:3001/api/v1/auth/facebook/redirect
```

## Steps to configure OAuth locally:

1. **Create `.env` file**: Copy the environment variables above and fill in the values.
   - `JWT_SECRET` is **REQUIRED** and must be at least 20 characters long.
   - For development, if `JWT_SECRET` is missing, a default value will be used (not recommended for production).

2. **Google OAuth Setup**:
   - Aller sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Créer un projet ou en sélectionner un existant
   - Activer l'API Google+ (ou Google Identity)
   - Créer des identifiants OAuth 2.0 :
     * Cliquer sur "Créer des identifiants" → "ID client OAuth"
     * Type d'application : Application Web
     * Nom : Donner un nom à votre application
     * URI de redirection autorisées : `http://localhost:3001/api/v1/auth/google/redirect`
   - Copier `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` dans votre fichier `.env`

3. **Facebook OAuth Setup** (optional):
   - Aller sur [Facebook Developers](https://developers.facebook.com/apps)
   - Créer une nouvelle application
   - Ajouter le produit "Facebook Login"
   - Dans les paramètres Facebook Login :
     * URI de redirection OAuth valides : `http://localhost:3001/api/v1/auth/facebook/redirect`
     * Activer "Utiliser la redirection stricte pour les URI de redirection OAuth"
   - Dans Paramètres → De base, copier l'ID de l'application et le Secret de l'application
   - Copier `FACEBOOK_APP_ID` et `FACEBOOK_APP_SECRET` dans votre fichier `.env`

4. **Start the app in dev mode**:

```powershell
npm run start:dev
```

5. **Test OAuth flow**: Open a browser to:
   - Google: `http://localhost:3001/api/v1/auth/google`
   - Facebook: `http://localhost:3001/api/v1/auth/facebook`

## Fonctionnement de l'authentification OAuth

Le flux d'authentification fonctionne comme suit :

1. **L'utilisateur visite** `/api/v1/auth/google` ou `/api/v1/auth/facebook`
2. **Redirection** vers la page de connexion du provider (Google ou Facebook)
3. **Après authentification**, le provider redirige vers le callback (`/api/v1/auth/google/redirect` ou `/api/v1/auth/facebook/redirect`)
4. **Le service** trouve ou crée l'utilisateur dans la base de données via `findOrCreateOAuthUser()`
5. **Un token JWT** est généré et stocké dans un cookie httpOnly
6. **L'utilisateur est redirigé** vers le frontend (si `FRONTEND_URL` est configuré) ou reçoit le token en JSON

## Important Notes:

- **JWT_SECRET** est requis par la configuration de l'application et doit contenir au moins 20 caractères. En développement, une valeur par défaut sera utilisée si manquante, mais ce n'est pas sécurisé pour la production.
- Si un provider ne retourne pas d'email, la création d'utilisateur via OAuth échouera — assurez-vous que les scopes et permissions de l'application incluent l'email.
- Facebook peut nécessiter HTTPS pour les URLs de callback en production.
- Les stratégies OAuth sont toujours enregistrées, mais les guards vérifient la présence des credentials et retournent des erreurs appropriées si elles sont manquantes.
- Pour tester sans credentials, vous obtiendrez une erreur 400 avec un message clair au lieu d'une erreur 500.
