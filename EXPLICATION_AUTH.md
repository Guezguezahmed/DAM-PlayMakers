# 🔐 Explication du Système d'Authentification

## 📋 Vue d'ensemble

Votre projet supporte **3 méthodes d'authentification** :

1. **Login classique** (email + mot de passe)
2. **Google OAuth2**
3. **Facebook OAuth2**

## ✅ Réponse courte : OUI, n'importe quel utilisateur peut s'authentifier avec les 3 méthodes

---

## 🎯 Comment ça fonctionne ?

### 1️⃣ **Login Classique** (`POST /api/v1/auth/login`)

**Comment ça marche :**
- L'utilisateur doit d'abord **s'inscrire** via `POST /api/v1/auth/register`
- Il fournit : email, mot de passe, nom, prénom, etc.
- Un compte est créé dans la base de données avec un mot de passe hashé
- Pour se connecter, il utilise son **email + mot de passe**

**Exemple de flux :**
```
1. Utilisateur s'inscrit → POST /auth/register
   { email: "john@example.com", password: "123456", ... }
   
2. Compte créé dans la base de données

3. Utilisateur se connecte → POST /auth/login
   { email: "john@example.com", password: "123456" }
   
4. Backend vérifie email + mot de passe → Génère un token JWT
```

---

### 2️⃣ **Google OAuth2** (`GET /api/v1/auth/google`)

**Comment ça marche :**
- L'utilisateur clique sur "Se connecter avec Google"
- Redirection vers Google pour se connecter
- Google renvoie les informations (email, nom, photo)
- Le backend **trouve ou crée** automatiquement l'utilisateur
- Génère un token JWT

**Exemple de flux :**
```
1. Utilisateur visite → GET /auth/google

2. Redirection vers Google → L'utilisateur se connecte avec son compte Google

3. Google redirige vers → GET /auth/google/redirect
   Avec les infos : { email: "john@gmail.com", name: "John Doe", ... }

4. Backend appelle findOrCreateOAuthUser() :
   - Cherche si un utilisateur existe avec cet email
   - Si OUI → Retourne l'utilisateur existant
   - Si NON → Crée un nouvel utilisateur automatiquement
   
5. Génère un token JWT → Utilisateur connecté
```

---

### 3️⃣ **Facebook OAuth2** (`GET /api/v1/auth/facebook`)

**Même principe que Google :**
- L'utilisateur clique sur "Se connecter avec Facebook"
- Redirection vers Facebook
- Facebook renvoie les informations
- Le backend **trouve ou crée** automatiquement l'utilisateur
- Génère un token JWT

---

## 🔗 Liaison des Comptes (Linking)

### Scénario 1 : Utilisateur existe déjà avec login classique

**Exemple :**
```
1. John s'inscrit avec email/password : john@example.com
2. Plus tard, John se connecte avec Google (même email : john@example.com)
3. Le système DÉTECTE que l'email existe déjà
4. Il LIE automatiquement le compte Google au compte existant
5. John peut maintenant se connecter avec :
   - Email/password OU
   - Google
```

**Code responsable :**
```typescript
// Dans findOrCreateOAuthUser()
let user = await this.userModel.findOne({ email });

if (user) {
  // Si l'utilisateur existe mais n'a pas de provider, on le lie
  if (!user.provider || !user.providerId) {
    user.provider = provider; // 'google' ou 'facebook'
    user.providerId = providerId;
    await user.save();
  }
  return user; // Retourne l'utilisateur existant
}
```

---

### Scénario 2 : Nouvel utilisateur via OAuth

**Exemple :**
```
1. Marie se connecte avec Google (email : marie@gmail.com)
2. Le système cherche dans la base → Aucun utilisateur avec cet email
3. Le système CRÉE automatiquement un compte pour Marie :
   - email: marie@gmail.com
   - prenom: "Marie" (depuis Google)
   - nom: "Dupont" (depuis Google)
   - password: Généré automatiquement (hashé)
   - role: "JOUEUR" (par défaut)
   - provider: "google"
   - providerId: "123456789" (ID Google)
   
4. Marie peut maintenant se connecter avec Google
```

