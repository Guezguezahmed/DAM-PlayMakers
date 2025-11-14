# 🧪 Test : Liaison d'un Compte Google à un Compte Existant

## 🎯 Objectif

Tester le scénario où un utilisateur :
1. **Crée d'abord un compte** avec email/mot de passe (register)
2. **Puis se connecte avec Google** en utilisant le **même email**
3. Le système doit **lier automatiquement** le compte Google au compte existant

---

## 📋 Étapes de Test

### **Étape 1 : Créer un compte avec email/mot de passe**

#### Via Swagger ou Postman :

**Endpoint :** `POST /api/v1/auth/register`

**Body :**
```json
{
  "email": "test@gmail.com",
  "password": "password123",
  "prenom": "Test",
  "nom": "User",
  "age": "2000-01-01",
  "tel": 123456789,
  "role": "JOUEUR"
}
```

**Résultat attendu :**
```json
{
  "_id": "...",
  "email": "test@gmail.com",
  "prenom": "Test",
  "nom": "User",
  "emailVerified": false,
  "provider": null,
  "providerId": null,
  "role": "JOUEUR"
}
```

**✅ Vérification :**
- Compte créé avec `emailVerified: false`
- Pas de `provider` ni `providerId` (compte classique)
- Email de vérification envoyé

---

### **Étape 2 : Vérifier dans MongoDB**

**Connectez-vous à MongoDB et vérifiez :**

```javascript
db.users.findOne({ email: "test@gmail.com" })
```

**Résultat attendu :**
```javascript
{
  _id: ObjectId("..."),
  email: "test@gmail.com",
  prenom: "Test",
  nom: "User",
  emailVerified: false,
  provider: null,        // ❌ Pas de provider
  providerId: null,      // ❌ Pas de providerId
  password: "$2a$10...", // ✅ Mot de passe hashé
  role: "JOUEUR"
}
```

---

### **Étape 3 : Se connecter avec Google (même email)**

#### Via Navigateur :

**URL :** `https://peakplay-14.onrender.com/api/v1/auth/google`

**OU en local :** `http://localhost:3001/api/v1/auth/google`

**Actions :**
1. Ouvrir l'URL dans le navigateur
2. Google demande de se connecter
3. **IMPORTANT :** Utiliser le **même email** que celui utilisé à l'étape 1 (`test@gmail.com`)
4. Autoriser l'accès

---

### **Étape 4 : Vérifier les logs du backend**

**Logs attendus :**

```
📧 [GOOGLE_OAUTH] Données récupérées depuis Google:
   → Email: test@gmail.com
   → Prénom: Test
   → Nom: User
   → Nom complet: Test User
   → Photo: Oui

[findOrCreateOAuthUser] Recherche par provider et providerId...
[findOrCreateOAuthUser] Utilisateur non trouvé avec ce provider
[findOrCreateOAuthUser] Recherche par email...
[findOrCreateOAuthUser] ✅ Utilisateur trouvé avec cet email
[findOrCreateOAuthUser] Liaison du compte Google au compte existant
✅ Nouvel utilisateur OAuth créé: test@gmail.com Provider: google - Email automatiquement vérifié
```

---

### **Étape 5 : Vérifier dans MongoDB (après liaison)**

**Connectez-vous à MongoDB et vérifiez :**

```javascript
db.users.findOne({ email: "test@gmail.com" })
```

**Résultat attendu :**
```javascript
{
  _id: ObjectId("..."),
  email: "test@gmail.com",
  prenom: "Test",
  nom: "User",
  emailVerified: true,           // ✅ Maintenant vérifié !
  provider: "google",             // ✅ Provider ajouté
  providerId: "123456789...",     // ✅ ID Google ajouté
  picture: "https://...",         // ✅ Photo Google ajoutée
  password: "$2a$10...",          // ✅ Mot de passe conservé
  role: "JOUEUR"
}
```

