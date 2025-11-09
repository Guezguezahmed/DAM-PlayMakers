# 🧪 Guide de Test du Login

## 📋 Prérequis

1. **Application déployée sur Render** (ou en local)
2. **Utilisateur créé** dans la base de données avec :
   - Email vérifié (`emailVerified: true`)
   - Mot de passe hashé

## 🚀 Méthode 1 : Test avec Swagger UI (Recommandé)

### Étape 1 : Accéder à Swagger

1. Ouvrez votre navigateur
2. Allez sur : `https://votre-backend.onrender.com/api` (ou `http://localhost:3002/api` en local)
3. Vous devriez voir l'interface Swagger

### Étape 2 : Tester le Login

1. Dans Swagger, trouvez la section **"Auth"**
2. Cliquez sur **`POST /api/v1/auth/login`**
3. Cliquez sur **"Try it out"**
4. Entrez les données :
   ```json
   {
     "email": "user@example.com",
     "password": "votre_mot_de_passe"
   }
   ```
5. Cliquez sur **"Execute"**

### Étape 3 : Vérifier la Réponse

**✅ Succès (200)** :
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**❌ Erreur (401)** :
```json
{
  "statusCode": 401,
  "message": "Email ou mot de passe incorrect"
}
```

---

## 🌐 Méthode 2 : Test avec cURL (Terminal)

### Test Basique

```bash
curl -X POST https://votre-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "votre_mot_de_passe"
  }'
```

### Test avec Affichage Détaillé (-v)

```bash
curl -X POST https://votre-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "votre_mot_de_passe"
  }' \
  -v
```

### Test avec Sauvegarde des Cookies

```bash
curl -X POST https://votre-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "votre_mot_de_passe"
  }' \
  -c cookies.txt \
  -v
```

### Test Local (si vous testez en local)

```bash
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "votre_mot_de_passe"
  }'
```

---

## 📮 Méthode 3 : Test avec Postman

### Configuration

1. **Méthode** : `POST`
2. **URL** : `https://votre-backend.onrender.com/api/v1/auth/login`
3. **Headers** :
   - `Content-Type: application/json`
4. **Body** (raw JSON) :
   ```json
   {
     "email": "user@example.com",
     "password": "votre_mot_de_passe"
   }
   ```

### Exécution

1. Cliquez sur **"Send"**
2. Vérifiez la réponse dans l'onglet **"Body"**
3. Vérifiez les cookies dans l'onglet **"Cookies"**

---

## 💻 Méthode 4 : Test avec JavaScript (Node.js)

Créez un fichier `test-login.js` :

```javascript
const https = require('https');
// Pour HTTP local : const http = require('http');

const data = JSON.stringify({
  email: 'user@example.com',
  password: 'votre_mot_de_passe'
});

const options = {
  hostname: 'votre-backend.onrender.com', // ou 'localhost' en local
  port: 443, // ou 3002 en local
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response:', JSON.parse(responseData));
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
```

**Exécution** :
```bash
node test-login.js
```

---

## 🌍 Méthode 5 : Test avec Fetch (Navigateur)

Ouvrez la console du navigateur (F12) et exécutez :

```javascript
fetch('https://votre-backend.onrender.com/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important pour les cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'votre_mot_de_passe'
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

---

## 🔍 Méthode 6 : Test avec Axios (Node.js ou Frontend)

```javascript
const axios = require('axios');

axios.post('https://votre-backend.onrender.com/api/v1/auth/login', {
  email: 'user@example.com',
  password: 'votre_mot_de_passe'
}, {
  withCredentials: true, // Important pour les cookies
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    console.log('Success:', response.data);
    console.log('Token:', response.data.access_token);
  })
  .catch(error => {
    console.error('Error:', error.response?.data || error.message);
  });
