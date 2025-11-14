# 🧪 Test : Login avec un Compte Google Réel

## 🎯 Objectif

Tester le login avec votre **vrai compte Google** (celui que vous utilisez tous les jours).

---

## 📋 Étapes de Test

### **Étape 1 : Vérifier la Configuration**

Avant de commencer, assurez-vous que les variables d'environnement sont configurées :

```env
GOOGLE_CLIENT_ID=votre-client-id-google
GOOGLE_CLIENT_SECRET=votre-client-secret-google
BACKEND_URL=https://peakplay-14.onrender.com
FRONTEND_URL=https://votre-frontend.com (optionnel)
```

---

### **Étape 2 : Accéder à l'Endpoint Google OAuth**

#### **Option A : Via Navigateur (Recommandé)**

Ouvrez votre navigateur et allez à :

**En Production (Render) :**
```
https://peakplay-14.onrender.com/api/v1/auth/google
```

**En Local :**
```
http://localhost:3001/api/v1/auth/google
```

#### **Option B : Via Swagger**

1. Ouvrez Swagger : `https://peakplay-14.onrender.com/api`
2. Trouvez l'endpoint : `GET /api/v1/auth/google`
3. Cliquez sur "Try it out"
4. Cliquez sur "Execute"
5. Vous serez redirigé vers Google

---

### **Étape 3 : S'authentifier avec Google**

**Ce qui va se passer :**

1. **Redirection vers Google**
   - Vous verrez la page de connexion Google
   - URL : `https://accounts.google.com/o/oauth2/v2/auth?...`

2. **Connexion avec votre compte Google**
   - Entrez votre email Google (ex: `votre-email@gmail.com`)
   - Entrez votre mot de passe Google
   - Cliquez sur "Suivant"

3. **Demande de permissions**
   - Google vous demande d'autoriser l'application à accéder à :
     - ✅ Votre adresse email
     - ✅ Votre profil (nom, prénom, photo)
   - Cliquez sur **"Autoriser"** ou **"Allow"**

4. **Redirection automatique**
   - Google vous redirige automatiquement vers votre backend
   - URL : `https://peakplay-14.onrender.com/api/v1/auth/google/redirect?code=...`

---

### **Étape 4 : Vérifier les Logs du Backend**

**Logs attendus dans la console du serveur :**

```
📧 [GOOGLE_OAUTH] Données récupérées depuis Google:
   → Email: votre-email@gmail.com
   → Prénom: Votre Prénom
   → Nom: Votre Nom
   → Nom complet: Votre Prénom Votre Nom
   → Photo: Oui

[findOrCreateOAuthUser] Recherche par provider et providerId...
[findOrCreateOAuthUser] Utilisateur non trouvé avec ce provider
[findOrCreateOAuthUser] Recherche par email...
[findOrCreateOAuthUser] Utilisateur non trouvé avec cet email
[findOrCreateOAuthUser] Création d'un nouvel utilisateur
✅ Nouvel utilisateur OAuth créé: votre-email@gmail.com Provider: google - Email automatiquement vérifié
```

**OU** (si le compte existe déjà) :

```
[findOrCreateOAuthUser] Recherche par provider et providerId...
[findOrCreateOAuthUser] ✅ Utilisateur trouvé avec ce provider
✅ Connexion réussie avec compte Google existant
```

---

### **Étape 5 : Vérifier le Résultat**

#### **Option A : Mode Production (avec FRONTEND_URL)**

Si `FRONTEND_URL` est configuré :
- Vous serez **redirigé automatiquement** vers votre frontend
- URL : `https://votre-frontend.com/auth/success`
- Un cookie `access_token` sera créé dans votre navigateur

#### **Option B : Mode Test (sans FRONTEND_URL)**

Si `FRONTEND_URL` n'est pas configuré :
- Vous verrez une réponse JSON dans le navigateur :

```json
{
  "message": "✅ Google authentication successful!",
  "user": {
    "_id": "...",
    "email": "votre-email@gmail.com",
    "prenom": "Votre Prénom",
    "nom": "Votre Nom",
    "picture": "https://lh3.googleusercontent.com/...",
    "provider": "google",
    "providerId": "12345678901234567890",
    "emailVerified": true,
    "role": "JOUEUR"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **Étape 6 : Vérifier dans MongoDB**

**Connectez-vous à MongoDB et vérifiez :**

```javascript
db.users.findOne({ email: "votre-email@gmail.com" })
```

**Résultat attendu :**

```javascript
{
  _id: ObjectId("..."),
  email: "votre-email@gmail.com",        // ✅ Votre email réel
  prenom: "Votre Prénom",                 // ✅ Votre prénom réel
  nom: "Votre Nom",                      // ✅ Votre nom réel
  picture: "https://lh3.googleusercontent.com/...", // ✅ Votre photo Google
  provider: "google",                    // ✅ Provider
  providerId: "12345678901234567890",    // ✅ ID Google unique
  emailVerified: true,                   // ✅ Automatiquement vérifié
  role: "JOUEUR",                        // ✅ Rôle par défaut
  password: "$2a$10...",                 // ✅ Mot de passe généré
  age: ISODate("1970-01-01T00:00:00.000Z"), // ⚠️ Valeur par défaut
  tel: 0                                 // ⚠️ Valeur par défaut
}
```

---

### **Étape 7 : Vérifier l'Email de Notification**

**Vérifiez votre boîte de réception Gmail :**

Vous devriez recevoir un email avec le sujet :
```
🔐 Notification de connexion - PeakPlay
```

**Contenu de l'email :**
```
Bonjour,

