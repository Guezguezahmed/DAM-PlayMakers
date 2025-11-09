# 🚀 Guide de Déploiement sur Render.com

## ✅ Modifications Effectuées

### 1. Configuration du Port (`src/main.ts`)
L'application écoute maintenant sur `0.0.0.0` en production pour que Render puisse détecter le port :
```typescript
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
await app.listen(port, host);
```

### 2. Script de Démarrage (`package.json`)
Le script `start` utilise maintenant `node dist/main` au lieu de `nest start` pour la production :
```json
"start": "node dist/main"
```

---

## 📋 Configuration sur Render.com

### 1. Créer un Nouveau Web Service

1. Allez sur [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre dépôt GitHub : `fakhreddinefaidi/PeakPlay`
4. Configurez les paramètres suivants :

### 2. Paramètres de Build

- **Name** : `dam-backend` (ou votre choix)
- **Environment** : `Node`
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm run start`
- **Plan** : Choisissez votre plan (Free ou Paid)

### 3. Variables d'Environnement

Ajoutez toutes les variables nécessaires dans la section **"Environment"** :

#### Configuration de Base
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://votre-utilisateur:votre-mot-de-passe@cluster.mongodb.net/dam_backend
JWT_SECRET=votre_secret_jwt_tres_long_et_securise_minimum_20_caracteres
```

#### Configuration Frontend
```env
FRONTEND_URL=https://votre-frontend.render.com
BACKEND_URL=https://votre-backend.onrender.com
```

#### Configuration OAuth Google
```env
GOOGLE_CLIENT_ID=votre_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_google_client_secret
GOOGLE_CALLBACK_URL=https://votre-backend.onrender.com/api/v1/auth/google/redirect
```

#### Configuration OAuth Facebook
```env
FACEBOOK_APP_ID=votre_facebook_app_id
FACEBOOK_APP_SECRET=votre_facebook_app_secret
FACEBOOK_CALLBACK_URL=https://votre-backend.onrender.com/api/v1/auth/facebook/redirect
```

#### Configuration Email (SMTP)
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=votre_email@gmail.com
MAIL_PASS=votre_mot_de_passe_application_gmail
MAIL_FROM="DAM Backend <votre_email@gmail.com>"
```

---

## ⚠️ Points Importants

### 1. MongoDB
- **Option 1** : Utilisez [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit jusqu'à 512MB)
- **Option 2** : Utilisez le service MongoDB de Render (payant)

### 2. URLs OAuth
⚠️ **IMPORTANT** : Mettez à jour les URLs de callback dans :
- **Google Cloud Console** : Ajoutez `https://votre-backend.onrender.com/api/v1/auth/google/redirect`
- **Facebook Developer** : Ajoutez `https://votre-backend.onrender.com/api/v1/auth/facebook/redirect`

### 3. HTTPS
Render fournit automatiquement HTTPS. Assurez-vous que toutes vos URLs utilisent `https://` et non `http://`.

### 4. CORS
Le `FRONTEND_URL` doit correspondre exactement à l'URL de votre frontend déployé.

---

## 🔧 Résolution des Problèmes

### Erreur : "No open ports detected"
✅ **Résolu** : L'application écoute maintenant sur `0.0.0.0` en production.

### Erreur : "JavaScript heap out of memory"
Si vous rencontrez encore cette erreur, ajoutez dans les variables d'environnement Render :
```env
NODE_OPTIONS=--max-old-space-size=512
```

### Erreur : "MongoDB connection failed"
- Vérifiez que `MONGODB_URI` est correct
- Vérifiez que votre IP est autorisée dans MongoDB Atlas (ou utilisez `0.0.0.0/0` pour autoriser toutes les IPs)

### Erreur : "OAuth callback URL mismatch"
- Vérifiez que les URLs dans `.env` correspondent exactement à celles configurées dans Google/Facebook
- Les URLs doivent être en `https://` en production

---

## 📝 Checklist de Déploiement

- [ ] Créer le service sur Render
- [ ] Configurer toutes les variables d'environnement
- [ ] Mettre à jour les URLs OAuth dans Google Cloud Console
- [ ] Mettre à jour les URLs OAuth dans Facebook Developer
- [ ] Configurer MongoDB Atlas (ou autre)
- [ ] Vérifier que le build réussit
- [ ] Tester l'API déployée
- [ ] Tester l'authentification Google
- [ ] Tester l'authentification Facebook
- [ ] Tester l'envoi d'emails

---

## 🧪 Test après Déploiement

### 1. Test de l'API
```bash
curl https://votre-backend.onrender.com/api/v1
```

### 2. Test Swagger
Ouvrez dans votre navigateur :
```
https://votre-backend.onrender.com/api
```

### 3. Test d'Authentification
```bash
# Register
curl -X POST https://votre-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","prenom":"Test","nom":"User","age":"2000-01-01","tel":123456789}'
```

---

## 🎉 C'est Prêt !

Une fois déployé, votre API sera accessible à :
```
https://votre-backend.onrender.com/api/v1
```

Et la documentation Swagger à :
```
https://votre-backend.onrender.com/api
```

