# 🚀 Déploiement en Production

## ❓ Question
**Est-ce que cette application ne marche que localement ?**

## ✅ Réponse : **NON, l'application peut être déployée en production !**

L'application est **configurée pour fonctionner localement par défaut**, mais elle peut être facilement déployée en production en modifiant les variables d'environnement.

---

## 📊 État Actuel : Configuration Locale

### 🔍 Ce qui est configuré pour localhost :

1. **MongoDB** : `mongodb://localhost:27017/dam_backend`
2. **Port** : `3002` (ou `3001` par défaut)
3. **Backend URL** : `http://localhost:3002`
4. **Frontend URL** : `http://localhost:3000`
5. **OAuth Callbacks** :
   - Google : `http://localhost:3002/api/v1/auth/google/redirect`
   - Facebook : `http://localhost:3002/api/v1/auth/facebook/redirect`

### ✅ Ce qui est flexible (déjà prêt pour la production) :

1. **CORS** : Accepte `FRONTEND_URL` ou toutes les origines si non défini
2. **Port** : Utilise `process.env.PORT` (standard pour le déploiement)
3. **MongoDB** : Utilise `MONGODB_URI` (peut pointer vers MongoDB Atlas)
4. **NODE_ENV** : Gère `development` et `production` différemment
5. **Toutes les URLs** : Utilisent des variables d'environnement

---

## 🔧 Configuration pour la Production

### Étape 1 : Modifier le fichier `.env` pour la production

```env
# Application Configuration
NODE_ENV=production
PORT=3002
# Utiliser MongoDB Atlas ou un serveur MongoDB distant
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dam_backend

# JWT Configuration (OBLIGATOIRE en production - minimum 20 caractères)
JWT_SECRET=votre_secret_jwt_secret_tres_long_et_securise_minimum_20_caracteres

# Frontend URL (URL de votre frontend en production)
FRONTEND_URL=https://votre-frontend.com

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=votre_client_id_google
GOOGLE_CLIENT_SECRET=votre_secret_google
# URL de callback en production
GOOGLE_CALLBACK_URL=https://votre-backend.com/api/v1/auth/google/redirect

# Facebook OAuth2 Configuration
FACEBOOK_APP_ID=votre_app_id_facebook
FACEBOOK_APP_SECRET=votre_secret_facebook
# URL de callback en production
FACEBOOK_CALLBACK_URL=https://votre-backend.com/api/v1/auth/facebook/redirect

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=votre_email@gmail.com
MAIL_PASS=votre_mot_de_passe_application
MAIL_FROM="DAM Backend <votre_email@gmail.com>"
# URL du backend en production
BACKEND_URL=https://votre-backend.com
```

### Étape 2 : Mettre à jour les URLs OAuth dans Google Cloud Console

1. **Google OAuth** :
   - Allez sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Sélectionnez votre projet
   - Allez dans "APIs & Services" → "Credentials"
   - Cliquez sur votre OAuth 2.0 Client ID
   - Ajoutez dans "URI de redirection autorisées" :
     ```
     https://votre-backend.com/api/v1/auth/google/redirect
     ```
   - Sauvegardez