Une connexion à votre compte PeakPlay ⚽ a été effectuée avec succès.

Date et heure : 15/01/2024, 14:30
Adresse IP : 192.168.1.1

⚠️ Si vous n'êtes pas à l'origine de cette connexion, veuillez changer votre mot de passe immédiatement.

Cordialement,
L'équipe PeakPlay
```

---

## 🔍 Vérifications Importantes

### ✅ Checklist de Test

- [ ] Redirection vers Google fonctionne
- [ ] Connexion avec votre compte Google réussie
- [ ] Autorisation des permissions accordée
- [ ] Redirection vers le backend réussie
- [ ] Logs montrent les données récupérées depuis Google
- [ ] Utilisateur créé ou trouvé dans MongoDB
- [ ] Toutes les données réelles sont stockées (email, nom, prénom, photo)
- [ ] `emailVerified: true` dans MongoDB
- [ ] `provider: "google"` dans MongoDB
- [ ] `providerId` unique dans MongoDB
- [ ] Token JWT généré
- [ ] Cookie `access_token` créé (si frontend configuré)
- [ ] Email de notification reçu

---

## 🐛 Dépannage

### Problème 1 : Erreur "Google OAuth2 is not configured"

**Symptôme :**
```json
{
  "statusCode": 400,
  "message": "Google OAuth2 is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file."
}
```

**Solution :**
1. Vérifier que `GOOGLE_CLIENT_ID` est défini dans `.env` ou Render
2. Vérifier que `GOOGLE_CLIENT_SECRET` est défini dans `.env` ou Render
3. Redémarrer l'application après modification

---

### Problème 2 : Erreur "redirect_uri_mismatch"

**Symptôme :**
Google affiche : "Error 400: redirect_uri_mismatch"

**Solution :**
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Ouvrir votre OAuth 2.0 Client ID
3. Dans "URI de redirection autorisées", ajouter :
   ```
   https://peakplay-14.onrender.com/api/v1/auth/google/redirect
   ```
   OU en local :
   ```
   http://localhost:3001/api/v1/auth/google/redirect
   ```
4. Sauvegarder

---

### Problème 3 : Redirection vers une page blanche

**Symptôme :**
Après autorisation Google, la page est blanche ou erreur 404

**Solution :**
1. Vérifier que `BACKEND_URL` est correctement configuré
2. Vérifier que l'URL de redirection dans Google Cloud Console correspond exactement
3. Vérifier les logs du backend pour voir les erreurs

---

### Problème 4 : Données non récupérées

**Symptôme :**
Les logs montrent `Email: undefined` ou `Prénom: undefined`

**Solution :**
1. Vérifier que les scopes sont corrects dans `google.strategy.ts` :
   ```typescript
   scope: ['email', 'profile']
   ```
2. Vérifier que l'écran de consentement OAuth dans Google Cloud Console est configuré
3. Révoquer les permissions dans votre compte Google et réessayer

---

## 📊 Résultat Attendu

### **Si c'est la première fois :**

**MongoDB :**
```javascript
{
  email: "votre-email@gmail.com",     // ✅ Votre email réel
  prenom: "Votre Prénom",            // ✅ Votre prénom réel
  nom: "Votre Nom",                  // ✅ Votre nom réel
  picture: "https://...",            // ✅ Votre photo Google
  provider: "google",                // ✅ Provider
  providerId: "123456789...",        // ✅ ID Google unique
  emailVerified: true                // ✅ Automatiquement vérifié
}
```

**Réponse du backend :**
```json
{
  "message": "✅ Google authentication successful!",
  "user": { ... },
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### **Si vous vous reconnectez :**

**MongoDB :**
- Même structure, mais l'utilisateur existe déjà
- Pas de nouvelle création

**Réponse du backend :**
- Même structure
- Token JWT généré pour la nouvelle session

---

## ✅ Conclusion

Après ce test, vous devriez avoir :
- ✅ Un compte créé avec vos **vraies données Google**
- ✅ Email automatiquement vérifié
- ✅ Photo de profil Google stockée
- ✅ Token JWT généré pour la session
- ✅ Email de notification reçu
- ✅ Possibilité de vous reconnecter avec Google

**Votre compte Google est maintenant lié à votre application !** 🎉

---

## 🔄 Test de Reconnexion

Pour tester la reconnexion :

1. **Déconnectez-vous** (supprimez le cookie ou attendez l'expiration)
2. **Reconnectez-vous** avec Google : `GET /api/v1/auth/google`
3. **Vérifiez** que vous êtes connecté directement (pas de nouvelle création)

**Logs attendus :**
```
[findOrCreateOAuthUser] Recherche par provider et providerId...
[findOrCreateOAuthUser] ✅ Utilisateur trouvé avec ce provider
✅ Connexion réussie avec compte Google existant
```