**✅ Vérifications importantes :**
- ✅ `emailVerified: true` (était `false`, maintenant `true`)
- ✅ `provider: "google"` (était `null`, maintenant `"google"`)
- ✅ `providerId: "123456789..."` (était `null`, maintenant contient l'ID Google)
- ✅ `picture: "https://..."` (photo Google ajoutée)
- ✅ `password` conservé (l'utilisateur peut toujours se connecter avec email/mot de passe)

---

### **Étape 6 : Tester la connexion avec email/mot de passe**

**Endpoint :** `POST /api/v1/auth/login`

**Body :**
```json
{
  "email": "test@gmail.com",
  "password": "password123"
}
```

**Résultat attendu :**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**✅ Vérification :**
- L'utilisateur peut **toujours** se connecter avec email/mot de passe
- Le compte est maintenant lié à Google ET peut utiliser email/mot de passe

---

### **Étape 7 : Tester la connexion avec Google (nouvelle connexion)**

**URL :** `https://peakplay-14.onrender.com/api/v1/auth/google`

**Actions :**
1. Ouvrir l'URL dans le navigateur
2. Se connecter avec Google (même compte)
3. Autoriser l'accès

**Résultat attendu :**
- Connexion directe (pas de création, compte déjà lié)
- Token JWT généré
- Redirection vers le frontend

**Logs attendus :**
```
[findOrCreateOAuthUser] Recherche par provider et providerId...
[findOrCreateOAuthUser] ✅ Utilisateur trouvé avec ce provider
✅ Connexion réussie avec compte Google lié
```

---

## 🔍 Vérifications Finales

### ✅ Checklist de Test

- [ ] Compte créé avec email/mot de passe (`emailVerified: false`)
- [ ] Pas de `provider` ni `providerId` dans MongoDB
- [ ] Connexion avec Google (même email)
- [ ] Logs montrent la liaison du compte
- [ ] MongoDB montre `provider: "google"` et `providerId` ajoutés
- [ ] `emailVerified: true` (était `false`)
- [ ] Photo Google ajoutée (`picture`)
- [ ] Mot de passe conservé (peut toujours se connecter avec email/mot de passe)
- [ ] Connexion avec email/mot de passe fonctionne toujours
- [ ] Connexion avec Google fonctionne (connexion directe)

---

## 🐛 Dépannage

### Problème 1 : Le compte n'est pas lié

**Symptôme :** Après connexion Google, `provider` est toujours `null`

**Solutions :**
1. Vérifier les logs du backend pour voir si `findOrCreateOAuthUser` est appelé
2. Vérifier que l'email correspond exactement (case-sensitive)
3. Vérifier que le compte existe bien dans MongoDB avant la connexion Google

### Problème 2 : Email non vérifié après liaison

**Symptôme :** `emailVerified` reste `false` après liaison

**Solution :** Vérifier le code dans `auth.service.ts` ligne 238-242 :
```typescript
if (!user.emailVerified) {
  user.emailVerified = true;
  // ...
  await user.save();
}
```

### Problème 3 : Erreur "Google OAuth2 is not configured"

**Symptôme :** Erreur lors de l'accès à `/api/v1/auth/google`

**Solution :** Vérifier les variables d'environnement :
```env
GOOGLE_CLIENT_ID=votre-client-id
GOOGLE_CLIENT_SECRET=votre-client-secret
```

---

## 📊 Résultat Attendu

**Avant la liaison :**
```javascript
{
  email: "test@gmail.com",
  emailVerified: false,
  provider: null,
  providerId: null,
  picture: undefined
}
```

**Après la liaison :**
```javascript
{
  email: "test@gmail.com",
  emailVerified: true,        // ✅ Vérifié
  provider: "google",          // ✅ Provider ajouté
  providerId: "123456789...",  // ✅ ID Google ajouté
  picture: "https://...",      // ✅ Photo ajoutée
  password: "$2a$10..."        // ✅ Conservé
}
```

---

## ✅ Conclusion

Après ce test, vous devriez avoir :
- ✅ Un compte lié à Google ET email/mot de passe
- ✅ Email automatiquement vérifié
- ✅ Possibilité de se connecter avec les deux méthodes
- ✅ Données Google (photo, etc.) ajoutées au compte

**Le compte est maintenant unifié !** 🎉

