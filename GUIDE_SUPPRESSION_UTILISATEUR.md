# 🗑️ Guide - Suppression d'Utilisateur

## 📋 Fonctionnalité Existante

La suppression d'utilisateur est **déjà implémentée** dans le système.

---

## 🔐 Restrictions de Sécurité

### Qui peut supprimer un utilisateur ?
- ✅ **Seuls les utilisateurs avec le rôle `OWNER`** peuvent supprimer un utilisateur
- ❌ Les utilisateurs `JOUEUR` et `ARBITRE` ne peuvent pas supprimer d'utilisateurs

---

## 📍 Endpoint

**Méthode :** `DELETE`  
**URL :** `/api/v1/users/:id`  
**Authentification :** Requise (Bearer Token)  
**Rôle requis :** `OWNER`

---

## 🧪 Comment Supprimer un Utilisateur

### Option 1 : Via Swagger UI

1. **Démarrer le serveur :**
   ```bash
   npm run start:dev
   ```

2. **Accéder à Swagger :**
   - Ouvrir : `http://localhost:3002/api`
   - Se connecter avec un compte `OWNER`

3. **Supprimer un utilisateur :**
   - Aller dans la section **"Users"**
   - Trouver l'endpoint `DELETE /api/v1/users/{id}`
   - Cliquer sur **"Try it out"**
   - Entrer l'ID de l'utilisateur à supprimer
   - Cliquer sur **"Execute"**

### Option 2 : Via cURL

```bash
curl -X DELETE \
  'http://localhost:3002/api/v1/users/ID_UTILISATEUR' \
  -H 'Authorization: Bearer VOTRE_TOKEN_JWT'
```

### Option 3 : Via Postman / Insomnia

1. **Méthode :** DELETE
2. **URL :** `http://localhost:3002/api/v1/users/ID_UTILISATEUR`
3. **Headers :**
   - `Authorization: Bearer VOTRE_TOKEN_JWT`
4. **Envoyer la requête**

---

## 📝 Réponses

### ✅ Succès (200)
```json
{
  "message": "Utilisateur 507f1f77bcf86cd799439011 supprimé avec succès",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "prenom": "John",
    "nom": "Doe",
    ...
  }
}
```

### ❌ Erreur 403 - Accès Refusé
```json
{
  "statusCode": 403,
  "message": "Required roles: OWNER"
}
```
**Cause :** Vous n'avez pas le rôle `OWNER`

### ❌ Erreur 404 - Utilisateur Introuvable
```json
{
  "statusCode": 404,
  "message": "Utilisateur avec l'ID 507f1f77bcf86cd799439011 introuvable"
}
```
**Cause :** L'ID de l'utilisateur n'existe pas dans la base de données

### ❌ Erreur 401 - Non Authentifié
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Cause :** Token JWT manquant ou invalide

---

## 🔍 Trouver l'ID d'un Utilisateur

### Option 1 : Via Swagger
1. Aller à `GET /api/v1/users` (liste tous les utilisateurs)
2. Trouver l'utilisateur dans la liste
3. Copier son `_id`

### Option 2 : Via MongoDB
```javascript
use dam_backend
db.users.find({ email: "user@example.com" })
```

### Option 3 : Via l'endpoint GET
```
GET /api/v1/users/:id
```

---

## ⚠️ Important

### ⚠️ Suppression Définitive
- La suppression est **définitive** et **irréversible**
- L'utilisateur sera complètement supprimé de la base de données
- Toutes ses données seront perdues

### ⚠️ Pas de Suppression de Soi-Même
- Un `OWNER` peut supprimer n'importe quel utilisateur
- Il n'y a pas de protection contre l'auto-suppression
- **Faites attention** à ne pas supprimer votre propre compte !

### ⚠️ Relations avec d'Autres Collections
- Si l'utilisateur a des relations avec d'autres collections (réservations, matchs, etc.)
- Ces relations peuvent devenir **orphelines**
- Considérez une **suppression en cascade** si nécessaire

---

## 🛠️ Améliorations Possibles

### 1. Suppression en Cascade
Si l'utilisateur a des relations avec d'autres collections, vous pourriez vouloir :
- Supprimer toutes ses réservations
- Supprimer tous ses matchs
- Supprimer tous ses commentaires
- etc.

### 2. Suppression Douce (Soft Delete)
Au lieu de supprimer définitivement, vous pourriez :
- Ajouter un champ `deletedAt: Date`
- Marquer l'utilisateur comme supprimé
- Filtrer les utilisateurs supprimés dans les requêtes

### 3. Protection contre l'Auto-Suppression
Empêcher un utilisateur de supprimer son propre compte :
```typescript
async remove(id: string, @Req() req) {
  const currentUser = req.user;
  if (currentUser.userId === id) {
    throw new ForbiddenException('Vous ne pouvez pas supprimer votre propre compte');
  }
  // ... reste du code
}
```

### 4. Email de Notification
Envoyer un email à l'utilisateur avant/après suppression :
```typescript
async remove(id: string) {
  const user = await this.usermodel.findById(id).exec();
  if (!user) {
    throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
  }
  
  // Envoyer un email de notification
  await this.mailService.sendAccountDeletionEmail(user.email);
  
  // Supprimer l'utilisateur
  await this.usermodel.findByIdAndDelete(id).exec();
  
  return { message: `Utilisateur ${id} supprimé avec succès` };
}
```

---

## 📊 Exemple Complet

### Étape 1 : Se Connecter en tant qu'OWNER
```bash
POST /api/v1/auth/login
{
  "email": "owner@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Étape 2 : Lister les Utilisateurs
```bash
GET /api/v1/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Réponse :**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user1@example.com",
    "prenom": "John",
    "nom": "Doe",
    "role": "JOUEUR"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "email": "user2@example.com",
    "prenom": "Jane",
    "nom": "Smith",
    "role": "JOUEUR"
  }
]
```

### Étape 3 : Supprimer un Utilisateur
```bash
DELETE /api/v1/users/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Réponse :**
```json
{
  "message": "Utilisateur 507f1f77bcf86cd799439011 supprimé avec succès",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user1@example.com",
    ...
  }
}
```

---

## ✅ Checklist

- [ ] Vous êtes connecté avec un compte `OWNER`
- [ ] Vous avez le token JWT valide
- [ ] Vous connaissez l'ID de l'utilisateur à supprimer
- [ ] Vous êtes sûr de vouloir supprimer cet utilisateur (action irréversible)
- [ ] Vous avez vérifié les relations avec d'autres collections

---

## 🆘 Dépannage

### Erreur : "Required roles: OWNER"
**Solution :** Connectez-vous avec un compte ayant le rôle `OWNER`

### Erreur : "Utilisateur introuvable"
**Solution :** Vérifiez que l'ID de l'utilisateur est correct

### Erreur : "Unauthorized"
**Solution :** Vérifiez que votre token JWT est valide et inclus dans les headers

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs du serveur
2. Vérifiez que MongoDB est démarré
3. Vérifiez que le serveur NestJS est démarré
4. Vérifiez vos permissions (rôle OWNER)

