# 🎯 Scénario Complet : Login avec Google

## ✅ Réponse Directe

**OUI, l'utilisateur peut se connecter avec son compte Google !**

---

## 📖 Scénario Détaillé : Étape par Étape

### 🎬 **Scénario 1 : Utilisateur NOUVEAU (première connexion)**

#### **Étape 1 : L'utilisateur clique sur "Se connecter avec Google"**

```
Frontend → GET https://peakplay-14.onrender.com/api/v1/auth/google
```

**Ce qui se passe :**
- Le backend vérifie que `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont configurés
- Si OK → Redirection automatique vers Google
- Si NON → Erreur : "Google OAuth2 is not configured"

#### **Étape 2 : Redirection vers Google**

```
Backend → Redirection vers Google OAuth
URL: https://accounts.google.com/o/oauth2/v2/auth?
     client_id=...&
     redirect_uri=https://peakplay-14.onrender.com/api/v1/auth/google/redirect&
     scope=email profile&
     response_type=code
```

**Ce qui se passe :**
- L'utilisateur voit la page de connexion Google
- Google demande les permissions : **email** et **profile**
- L'utilisateur clique sur "Autoriser"

#### **Étape 3 : Google redirige vers votre backend**

```
Google → GET https://peakplay-14.onrender.com/api/v1/auth/google/redirect?code=AUTHORIZATION_CODE
```

**Ce qui se passe :**
- Google envoie un **code d'autorisation** dans l'URL
- Le backend échange ce code contre un **access token** Google
- Le backend utilise l'access token pour récupérer le profil utilisateur

#### **Étape 4 : Récupération des données Google**

**Données récupérées depuis Google :**
```javascript
{
  id: "12345678901234567890",        // ID unique Google
  emails: [{ value: "john@gmail.com" }],
  name: {
    givenName: "John",                // Prénom
    familyName: "Doe"                 // Nom
  },
  displayName: "John Doe",            // Nom complet
  photos: [{ value: "https://..." }] // Photo de profil
}
```

**Logs dans le backend :**
```
📧 [GOOGLE_OAUTH] Données récupérées depuis Google:
   → Email: john@gmail.com
   → Prénom: John
   → Nom: Doe
   → Nom complet: John Doe
   → Photo: Oui
```

#### **Étape 5 : Recherche ou création de l'utilisateur**

**Le backend appelle `findOrCreateOAuthUser()` :**

1. **Recherche par Google ID** :
   ```javascript
   // Cherche si un utilisateur existe avec ce Google ID
   user = await User.findOne({ 
     provider: 'google', 
     providerId: '12345678901234567890' 
   });
   ```
   - ❌ **Pas trouvé** → Continue à l'étape suivante

2. **Recherche par Email** :
   ```javascript
   // Cherche si un utilisateur existe avec cet email
   user = await User.findOne({ email: 'john@gmail.com' });
   ```
   - ❌ **Pas trouvé** → Continue à l'étape suivante

3. **Création d'un NOUVEL utilisateur** :
   ```javascript
   const newUser = new User({
     email: "john@gmail.com",           // ✅ Email réel de Google
     prenom: "John",                     // ✅ Prénom réel
     nom: "Doe",                         // ✅ Nom réel
     picture: "https://...",             // ✅ Photo Google
     provider: "google",                 // ✅ Provider
     providerId: "12345678901234567890", // ✅ ID Google
     emailVerified: true,                // ✅ Automatiquement vérifié
     role: "JOUEUR",                     // ✅ Rôle par défaut
     password: "hashed_random",          // ✅ Mot de passe généré
     age: new Date('1970-01-01'),        // ⚠️ Valeur par défaut
     tel: 0                              // ⚠️ Valeur par défaut
   });
   await newUser.save();
   ```

#### **Étape 6 : Génération du token JWT**

```javascript
const token = jwt.sign({
  email: "john@gmail.com",
  sub: user._id,
  role: "JOUEUR"
}, SECRET_KEY);
```

#### **Étape 7 : Envoi d'email de notification**

```javascript
// Email envoyé automatiquement
await sendLoginNotificationEmail("john@gmail.com", {
  date: new Date(),
  ip: "192.168.1.1"
});
```

**Email reçu :**
```
Sujet: 🔐 Notification de connexion - PeakPlay
Contenu: Une connexion à votre compte PeakPlay ⚽ a été effectuée avec succès.
         Date et heure: 15/01/2024, 14:30
         Adresse IP: 192.168.1.1
```

#### **Étape 8 : Cookie et redirection**

```javascript
// Cookie créé
res.cookie('access_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 3600000  // 1 heure
});

