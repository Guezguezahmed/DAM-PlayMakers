# 🐛 Guide de Diagnostic - Problème d'Enregistrement

## 📋 Problème
Lorsque vous faites un `register`, aucun utilisateur n'est enregistré dans la base de données.

---

## 🔍 Étapes de Diagnostic

### Étape 1 : Vérifier que MongoDB est démarré

```bash
# Vérifier si MongoDB est en cours d'exécution
# Windows (PowerShell)
Get-Process -Name mongod -ErrorAction SilentlyContinue

# Ou vérifier le port
netstat -an | findstr :27017
```

**Si MongoDB n'est pas démarré :**
```bash
# Démarrer MongoDB (selon votre installation)
mongod
```

**Vérifier la connexion dans `.env` :**
```env
MONGODB_URI=mongodb://localhost:27017/dam_backend
```

---

### Étape 2 : Vérifier les Logs du Serveur

Démarrez le serveur en mode développement pour voir les logs :
```bash
npm run start:dev
```

**Lorsque vous faites un register, vous devriez voir :**
```
📝 Tentative d'enregistrement pour: user@example.com
💾 Tentative de sauvegarde de l'utilisateur...
✅ Utilisateur sauvegardé avec succès, ID: ...
📧 Email de vérification envoyé
```

**Si vous voyez des erreurs, notez-les !**

---

### Étape 3 : Tester avec Swagger

1. **Démarrer le serveur :**
   ```bash
   npm run start:dev
   ```

2. **Ouvrir Swagger :**
   - URL : `http://localhost:3002/api`
   - Aller à `POST /api/v1/auth/register`

3. **Tester avec ces données :**
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "prenom": "Test",
     "nom": "User",
     "age": "2000-01-01",
     "tel": 123456789,
     "role": "JOUEUR"
   }
   ```

4. **Vérifier la réponse :**
   - ✅ **201 Created** : Utilisateur créé avec succès
   - ❌ **400 Bad Request** : Erreur de validation
   - ❌ **409 Conflict** : Email déjà existant
   - ❌ **500 Internal Server Error** : Erreur serveur

---

### Étape 4 : Vérifier dans MongoDB

Connectez-vous à MongoDB pour vérifier si l'utilisateur a été créé :

```javascript
// Se connecter à MongoDB
mongosh

// Utiliser la base de données
use dam_backend

// Vérifier les utilisateurs
db.users.find().pretty()

// Chercher un utilisateur spécifique
db.users.findOne({ email: "test@example.com" })
```

**Si l'utilisateur n'existe pas :**
- Vérifiez les logs du serveur pour voir l'erreur
- Vérifiez que MongoDB est bien connecté

---

### Étape 5 : Vérifier les Erreurs Courantes

#### Erreur 1 : Validation Failed
**Symptôme :** Erreur 400 avec message de validation

**Cause :** Un champ requis manque ou est invalide

**Solution :** Vérifiez que tous les champs sont présents et valides :
- `email` : doit être un email valide
- `password` : doit être une chaîne
- `prenom` : doit être une chaîne non vide
- `nom` : doit être une chaîne non vide
- `age` : doit être une date (format YYYY-MM-DD)
- `tel` : doit être un nombre
- `role` : doit être 'JOUEUR', 'OWNER', ou 'ARBITRE'

#### Erreur 2 : Email Already Exists
**Symptôme :** Erreur 409 "Un utilisateur avec cet email existe déjà"

**Cause :** L'email existe déjà dans la base de données

**Solution :** Utilisez un autre email ou supprimez l'utilisateur existant

#### Erreur 3 : MongoDB Connection Error
**Symptôme :** Erreur 500 avec message de connexion MongoDB

**Cause :** MongoDB n'est pas démarré ou l'URI est incorrecte

**Solution :**
1. Vérifiez que MongoDB est démarré
2. Vérifiez `MONGODB_URI` dans `.env`
3. Testez la connexion : `mongosh mongodb://localhost:27017/dam_backend`

#### Erreur 4 : Email Sending Failed
**Symptôme :** L'utilisateur est créé mais l'email échoue

**Cause :** Configuration email incorrecte

**Solution :** 
- L'utilisateur est quand même créé (l'email ne bloque pas l'enregistrement)
- Vérifiez `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS` dans `.env`
- Vérifiez les logs pour l'erreur email spécifique

---

### Étape 6 : Vérifier le Schéma User

Le schéma User a ces champs requis :
- ✅ `email` : **requis** et unique
- ❌ `password` : optionnel (peut être undefined pour OAuth)
- ❌ Tous les autres champs sont optionnels

**Si un champ requis manque, MongoDB refusera la sauvegarde.**

---

## 🧪 Test Complet

### Test 1 : Register Simple
```bash
curl -X POST http://localhost:3002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "password": "password123",
    "prenom": "Test",
    "nom": "User",
    "age": "2000-01-01",
    "tel": 123456789,
    "role": "JOUEUR"
  }'
```

**Résultat attendu :**
```json
{
  "_id": "...",
  "email": "test1@example.com",
  "prenom": "Test",
  "nom": "User",
  "emailVerified": false,
  ...
}
```

### Test 2 : Vérifier dans MongoDB
```javascript
db.users.findOne({ email: "test1@example.com" })
```

**Résultat attendu :** L'utilisateur doit exister

---

## 🔧 Solutions selon le Problème

### Si l'utilisateur n'est PAS créé :

1. **Vérifiez les logs du serveur** - Cherchez les erreurs
2. **Vérifiez MongoDB** - Est-il démarré et accessible ?
3. **Vérifiez la connexion** - Testez `MONGODB_URI`
4. **Vérifiez la validation** - Tous les champs sont-ils valides ?

### Si l'utilisateur EST créé mais vous ne le voyez pas :

1. **Vérifiez la bonne base de données** - `use dam_backend`
2. **Vérifiez avec l'email** - `db.users.findOne({ email: "..." })`
3. **Vérifiez les collections** - `show collections`

---

## 📝 Logs à Surveiller

Quand vous faites un register, surveillez ces logs :

```
📝 Tentative d'enregistrement pour: user@example.com
💾 Tentative de sauvegarde de l'utilisateur...
✅ Utilisateur sauvegardé avec succès, ID: 507f1f77bcf86cd799439011
📧 Email de vérification envoyé
```

**Si vous ne voyez pas "✅ Utilisateur sauvegardé avec succès" :**
- Il y a une erreur avant la sauvegarde
- Vérifiez les logs pour l'erreur spécifique

**Si vous voyez "✅ Utilisateur sauvegardé" mais pas dans MongoDB :**
- Vérifiez que vous regardez la bonne base de données
- Vérifiez que MongoDB n'a pas de problème de persistance

---

## 🆘 Prochaines Étapes

1. **Faites un register via Swagger**
2. **Regardez les logs du serveur** (dans le terminal où `npm run start:dev` tourne)
3. **Copiez les erreurs que vous voyez**
4. **Vérifiez dans MongoDB** si l'utilisateur existe
5. **Partagez les résultats** pour qu'on puisse identifier le problème exact

---

## 💡 Améliorations Apportées

J'ai ajouté :
- ✅ Logs détaillés pour chaque étape
- ✅ Gestion d'erreur améliorée
- ✅ L'envoi d'email ne bloque plus l'enregistrement
- ✅ Messages d'erreur plus clairs

Ces logs vous aideront à identifier exactement où le problème se produit.