**Code responsable :**
```typescript
// Si l'utilisateur n'existe pas, on le crée
const newUser = new this.userModel({
  prenom: profile.givenName || '',
  nom: profile.familyName || '',
  email,
  password: hashedPassword, // Généré automatiquement
  provider: 'google', // ou 'facebook'
  providerId: profile.id,
  role: 'JOUEUR', // Par défaut
  age: new Date('1970-01-01'), // Valeur par défaut
  tel: 0, // Valeur par défaut
});
```

---

## 🎭 Rôles et Permissions

### Rôles disponibles :
- **JOUEUR** : Utilisateur standard (par défaut pour OAuth)
- **OWNER** : Propriétaire (peut créer/supprimer des utilisateurs)
- **ARBITRE** : Arbitre (peut consulter tous les utilisateurs)

### Attribution des rôles :
- **Login classique** : Le rôle est défini lors de l'inscription (`POST /auth/register`)
- **OAuth (Google/Facebook)** : Le rôle est toujours **"JOUEUR"** par défaut

**Pour changer le rôle d'un utilisateur OAuth :**
- Un OWNER doit modifier manuellement via `PATCH /api/v1/users/:id`

---

## 🔄 Tableau Récapitulatif

| Méthode | Inscription requise ? | Création auto ? | Liaison auto ? |
|---------|----------------------|-----------------|----------------|
| **Login classique** | ✅ OUI | ❌ NON | - |
| **Google OAuth** | ❌ NON | ✅ OUI | ✅ OUI (si email existe) |
| **Facebook OAuth** | ❌ NON | ✅ OUI | ✅ OUI (si email existe) |

---

## 💡 Exemples Concrets

### Exemple 1 : Utilisateur avec les 3 méthodes

```
1. Alice s'inscrit → POST /auth/register
   Email: alice@example.com, Password: "secret123"
   → Compte créé avec role "OWNER"

2. Alice se connecte avec Google (même email)
   → Le système trouve son compte existant
   → Lie Google au compte
   → Alice peut maintenant utiliser email/password OU Google

3. Alice se connecte avec Facebook (même email)
   → Le système trouve son compte existant
   → Lie Facebook au compte
   → Alice peut maintenant utiliser email/password OU Google OU Facebook
```

### Exemple 2 : Nouvel utilisateur OAuth uniquement

```
1. Bob se connecte avec Google (email: bob@gmail.com)
   → Aucun compte avec cet email
   → Compte créé automatiquement
   → Role: "JOUEUR"
   → Bob peut se connecter avec Google

2. Plus tard, Bob veut utiliser login classique
   → Il doit d'abord définir un mot de passe
   → (Fonctionnalité à ajouter : "Définir un mot de passe")
```

---

## ⚠️ Points Importants

### 1. Email comme identifiant unique
- L'**email** est l'identifiant principal
- Si deux méthodes OAuth ont le même email → Compte lié automatiquement
- Si un login classique et un OAuth ont le même email → Compte lié automatiquement

### 2. Mot de passe pour OAuth
- Les utilisateurs créés via OAuth ont un mot de passe généré automatiquement
- Ils ne peuvent pas se connecter avec email/password (mot de passe inconnu)
- Solution : Ajouter une fonctionnalité "Définir un mot de passe"

### 3. Sécurité
- Les tokens JWT sont stockés dans des cookies httpOnly
- Les mots de passe sont hashés avec bcrypt
- Les routes protégées nécessitent un token JWT valide

---

## 🚀 Pour le Frontend

### Intégration recommandée :

```javascript
// 1. Login classique
POST /api/v1/auth/login
Body: { email: "user@example.com", password: "123456" }
Response: { success: true, access_token: "..." }

// 2. Google OAuth
// Rediriger l'utilisateur vers :
window.location.href = "http://localhost:3002/api/v1/auth/google"

// 3. Facebook OAuth
// Rediriger l'utilisateur vers :
window.location.href = "http://localhost:3002/api/v1/auth/facebook"

// Après OAuth, le token est dans un cookie httpOnly
// Ou dans la réponse JSON si FRONTEND_URL n'est pas configuré
```

---

## ✅ Résumé

**OUI**, n'importe quel utilisateur peut s'authentifier avec :
- ✅ Login classique (après inscription)
- ✅ Google OAuth (création/liaison automatique)
- ✅ Facebook OAuth (création/liaison automatique)

**Le système est intelligent :**
- Détecte si un utilisateur existe déjà (par email)
- Lie automatiquement les comptes
- Crée les utilisateurs si nécessaire
- Génère toujours un token JWT pour l'authentification