```

---

## 📊 Vérification des Logs Render

### Étape 1 : Accéder aux Logs

1. Allez sur votre dashboard Render
2. Sélectionnez votre service
3. Cliquez sur **"Logs"**

### Étape 2 : Identifier les Messages de Login

Après une tentative de login, vous devriez voir :

```
[LOGIN] Tentative de connexion pour: user@example.com
[VALIDATE_USER] Recherche de l'utilisateur: user@example.com
[VALIDATE_USER] Utilisateur validé avec succès: user@example.com
[LOGIN] Utilisateur validé: user@example.com
[LOGIN] Token JWT généré pour: user@example.com
[LOGIN] Token généré avec succès pour: user@example.com
[LOGIN] Cookie défini avec secure=true, sameSite=none
```

### Messages d'Erreur Possibles

**Utilisateur non trouvé** :
```
[VALIDATE_USER] Utilisateur non trouvé: user@example.com
[LOGIN] Échec de validation pour: user@example.com
```

**Email non vérifié** :
```
[VALIDATE_USER] Email non vérifié: user@example.com
[LOGIN] Email non vérifié pour: user@example.com
```

**Mot de passe incorrect** :
```
[VALIDATE_USER] Mot de passe invalide pour: user@example.com
[LOGIN] Échec de validation pour: user@example.com
```

---

## ✅ Checklist de Test

### Test 1 : Login Réussi
- [ ] Utilisateur existe dans MongoDB
- [ ] Email est vérifié (`emailVerified: true`)
- [ ] Mot de passe est correct
- [ ] Réponse 200 avec `access_token`
- [ ] Cookie `access_token` est défini

### Test 2 : Email Incorrect
- [ ] Réponse 401
- [ ] Message : "Email ou mot de passe incorrect"
- [ ] Logs montrent : `[VALIDATE_USER] Utilisateur non trouvé`

### Test 3 : Mot de Passe Incorrect
- [ ] Réponse 401
- [ ] Message : "Email ou mot de passe incorrect"
- [ ] Logs montrent : `[VALIDATE_USER] Mot de passe invalide`

### Test 4 : Email Non Vérifié
- [ ] Réponse 401
- [ ] Message : "Veuillez vérifier votre adresse email..."
- [ ] Logs montrent : `[VALIDATE_USER] Email non vérifié`

### Test 5 : Utilisateur OAuth (sans mot de passe)
- [ ] Réponse 401
- [ ] Message : "Email ou mot de passe incorrect"
- [ ] Logs montrent : `[VALIDATE_USER] Utilisateur sans mot de passe (OAuth)`

---

## 🐛 Dépannage

### Erreur : "Network Error" ou "CORS Error"

**Solution** :
1. Vérifiez que `FRONTEND_URL` est défini sur Render
2. Vérifiez que l'origine de la requête correspond à `FRONTEND_URL`
3. Vérifiez les logs CORS : `[CORS] Configuration: origin=...`

### Erreur : "Internal Server Error" (500)

**Solution** :
1. Vérifiez les logs Render pour l'erreur exacte
2. Vérifiez que `JWT_SECRET` est défini (minimum 20 caractères)
3. Vérifiez que MongoDB est accessible

### Erreur : "Cannot connect to database"

**Solution** :
1. Vérifiez que `MONGODB_URI` est correct
2. Vérifiez que MongoDB Atlas autorise les connexions depuis Render
3. Vérifiez que le cluster MongoDB est actif

### Le Token n'est pas dans la Réponse

**Solution** :
1. Vérifiez les logs : `[LOGIN] Token généré avec succès`
2. Vérifiez que `JWT_SECRET` est défini
3. Vérifiez que le service JWT fonctionne

---

## 📝 Exemple de Test Complet

### 1. Créer un Utilisateur (si nécessaire)

```bash
# Via l'endpoint register
curl -X POST https://votre-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "prenom": "Test",
    "nom": "User"
  }'
```

### 2. Vérifier l'Email (si nécessaire)

```bash
# Vérifier l'email via le lien reçu
# Ou utiliser l'endpoint resend-verification
curl -X POST https://votre-backend.onrender.com/api/v1/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### 3. Tester le Login

```bash
curl -X POST https://votre-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }' \
  -v
```

### 4. Utiliser le Token

```bash
# Sauvegarder le token de la réponse précédente
TOKEN="votre_token_ici"

# Tester une route protégée
curl -X GET https://votre-backend.onrender.com/api/v1/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎯 Test Rapide (Copier-Coller)

### Windows PowerShell

```powershell
$body = @{
    email = "user@example.com"
    password = "votre_mot_de_passe"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://votre-backend.onrender.com/api/v1/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Linux/Mac

```bash
curl -X POST https://votre-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"votre_mot_de_passe"}'
```

---

## 📞 Support

Si le login ne fonctionne toujours pas après ces tests :

1. **Vérifiez les logs Render** pour les erreurs exactes
2. **Vérifiez les variables d'environnement** sur Render
3. **Vérifiez que MongoDB est accessible**
4. **Vérifiez que l'utilisateur existe et est vérifié**

Les logs détaillés vous indiqueront exactement où le problème se situe !

