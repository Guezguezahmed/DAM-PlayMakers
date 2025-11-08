# 🧪 Guide de Test - Vérification Email OAuth

Ce guide vous explique comment tester le système d'envoi d'email de vérification après authentification Google/Facebook.

## 📋 Prérequis

1. ✅ Application démarrée (`npm run start` ou `npm run start:dev`)
2. ✅ Configuration SMTP dans le fichier `.env`
3. ✅ Credentials Google/Facebook configurés (optionnel pour tester)

---

## 🎯 Test 1 : Configuration SMTP

### Étape 1 : Vérifier la configuration

Vérifiez que votre fichier `.env` contient :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_application
APP_NAME=DAM Backend
FRONTEND_URL=http://localhost:3000
```

### Étape 2 : Tester la connexion SMTP

Démarrez l'application et vérifiez les logs :

```powershell
npm run start:dev
```

Si la configuration est correcte, vous ne verrez pas d'erreur au démarrage.

---

## 🎯 Test 2 : Authentification Google OAuth

### Étape 1 : Lancer l'authentification

1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:3002/api/v1/auth/google`
3. Connectez-vous avec votre compte Google
4. Autorisez l'application

### Étape 2 : Vérifier l'email

1. **Vérifiez votre boîte email** (y compris les spams)
2. Vous devriez recevoir un email avec :
   - Sujet : "Vérification de votre compte - DAM Backend"
   - Un bouton "Vérifier mon email"
   - Un lien de vérification

### Étape 3 : Vérifier les logs

Dans la console du serveur, vous devriez voir :
```
✅ Email de vérification envoyé à votre_email@gmail.com
```

---

## 🎯 Test 3 : Authentification Facebook OAuth

### Étape 1 : Lancer l'authentification

1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:3002/api/v1/auth/facebook`
3. Connectez-vous avec votre compte Facebook
4. Autorisez l'application

### Étape 2 : Vérifier l'email

Même processus que pour Google - vérifiez votre boîte email.

---

## 🎯 Test 4 : Vérification de l'email

### Méthode 1 : Via le lien dans l'email

1. Ouvrez l'email reçu
2. Cliquez sur le bouton "Vérifier mon email"
3. Vous serez redirigé vers : `http://localhost:3000/verify-email?token=...`
4. Le backend vérifie automatiquement le token

### Méthode 2 : Via l'API directement

1. **Copiez le token** depuis l'email (dans l'URL)
2. **Testez avec curl ou Postman** :

```bash
GET http://localhost:3002/api/v1/auth/verify-email?token=VOTRE_TOKEN_ICI
```

**Réponse attendue :**
```json
{
  "message": "Email vérifié avec succès !",
  "verified": true
}
```

### Méthode 3 : Via Swagger

1. Allez sur : `http://localhost:3002/api`
2. Trouvez la route `GET /api/v1/auth/verify-email`
3. Cliquez sur "Try it out"
4. Entrez le token dans le paramètre `token`
5. Cliquez sur "Execute"

---

## 🎯 Test 5 : Renvoyer l'email de vérification

### Via l'API

```bash
POST http://localhost:3002/api/v1/auth/resend-verification
Content-Type: application/json

{
  "email": "votre_email@gmail.com"
}
```

**Réponse attendue :**
```json
{
  "message": "Email de vérification renvoyé avec succès"
}
```

### Via Swagger

1. Allez sur : `http://localhost:3002/api`
2. Trouvez la route `POST /api/v1/auth/resend-verification`
3. Cliquez sur "Try it out"
4. Entrez votre email dans le body
5. Cliquez sur "Execute"

---

## 🎯 Test 6 : Vérifier dans la base de données

### Option 1 : Via MongoDB Compass

1. Connectez-vous à MongoDB
2. Ouvrez la collection `users`
3. Trouvez votre utilisateur par email
4. Vérifiez les champs :
   - `emailVerified` : devrait être `false` avant vérification, `true` après
   - `verificationToken` : devrait contenir le token
   - `verificationTokenExpires` : devrait être une date future (24h)

### Option 2 : Via l'API (si vous avez une route pour voir les utilisateurs)

---

## 🔍 Vérifications à faire

### ✅ Checklist de test