2. **Facebook OAuth** :
   - Allez sur [Facebook Developers](https://developers.facebook.com/apps)
   - Sélectionnez votre application
   - Allez dans "Settings" → "Basic"
   - Ajoutez dans "Valid OAuth Redirect URIs" :
     ```
     https://votre-backend.com/api/v1/auth/facebook/redirect
     ```
   - Sauvegardez

### Étape 3 : Déployer l'application

#### Option A : Déploiement sur Heroku

```bash
# 1. Installer Heroku CLI
# 2. Se connecter
heroku login

# 3. Créer une nouvelle application
heroku create votre-app-backend

# 4. Ajouter MongoDB Atlas (ou utiliser Heroku MongoDB)
heroku addons:create mongolab:sandbox

# 5. Configurer les variables d'environnement
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=votre_secret_jwt_secret_tres_long
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set FRONTEND_URL=https://votre-frontend.com
heroku config:set GOOGLE_CLIENT_ID=...
heroku config:set GOOGLE_CLIENT_SECRET=...
heroku config:set GOOGLE_CALLBACK_URL=https://votre-app-backend.herokuapp.com/api/v1/auth/google/redirect
# ... etc pour toutes les variables

# 6. Déployer
git push heroku main
```

#### Option B : Déploiement sur Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Créer un fichier vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}

# 3. Déployer
vercel --prod
```

#### Option C : Déploiement sur AWS/DigitalOcean/Azure

1. **Créer un serveur** (EC2, Droplet, VM, etc.)
2. **Installer Node.js** et MongoDB (ou utiliser MongoDB Atlas)
3. **Cloner le repository**
4. **Configurer les variables d'environnement** dans `.env`
5. **Construire l'application** : `npm run build`
6. **Démarrer en production** : `npm run start:prod`
7. **Utiliser PM2** pour gérer le processus :
   ```bash
   npm install -g pm2
   pm2 start dist/main.js --name dam-backend
   pm2 save
   pm2 startup
   ```

#### Option D : Déploiement avec Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3002

CMD ["node", "dist/main.js"]
```

```bash
# Construire l'image
docker build -t dam-backend .

# Lancer le conteneur
docker run -d \
  -p 3002:3002 \
  --env-file .env \
  --name dam-backend \
  dam-backend
```

---

## 🔒 Sécurité en Production

### ✅ Vérifications à faire :

1. **JWT_SECRET** :
   - ✅ Minimum 20 caractères
   - ✅ Aléatoire et sécurisé
   - ✅ Ne jamais le commiter dans Git

2. **MongoDB** :
   - ✅ Utiliser MongoDB Atlas (cloud) ou un serveur sécurisé
   - ✅ Activer l'authentification
   - ✅ Utiliser des connexions SSL/TLS

3. **HTTPS** :
   - ✅ Utiliser HTTPS en production (obligatoire pour OAuth)
   - ✅ Configurer un certificat SSL (Let's Encrypt, etc.)

4. **Variables d'environnement** :
   - ✅ Ne jamais commiter le fichier `.env`
   - ✅ Utiliser les variables d'environnement du service de déploiement
   - ✅ Utiliser un gestionnaire de secrets (AWS Secrets Manager, etc.)

5. **CORS** :
   - ✅ Spécifier `FRONTEND_URL` en production (ne pas laisser `true`)
   - ✅ Limiter les origines autorisées

6. **Rate Limiting** :
   - ⚠️ **Recommandé** : Ajouter un rate limiter pour éviter les abus
   ```bash
   npm install @nestjs/throttler
   ```

---

## 📋 Checklist de Déploiement

### Avant le déploiement :

- [ ] Modifier `NODE_ENV=production` dans `.env`
- [ ] Configurer `MONGODB_URI` (MongoDB Atlas ou serveur distant)
- [ ] Générer un `JWT_SECRET` sécurisé (minimum 20 caractères)
- [ ] Configurer `FRONTEND_URL` avec l'URL de production du frontend
- [ ] Configurer `BACKEND_URL` avec l'URL de production du backend
- [ ] Mettre à jour les URLs OAuth dans Google Cloud Console
- [ ] Mettre à jour les URLs OAuth dans Facebook Developers
- [ ] Configurer les variables d'environnement du service de déploiement
- [ ] Tester l'application en local avec les nouvelles variables

### Après le déploiement :

- [ ] Vérifier que l'application démarre correctement
- [ ] Tester l'inscription (`POST /api/v1/auth/register`)
- [ ] Tester la connexion (`POST /api/v1/auth/login`)
- [ ] Tester OAuth Google (`GET /api/v1/auth/google`)
- [ ] Tester OAuth Facebook (`GET /api/v1/auth/facebook`)
- [ ] Vérifier que les emails de vérification sont envoyés
- [ ] Vérifier que les emails de notification de connexion sont envoyés
- [ ] Vérifier les logs pour les erreurs

---

## 🌐 Exemples de Configuration

### Exemple 1 : Heroku

```env
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dam_backend
JWT_SECRET=super_secret_jwt_key_minimum_20_characters_long
FRONTEND_URL=https://mon-frontend.herokuapp.com
BACKEND_URL=https://mon-backend.herokuapp.com
GOOGLE_CALLBACK_URL=https://mon-backend.herokuapp.com/api/v1/auth/google/redirect
FACEBOOK_CALLBACK_URL=https://mon-backend.herokuapp.com/api/v1/auth/facebook/redirect
```

### Exemple 2 : VPS (DigitalOcean, AWS EC2, etc.)

```env
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb://user:pass@mongodb-server:27017/dam_backend
JWT_SECRET=super_secret_jwt_key_minimum_20_characters_long
FRONTEND_URL=https://www.mon-site.com
BACKEND_URL=https://api.mon-site.com
GOOGLE_CALLBACK_URL=https://api.mon-site.com/api/v1/auth/google/redirect
FACEBOOK_CALLBACK_URL=https://api.mon-site.com/api/v1/auth/facebook/redirect
```

### Exemple 3 : Docker avec Nginx

```env
NODE_ENV=production
PORT=3002
MONGODB_URI=mongodb://mongodb-container:27017/dam_backend
JWT_SECRET=super_secret_jwt_key_minimum_20_characters_long
FRONTEND_URL=https://www.mon-site.com
BACKEND_URL=https://api.mon-site.com
GOOGLE_CALLBACK_URL=https://api.mon-site.com/api/v1/auth/google/redirect
FACEBOOK_CALLBACK_URL=https://api.mon-site.com/api/v1/auth/facebook/redirect
```

---

## 🐛 Problèmes Courants en Production

### 1. OAuth ne fonctionne pas
**Problème** : Les callbacks OAuth retournent une erreur
**Solution** : Vérifier que les URLs de callback dans Google/Facebook correspondent exactement à `BACKEND_URL/api/v1/auth/{provider}/redirect`

### 2. CORS bloque les requêtes
**Problème** : Les requêtes depuis le frontend sont bloquées
**Solution** : Vérifier que `FRONTEND_URL` est correctement configuré et que CORS accepte cette origine

### 3. MongoDB ne se connecte pas
**Problème** : Erreur de connexion à MongoDB
**Solution** : 
- Vérifier que `MONGODB_URI` est correct
- Vérifier que le serveur MongoDB est accessible depuis votre serveur de production
- Vérifier les règles de firewall

### 4. Les emails ne sont pas envoyés
**Problème** : Les emails de vérification ne sont pas envoyés
**Solution** :
- Vérifier les credentials SMTP (`MAIL_USER`, `MAIL_PASS`)
- Vérifier que le port 587 n'est pas bloqué
- Vérifier les logs pour les erreurs SMTP

### 5. JWT_SECRET trop court
**Problème** : L'application ne démarre pas en production
**Solution** : `JWT_SECRET` doit faire au moins 20 caractères en production

---

## ✅ Conclusion

**L'application peut être déployée en production !**

Il suffit de :
1. ✅ Modifier les variables d'environnement
2. ✅ Mettre à jour les URLs OAuth
3. ✅ Déployer sur un service (Heroku, Vercel, VPS, etc.)
4. ✅ Configurer HTTPS
5. ✅ Tester toutes les fonctionnalités

L'application est **déjà prête** pour la production, il suffit de changer les variables d'environnement ! 🚀

