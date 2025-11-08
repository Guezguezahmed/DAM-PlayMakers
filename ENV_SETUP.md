# Configuration des variables d'environnement

Ce fichier contient toutes les instructions pour configurer les variables d'environnement nécessaires au projet.

## Fichier .env

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

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
GOOGLE_CLIENT_ID=ton_client_id_google
GOOGLE_CLIENT_SECRET=ton_secret_google
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/google/redirect

# Facebook OAuth2 Configuration (optional)
FACEBOOK_APP_ID=ton_app_id_facebook
FACEBOOK_APP_SECRET=ton_app_secret_facebook
FACEBOOK_CALLBACK_URL=http://localhost:3001/api/v1/auth/facebook/redirect
```

## Comment obtenir les credentials

### Google OAuth2

1. **Aller sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials)**

2. **Créer un projet ou en sélectionner un existant**
   - Si vous n'avez pas de projet, cliquez sur "Créer un projet"
   - Donnez un nom à votre projet et validez

3. **Activer l'API Google+ (ou Google Identity)**
   - Dans le menu latéral, allez dans "APIs & Services" → "Library"
   - Recherchez "Google+ API" ou "Google Identity"
   - Cliquez sur "Enable"

4. **Créer des identifiants OAuth 2.0**
   - Allez dans "APIs & Services" → "Credentials"
   - Cliquez sur "Créer des identifiants" → "ID client OAuth"
   - Type d'application : **Application Web**
   - Nom : Donnez un nom à votre application (ex: "DAM Backend")
   - **URI de redirection autorisées** : 
     ```
     http://localhost:3001/api/v1/auth/google/redirect
     ```
   - Cliquez sur "Créer"

5. **Copier les credentials**
   - Copiez l'**ID client** → `GOOGLE_CLIENT_ID` dans votre `.env`
   - Copiez le **Secret client** → `GOOGLE_CLIENT_SECRET` dans votre `.env`

### Facebook OAuth2

1. **Aller sur [Facebook Developers](https://developers.facebook.com/apps)**

2. **Créer une nouvelle application**
   - Cliquez sur "Créer une application"
   - Sélectionnez "Consumer" ou "Autre"
   - Remplissez les informations de base de l'application

3. **Ajouter le produit "Facebook Login"**
   - Dans le tableau de bord de l'application, trouvez "Facebook Login"
   - Cliquez sur "Configurer" ou "Set Up"

4. **Configurer les URI de redirection OAuth**
   - Allez dans "Facebook Login" → "Settings"
   - Dans "Valid OAuth Redirect URIs", ajoutez :
     ```
     http://localhost:3001/api/v1/auth/facebook/redirect
     ```
   - Activez "Use Strict Mode for Redirect URIs" (Recommandé)
   - Sauvegardez les modifications

5. **Copier les credentials**
   - Allez dans "Paramètres" → "De base"
   - Copiez l'**ID de l'application** → `FACEBOOK_APP_ID` dans votre `.env`
   - Copiez le **Secret de l'application** → `FACEBOOK_APP_SECRET` dans votre `.env`
   - ⚠️ **Important** : Le secret de l'application peut être masqué, cliquez sur "Afficher" pour le voir

## Fonctionnement de l'authentification OAuth

Le flux d'authentification fonctionne comme suit :

1. **L'utilisateur visite** `/api/v1/auth/google` ou `/api/v1/auth/facebook`
2. **Redirection** vers la page de connexion du provider (Google ou Facebook)
3. **Après authentification**, le provider redirige vers le callback (`/api/v1/auth/google/redirect` ou `/api/v1/auth/facebook/redirect`)
4. **Le service** trouve ou crée l'utilisateur dans la base de données via `findOrCreateOAuthUser()`
5. **Un token JWT** est généré et stocké dans un cookie httpOnly
6. **L'utilisateur est redirigé** vers le frontend (si `FRONTEND_URL` est configuré) ou reçoit le token en JSON

## Test de l'authentification

Une fois les credentials configurés dans le fichier `.env` :

1. **Démarrer l'application** :
   ```powershell
   npm run start:dev
   ```

2. **Tester Google OAuth** :
   - Ouvrir un navigateur et aller sur : `http://localhost:3001/api/v1/auth/google`
   - Vous serez redirigé vers Google pour vous connecter
   - Après connexion, vous serez redirigé vers le callback

3. **Tester Facebook OAuth** :
   - Ouvrir un navigateur et aller sur : `http://localhost:3001/api/v1/auth/facebook`
   - Vous serez redirigé vers Facebook pour vous connecter
   - Après connexion, vous serez redirigé vers le callback

## Notes importantes

- **JWT_SECRET** : Doit contenir au moins 20 caractères. En développement, une valeur par défaut sera utilisée si manquante, mais ce n'est **pas sécurisé pour la production**.

- **Email requis** : Si un provider (Google/Facebook) ne retourne pas d'email, la création d'utilisateur via OAuth échouera. Assurez-vous que les scopes et permissions de l'application incluent l'email.

- **HTTPS en production** : Facebook peut nécessiter HTTPS pour les URLs de callback en production. Utilisez `https://votre-domaine.com/api/v1/auth/facebook/redirect` en production.

- **Gestion des erreurs** : Si les credentials ne sont pas configurés, vous obtiendrez une erreur 400 avec un message clair au lieu d'une erreur 500.

- **Mode développement** : Pour tester en local, utilisez `http://localhost:3001` pour les callbacks. En production, utilisez votre domaine réel avec HTTPS.