- [ ] Email reçu après authentification Google
- [ ] Email reçu après authentification Facebook
- [ ] Lien de vérification fonctionne
- [ ] Token vérifié avec succès
- [ ] `emailVerified` passe à `true` après vérification
- [ ] Renvoi d'email fonctionne
- [ ] Token expiré rejette correctement
- [ ] Email déjà vérifié ne peut pas être revérifié

---

## 🐛 Dépannage

### Problème : Email non reçu

**Solutions :**
1. Vérifiez les logs du serveur pour les erreurs
2. Vérifiez votre dossier spam
3. Vérifiez que SMTP_USER et SMTP_PASS sont corrects
4. Pour Gmail, utilisez un "Mot de passe d'application"

**Vérifier les logs :**
```powershell
# Dans la console du serveur, cherchez :
✅ Email de vérification envoyé à ...
# ou
❌ Erreur lors de l'envoi de l'email à ...
```

### Problème : Erreur SMTP

**Erreur typique :**
```
Error: Invalid login
```

**Solution :**
- Pour Gmail : Utilisez un "Mot de passe d'application", pas votre mot de passe normal
- Vérifiez que la validation en deux facteurs est activée

### Problème : Token invalide

**Erreur :**
```json
{
  "statusCode": 404,
  "message": "Token de vérification invalide ou expiré"
}
```

**Solutions :**
1. Le token a expiré (24h) → Utilisez `/resend-verification`
2. Le token est incorrect → Vérifiez que vous copiez le token complet
3. L'utilisateur n'existe pas → Vérifiez dans la base de données

---

## 📊 Test avec Postman/Thunder Client

### Collection de tests

1. **Authentification Google**
   ```
   GET http://localhost:3002/api/v1/auth/google
   ```

2. **Vérifier l'email**
   ```
   GET http://localhost:3002/api/v1/auth/verify-email?token=VOTRE_TOKEN
   ```

3. **Renvoyer l'email**
   ```
   POST http://localhost:3002/api/v1/auth/resend-verification
   Body: { "email": "votre_email@gmail.com" }
   ```

---

## 🎬 Scénario de test complet

### Scénario 1 : Nouvel utilisateur Google

```
1. Aller sur /api/v1/auth/google
2. Se connecter avec Google
3. ✅ Vérifier : Email reçu
4. Cliquer sur le lien de vérification
5. ✅ Vérifier : emailVerified = true dans la DB
6. ✅ Vérifier : Réponse API "Email vérifié avec succès"
```

### Scénario 2 : Utilisateur existant non vérifié

```
1. Utilisateur existe déjà mais emailVerified = false
2. Se connecter avec Google (même email)
3. ✅ Vérifier : Nouvel email de vérification envoyé
4. Vérifier l'email
5. ✅ Vérifier : emailVerified = true
```

### Scénario 3 : Renvoi d'email

```
1. Utilisateur non vérifié
2. POST /resend-verification avec son email
3. ✅ Vérifier : Nouvel email reçu
4. ✅ Vérifier : Nouveau token généré
```

---

## 💡 Astuces de test

### Test rapide sans OAuth

Si vous voulez tester juste l'envoi d'email sans OAuth :

1. Créez un utilisateur manuellement dans la DB avec :
   - `emailVerified: false`
   - `provider: 'google'` ou `'facebook'`
   - `verificationToken: 'test-token'`

2. Appelez directement :
   ```bash
   POST /api/v1/auth/resend-verification
   { "email": "test@example.com" }
   ```

### Test avec Mailtrap (Développement)

Pour tester sans utiliser un vrai compte email :

1. Créez un compte sur [Mailtrap](https://mailtrap.io)
2. Configurez dans `.env` :
   ```env
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=votre_user_mailtrap
   SMTP_PASS=votre_pass_mailtrap
   ```
3. Les emails seront capturés dans Mailtrap (pas envoyés réellement)

---

## ✅ Résultat attendu

Après tous les tests, vous devriez avoir :

1. ✅ Emails reçus après chaque authentification OAuth
2. ✅ Emails vérifiables via le lien
3. ✅ Statut `emailVerified` mis à jour dans la DB
4. ✅ Possibilité de renvoyer les emails
5. ✅ Gestion correcte des tokens expirés

---

Besoin d'aide ? Consultez aussi `GUIDE_EMAIL.md` pour la configuration SMTP.

