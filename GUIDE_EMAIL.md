# 📧 Guide de Configuration Email pour la Vérification

Ce guide explique comment configurer l'envoi d'emails de vérification après authentification Google/Facebook.

## 📋 Fonctionnalités

- ✅ Envoi automatique d'email de vérification après authentification OAuth (Google/Facebook)
- ✅ Token de vérification valide 24 heures
- ✅ Route pour vérifier l'email : `GET /api/v1/auth/verify-email?token=...`
- ✅ Route pour renvoyer l'email : `POST /api/v1/auth/resend-verification`

## 🔧 Configuration SMTP

### Option 1 : Gmail (Recommandé pour le développement)

1. **Activer l'authentification à deux facteurs** sur votre compte Gmail
2. **Générer un mot de passe d'application** :
   - Allez sur [Google Account Security](https://myaccount.google.com/security)
   - Activez "Validation en deux étapes" si ce n'est pas déjà fait
   - Allez dans "Mots de passe des applications"
   - Créez un nouveau mot de passe d'application
   - **Copiez ce mot de passe** (vous ne pourrez plus le voir)

3. **Configuration dans `.env`** :
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_application
APP_NAME=DAM Backend
```

### Option 2 : Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=votre_email@outlook.com
SMTP_PASS=votre_mot_de_passe
APP_NAME=DAM Backend
```

### Option 3 : Autre serveur SMTP

```env
SMTP_HOST=votre_serveur_smtp.com
SMTP_PORT=587
SMTP_USER=votre_email@domaine.com
SMTP_PASS=votre_mot_de_passe
APP_NAME=DAM Backend
```

## 📝 Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_application
APP_NAME=DAM Backend
```

## 🔄 Flux de Vérification

### 1. Authentification OAuth

```
1. Utilisateur se connecte avec Google/Facebook
2. Compte créé ou trouvé dans la base de données
3. Token de vérification généré (valide 24h)
4. Email de vérification envoyé automatiquement
5. Utilisateur reçoit l'email avec le lien de vérification
```

### 2. Vérification de l'email

```
1. Utilisateur clique sur le lien dans l'email
2. Redirection vers : /api/v1/auth/verify-email?token=...
3. Backend vérifie le token
4. Email marqué comme vérifié
5. Utilisateur peut maintenant utiliser toutes les fonctionnalités
```

## 🛠️ Routes API

### Vérifier l'email
```http
GET /api/v1/auth/verify-email?token=abc123...
```

**Réponse :**
```json
{
  "message": "Email vérifié avec succès !",
  "verified": true
}
```

### Renvoyer l'email de vérification
```http
POST /api/v1/auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Réponse :**
```json
{
  "message": "Email de vérification renvoyé avec succès"
}
```

## ⚠️ Notes Importantes

1. **Gmail** : Vous devez utiliser un "Mot de passe d'application", pas votre mot de passe normal
2. **Sécurité** : Ne commitez jamais vos credentials SMTP dans le code
3. **Production** : Utilisez un service d'email professionnel (SendGrid, Mailgun, etc.)
4. **Expiration** : Les tokens de vérification expirent après 24 heures
5. **Erreurs** : Si l'envoi d'email échoue, l'authentification continue (l'email est envoyé en arrière-plan)

## 🧪 Test en Développement

Pour tester sans configurer SMTP, vous pouvez utiliser un service comme :
- **Mailtrap** : https://mailtrap.io (gratuit pour le développement)
- **Ethereal Email** : Génère des emails de test automatiquement

## 📚 Exemple d'Email Envoyé

L'email contient :
- Un message de bienvenue personnalisé
- Un bouton pour vérifier l'email
- Un lien de vérification (valide 24h)
- Des instructions claires

## 🔍 Dépannage

### L'email n'est pas envoyé
- Vérifiez les logs du serveur
- Vérifiez que SMTP_USER et SMTP_PASS sont corrects
- Pour Gmail, assurez-vous d'utiliser un "Mot de passe d'application"

### Token invalide
- Les tokens expirent après 24 heures
- Utilisez `/resend-verification` pour obtenir un nouveau token

### Erreur SMTP
- Vérifiez que le port est correct (587 pour TLS, 465 pour SSL)
- Vérifiez que votre firewall/autorise les connexions SMTP

