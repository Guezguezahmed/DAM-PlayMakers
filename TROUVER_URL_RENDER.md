# 🔍 Comment Trouver Votre URL Render

## 📍 Méthode 1 : Dashboard Render (Recommandé)

1. **Allez sur** : [https://dashboard.render.com](https://dashboard.render.com)
2. **Connectez-vous** avec votre compte
3. **Cliquez sur votre service** (ex: `dam-backend` ou le nom que vous avez donné)
4. **L'URL est affichée en haut** de la page, sous le nom du service

**Format typique** :
```
https://votre-service.onrender.com
```

---

## 📍 Méthode 2 : Dans les Paramètres du Service

1. Dans votre service Render
2. Allez dans **"Settings"** (Paramètres)
3. L'URL est affichée dans la section **"Service Details"**

---

## 📍 Méthode 3 : Dans les Logs

1. Allez dans l'onglet **"Logs"** de votre service
2. Cherchez une ligne qui contient :
   ```
   Application is running on: http://0.0.0.0:10000
   ```
3. L'URL publique est celle affichée dans l'en-tête de la page Render

---

## 🧪 URLs de Test

Une fois que vous avez votre URL (ex: `https://dam-backend.onrender.com`), voici les URLs de test :

### 1. **API de Base**
```
https://dam-backend.onrender.com/api/v1
```

### 2. **Swagger (Documentation Interactive)**
```
https://dam-backend.onrender.com/api
```

### 3. **Login**
```
POST https://dam-backend.onrender.com/api/v1/auth/login
```

### 4. **Register**
```
POST https://dam-backend.onrender.com/api/v1/auth/register
```

---

## ⚠️ Si Vous N'avez Pas Encore Déployé

Si vous n'avez pas encore créé le service sur Render :

1. **Allez sur** : [https://dashboard.render.com](https://dashboard.render.com)
2. **Cliquez sur "New +"** → **"Web Service"**
3. **Connectez votre repo GitHub** : `fakhreddinefaidi/PeakPlay`
4. **Configurez** :
   - **Name** : `dam-backend` (ou votre choix)
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm run start`
5. **Ajoutez les variables d'environnement** (voir `RENDER_DEPLOY.md`)
6. **Cliquez sur "Create Web Service"**
7. **Attendez le déploiement** (2-5 minutes)
8. **L'URL sera affichée** une fois le déploiement terminé

---

## 🎯 Test Rapide

Une fois que vous avez l'URL, testez avec :

### cURL
```bash
curl https://votre-service.onrender.com/api/v1
```

### Navigateur
Ouvrez dans votre navigateur :
```
https://votre-service.onrender.com/api
```

Vous devriez voir la documentation Swagger !

---

## 📝 Note

**Format de l'URL Render** :
- **Free Plan** : `https://votre-service.onrender.com`
- **Paid Plan** : Peut avoir un domaine personnalisé

L'URL est **toujours en HTTPS** (Render fournit automatiquement le certificat SSL).

