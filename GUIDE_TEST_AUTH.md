# 🧪 Guide de Test - Authentification

## 📋 Prérequis

1. **MongoDB** doit être démarré et accessible sur `mongodb://localhost:27017/dam_backend`
2. **Variables d'environnement** configurées dans `.env`
3. **Serveur** démarré avec `npm run start` ou `npm run start:dev`

## 🚀 Démarrer le serveur

```bash
npm run start:dev
```

Le serveur sera accessible sur : **http://localhost:3002**

## 📚 Documentation Swagger

Accédez à la documentation interactive :
**http://localhost:3002/api**

## ✅ Scénarios de Test

### 1️⃣ Test d'Inscription (Register)

**Endpoint :** `POST /api/v1/auth/register`

**Body :**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "prenom": "John",
  "nom": "Doe",
  "age": "1990-01-01",
  "tel": 123456789,
  "role": "JOUEUR"
}
```

**Résultat attendu :**
- ✅ Status 201 : Utilisateur créé
- ✅ Email de vérification envoyé (si MAIL configuré)
- ✅ `emailVerified: false` dans la base de données

**Test avec email existant :**
- ❌ Status 409 : "Un utilisateur avec cet email existe déjà"

---

### 2️⃣ Test de Login (Sans email vérifié)

**Endpoint :** `POST /api/v1/auth/login`

**Body :**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Résultat attendu :**
- ❌ Status 401 : "Veuillez vérifier votre adresse email avant de vous connecter. Vérifiez votre boîte de réception."

---

### 3️⃣ Test de Vérification d'Email

**Option A : Via le lien dans l'email**
- Ouvrez l'email reçu (si MAIL configuré)
- Cliquez sur le lien de vérification
- Ou copiez le token et utilisez l'endpoint ci-dessous

**Option B : Via l'endpoint direct**
**Endpoint :** `GET /api/v1/auth/verify-email?token=VOTRE_TOKEN`

**Résultat attendu :**
- ✅ Status 200 : "✅ Adresse e-mail vérifiée avec succès."
- ✅ `emailVerified: true` dans la base de données

---

### 4️⃣ Test de Login (Avec email vérifié)

**Endpoint :** `POST /api/v1/auth/login`

**Body :**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Résultat attendu :**
- ✅ Status 200
- ✅ `access_token` dans la réponse
- ✅ Cookie `access_token` créé

**Réponse :**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 5️⃣ Test de Login avec Mauvais Mot de Passe

**Endpoint :** `POST /api/v1/auth/login`

**Body :**
```json
{
  "email": "test@example.com",
  "password": "mauvais_mot_de_passe"
}
```

**Résultat attendu :**
- ❌ Status 401 : "Email ou mot de passe incorrect"

---

### 6️⃣ Test de Login avec Email Inexistant

**Endpoint :** `POST /api/v1/auth/login`

**Body :**
```json
{
  "email": "inexistant@example.com",
  "password": "password123"
}
```

**Résultat attendu :**
- ❌ Status 401 : "Email ou mot de passe incorrect"

---

### 7️⃣ Test OAuth Google

**Endpoint :** `GET /api/v1/auth/google`

**Résultat attendu :**
- ✅ Redirection vers Google OAuth
- ✅ Après authentification Google, redirection vers `/api/v1/auth/google/redirect`
- ✅ Utilisateur créé automatiquement avec `emailVerified: true`
- ✅ Token JWT retourné

**Note :** Nécessite `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` dans `.env`

---

### 8️⃣ Test OAuth Facebook

**Endpoint :** `GET /api/v1/auth/facebook`

**Résultat attendu :**
- ✅ Redirection vers Facebook OAuth
- ✅ Après authentification Facebook, redirection vers `/api/v1/auth/facebook/redirect`
- ✅ Utilisateur créé automatiquement avec `emailVerified: true`
- ✅ Token JWT retourné

**Note :** Nécessite `FACEBOOK_APP_ID` et `FACEBOOK_APP_SECRET` dans `.env`

---

### 9️⃣ Test Renvoyer Email de Vérification

**Endpoint :** `POST /api/v1/auth/resend-verification`

**Body :**
```json
{
  "email": "test@example.com"
}
```

**Résultat attendu :**
- ✅ Status 200 : "Email de vérification renvoyé avec succès"
- ✅ Nouvel email envoyé

**Cas d'erreur :**
- ❌ Email déjà vérifié : Status 400
- ❌ Utilisateur OAuth : Status 400
- ❌ Utilisateur inexistant : Status 404

---

## 🔍 Vérification dans MongoDB

Connectez-vous à MongoDB pour vérifier les données :

```javascript
use dam_backend
db.users.find().pretty()
```

**Champs à vérifier :**
- `email` : Adresse email
- `emailVerified` : true/false
- `verificationToken` : Token JWT (si non vérifié)
- `provider` : "google" ou "facebook" (si OAuth)
- `role` : "JOUEUR", "OWNER", ou "ARBITRE"

---

## 🐛 Tests de Cas Limites

### Test 1 : Utilisateur OAuth essaie de se connecter avec email/password
- Créez un utilisateur via Google/Facebook
- Essayez de vous connecter avec email/password
- ❌ Résultat attendu : Status 401 (pas de mot de passe)

### Test 2 : Validation des champs
- Essayez de vous inscrire sans email
- ❌ Résultat attendu : Status 400 (validation error)

### Test 3 : Token de vérification expiré
- Attendez 24h après l'inscription
- Essayez de vérifier avec l'ancien token
- ❌ Résultat attendu : Status 400 (token expiré)

---

## 📝 Checklist de Test

- [ ] Inscription réussie
- [ ] Email de vérification reçu (si MAIL configuré)
- [ ] Login bloqué sans vérification d'email
- [ ] Vérification d'email réussie
- [ ] Login réussi après vérification
- [ ] Token JWT valide
- [ ] Cookie créé
- [ ] OAuth Google fonctionne
- [ ] OAuth Facebook fonctionne
- [ ] Renvoi d'email de vérification
- [ ] Gestion des erreurs (mauvais mot de passe, email inexistant, etc.)

---

## 🚨 Problèmes Courants

### Erreur 500 sur login
- Vérifiez que MongoDB est démarré
- Vérifiez que l'utilisateur existe dans la base
- Vérifiez les logs du serveur

### Email non reçu
- Vérifiez `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS` dans `.env`
- Vérifiez les logs du serveur pour les erreurs SMTP
- Utilisez un mot de passe d'application Gmail (pas le mot de passe normal)

### OAuth ne fonctionne pas
- Vérifiez `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` dans `.env`
- Vérifiez que les URLs de callback sont correctes
- Vérifiez la console du navigateur pour les erreurs

---

## 📞 Support

Si vous rencontrez des problèmes, vérifiez :
1. Les logs du serveur (`npm run start:dev`)
2. La console MongoDB
3. Les variables d'environnement dans `.env`