// Redirection vers le frontend
res.redirect('https://votre-frontend.com/auth/success');
```

**OU** (si pas de FRONTEND_URL configuré) :
```json
{
  "message": "✅ Google authentication successful!",
  "user": { ... },
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 🎬 **Scénario 2 : Utilisateur EXISTANT (connexion suivante)**

#### **Étape 1-3 : Identiques au scénario 1**

#### **Étape 4 : Recherche de l'utilisateur**

**Le backend appelle `findOrCreateOAuthUser()` :**

1. **Recherche par Google ID** :
   ```javascript
   user = await User.findOne({ 
     provider: 'google', 
     providerId: '12345678901234567890' 
   });
   ```
   - ✅ **TROUVÉ !** → Utilisateur existant trouvé
   - ✅ Email automatiquement vérifié si ce n'était pas le cas
   - ✅ Retourne l'utilisateur existant

2. **Pas besoin de créer un nouvel utilisateur**

#### **Étape 5-8 : Identiques au scénario 1**

---

### 🎬 **Scénario 3 : Utilisateur avec compte EXISTANT (liaison de compte)**

**Cas spécial :** L'utilisateur a déjà un compte créé avec email/mot de passe, puis se connecte avec Google.

#### **Étape 1-3 : Identiques au scénario 1**

#### **Étape 4 : Recherche de l'utilisateur**

1. **Recherche par Google ID** :
   - ❌ **Pas trouvé**

2. **Recherche par Email** :
   ```javascript
   user = await User.findOne({ email: 'john@gmail.com' });
   ```
   - ✅ **TROUVÉ !** → Utilisateur existe déjà avec cet email

3. **Liaison du compte Google** :
   ```javascript
   // Ajoute les informations Google au compte existant
   user.provider = 'google';
   user.providerId = '12345678901234567890';
   user.emailVerified = true;  // Email maintenant vérifié
   await user.save();
   ```

**Résultat :**
- ✅ Le compte existant est maintenant lié à Google
- ✅ L'utilisateur peut se connecter avec Google OU email/mot de passe
- ✅ Email automatiquement vérifié

#### **Étape 5-8 : Identiques au scénario 1**

---

## 🔄 Diagramme de Flux

```
┌─────────────┐
│  Frontend   │
│  Utilisateur│
└──────┬──────┘
       │ 1. Clic "Se connecter avec Google"
       │    GET /api/v1/auth/google
       ▼
┌─────────────┐
│   Backend   │
│  NestJS     │
└──────┬──────┘
       │ 2. Redirection vers Google
       ▼
┌─────────────┐
│   Google    │
│  OAuth      │
└──────┬──────┘
       │ 3. Utilisateur s'authentifie
       │ 4. Google redirige avec code
       ▼
┌─────────────┐
│   Backend   │
│  Callback   │
│  /redirect  │
└──────┬──────┘
       │ 5. Échange code → access token
       │ 6. Récupération profil Google
       │ 7. findOrCreateOAuthUser()
       ▼
┌─────────────┐
│  MongoDB    │
│  Database   │
└──────┬──────┘
       │ 8. Création ou récupération utilisateur
       ▼
┌─────────────┐
│   Backend   │
│  Génération │
│  Token JWT  │
└──────┬──────┘
       │ 9. Cookie + Redirection
       ▼
┌─────────────┐
│  Frontend   │
│  Utilisateur│
│  Connecté   │
└─────────────┘
```

---

## 📋 Résumé des Cas d'Usage

| Cas | Compte Existe ? | Google ID Existe ? | Action |
|-----|----------------|-------------------|--------|
| **1. Nouvel utilisateur** | ❌ Non | ❌ Non | ✅ **Création** d'un nouveau compte |
| **2. Utilisateur existant (Google)** | ✅ Oui | ✅ Oui | ✅ **Connexion** avec compte existant |
| **3. Liaison de compte** | ✅ Oui | ❌ Non | ✅ **Liaison** Google au compte existant |

---

## ✅ Avantages du Login Google

1. **Pas besoin de s'inscrire** : Création automatique du compte
2. **Pas besoin de mot de passe** : Google gère l'authentification
3. **Email automatiquement vérifié** : `emailVerified: true`
4. **Données réelles** : Email, nom, prénom, photo récupérés automatiquement
5. **Sécurisé** : Google garantit l'identité de l'utilisateur
6. **Rapide** : Connexion en quelques clics

---

## 🔧 Configuration Requise

### Variables d'environnement :
```env
GOOGLE_CLIENT_ID=votre-client-id-google
GOOGLE_CLIENT_SECRET=votre-client-secret-google
BACKEND_URL=https://peakplay-14.onrender.com
FRONTEND_URL=https://votre-frontend.com (optionnel)
```

### Configuration Google Cloud Console :
- ✅ OAuth 2.0 activé
- ✅ URI de redirection : `https://peakplay-14.onrender.com/api/v1/auth/google/redirect`
- ✅ Scopes : `email`, `profile`

---

## 🧪 Test

**Pour tester le login Google :**

1. **Ouvrir dans le navigateur :**
   ```
   https://peakplay-14.onrender.com/api/v1/auth/google
   ```

2. **S'authentifier avec Google**

3. **Vérifier les logs du backend** pour voir les données récupérées

4. **Vérifier MongoDB** pour voir l'utilisateur créé/connecté

---

## ✅ Conclusion

**OUI, l'utilisateur peut se connecter avec son compte Google !**

Le système :
- ✅ Récupère toutes les données réelles (email, nom, prénom, photo)
- ✅ Crée automatiquement un compte si nécessaire
- ✅ Lie le compte Google à un compte existant si l'email correspond
- ✅ Vérifie automatiquement l'email
- ✅ Génère un token JWT pour la session
- ✅ Envoie un email de notification de connexion

**C'est simple, rapide et sécurisé !** 🎉

