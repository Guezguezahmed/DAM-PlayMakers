# Guide étape par étape : Configuration OAuth Google et Facebook

Ce guide vous accompagne pas à pas pour obtenir et configurer les credentials OAuth nécessaires.

## 📋 Table des matières

1. [Configuration Google OAuth2](#1-configuration-google-oauth2)
2. [Configuration Facebook OAuth2](#2-configuration-facebook-oauth2)
3. [Configuration du fichier .env](#3-configuration-du-fichier-env)
4. [Test de l'authentification](#4-test-de-lauthentification)

---

## 1. Configuration Google OAuth2

### Étape 1.1 : Accéder à Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google

### Étape 1.2 : Créer ou sélectionner un projet

1. En haut de la page, cliquez sur le sélecteur de projet
2. Cliquez sur **"NOUVEAU PROJET"**
3. Donnez un nom à votre projet (ex: "DAM Backend OAuth")
4. Cliquez sur **"CRÉER"**
5. Attendez quelques secondes, puis sélectionnez votre nouveau projet

### Étape 1.3 : Activer l'API Google+

1. Dans le menu latéral, allez dans **"APIs & Services"** → **"Library"**
2. Dans la barre de recherche, tapez **"Google+ API"** ou **"Google Identity"**
3. Cliquez sur **"Google+ API"** ou **"Google Identity API"**
4. Cliquez sur **"ENABLE"** (Activer)

### Étape 1.4 : Configurer l'écran de consentement OAuth

1. Allez dans **"APIs & Services"** → **"OAuth consent screen"**
2. Sélectionnez **"External"** (pour le développement) ou **"Internal"** (si vous avez Google Workspace)
3. Cliquez sur **"CREATE"**
4. Remplissez les informations :
   - **App name** : "DAM Backend" (ou le nom de votre choix)
   - **User support email** : Votre email
   - **Developer contact information** : Votre email
5. Cliquez sur **"SAVE AND CONTINUE"**
6. Sur la page "Scopes", cliquez sur **"SAVE AND CONTINUE"** (pas besoin d'ajouter de scopes pour l'instant)
7. Sur la page "Test users", cliquez sur **"SAVE AND CONTINUE"**
8. Sur la page "Summary", cliquez sur **"BACK TO DASHBOARD"**

### Étape 1.5 : Créer les identifiants OAuth 2.0

1. Allez dans **"APIs & Services"** → **"Credentials"**
2. En haut de la page, cliquez sur **"+ CREATE CREDENTIALS"**
3. Sélectionnez **"OAuth client ID"**
4. Si c'est la première fois, sélectionnez **"Web application"** comme type d'application
5. Donnez un nom à votre client (ex: "DAM Backend Client")
6. Dans **"Authorized redirect URIs"**, cliquez sur **"+ ADD URI"**
7. Ajoutez cette URL exacte :
   ```
   http://localhost:3002/api/v1/auth/google/redirect
   ```
8. Cliquez sur **"CREATE"**
9. **IMPORTANT** : Une popup s'affiche avec vos credentials :
   - **Your Client ID** : Copiez cette valeur (c'est votre `GOOGLE_CLIENT_ID`)
   - **Your Client Secret** : Copiez cette valeur (c'est votre `GOOGLE_CLIENT_SECRET`)
   - ⚠️ **Notez-les immédiatement**, vous ne pourrez plus voir le secret après !

### Étape 1.6 : Copier les credentials dans le fichier .env

1. Ouvrez le fichier `.env` à la racine du projet
2. Remplacez :
   ```
   GOOGLE_CLIENT_ID=ton_client_id_google
   GOOGLE_CLIENT_SECRET=ton_secret_google
   ```
   Par :
   ```
   GOOGLE_CLIENT_ID=votre_vrai_client_id_ici
   GOOGLE_CLIENT_SECRET=votre_vrai_client_secret_ici
   ```
3. Sauvegardez le fichier

---

## 2. Configuration Facebook OAuth2

### Étape 2.1 : Accéder à Facebook Developers

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Connectez-vous avec votre compte Facebook

### Étape 2.2 : Créer une nouvelle application

1. Cliquez sur **"My Apps"** en haut à droite
2. Cliquez sur **"Create App"**
3. Sélectionnez **"Consumer"** ou **"Other"** comme type d'application
4. Cliquez sur **"Next"**
5. Remplissez les informations :
   - **App Display Name** : "DAM Backend" (ou le nom de votre choix)
   - **App Contact Email** : Votre email
6. Cliquez sur **"Create App"**
7. Complétez le captcha de sécurité si demandé

### Étape 2.3 : Ajouter le produit Facebook Login

1. Dans le tableau de bord de votre application, trouvez **"Facebook Login"**
2. Cliquez sur **"Set Up"** ou **"Get Started"**
3. Sélectionnez **"Web"** comme plateforme
4. Vous serez redirigé vers la configuration

### Étape 2.4 : Configurer les URLs de redirection

1. Dans le menu latéral, allez dans **"Facebook Login"** → **"Settings"**
2. Dans la section **"Valid OAuth Redirect URIs"**, cliquez sur **"Add URI"**
3. Ajoutez cette URL exacte :
   ```
   http://localhost:3002/api/v1/auth/facebook/redirect
   ```
4. Activez **"Use Strict Mode for Redirect URIs"** (recommandé)
5. Cliquez sur **"Save Changes"**

### Étape 2.5 : Obtenir l'ID et le Secret de l'application

1. Dans le menu latéral, allez dans **"Settings"** → **"Basic"**
2. Vous verrez :
   - **App ID** : C'est votre `FACEBOOK_APP_ID`
   - **App Secret** : Cliquez sur **"Show"** pour le révéler (c'est votre `FACEBOOK_APP_SECRET`)
   - ⚠️ **Notez-les immédiatement**

### Étape 2.6 : Configurer les permissions (optionnel mais recommandé)

1. Dans **"Facebook Login"** → **"Settings"**
2. Assurez-vous que les permissions suivantes sont activées :
   - `email` (pour obtenir l'email de l'utilisateur)
   - `public_profile` (pour obtenir le nom et la photo)

### Étape 2.7 : Copier les credentials dans le fichier .env

1. Ouvrez le fichier `.env` à la racine du projet
2. Remplacez :
   ```
   FACEBOOK_APP_ID=ton_app_id_facebook
   FACEBOOK_APP_SECRET=ton_app_secret_facebook
   ```
   Par :
   ```
   FACEBOOK_APP_ID=votre_vrai_app_id_ici
   FACEBOOK_APP_SECRET=votre_vrai_app_secret_ici
   ```
3. Sauvegardez le fichier

---

## 3. Configuration du fichier .env

Votre fichier `.env` devrait maintenant ressembler à ceci :

```env
# Application Configuration
NODE_ENV=development
PORT=3002
MONGODB_URI=mongodb://localhost:27017/dam_backend

# JWT Configuration
JWT_SECRET=default_jwt_secret_key_1234567890

# Frontend URL (optional)
FRONTEND_URL=http://localhost:3000

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=votre_vrai_client_id_google
GOOGLE_CLIENT_SECRET=votre_vrai_client_secret_google
GOOGLE_CALLBACK_URL=http://localhost:3002/api/v1/auth/google/redirect

# Facebook OAuth2 Configuration
FACEBOOK_APP_ID=votre_vrai_app_id_facebook
FACEBOOK_APP_SECRET=votre_vrai_app_secret_facebook
FACEBOOK_CALLBACK_URL=http://localhost:3002/api/v1/auth/facebook/redirect
```

⚠️ **Important** : Remplacez toutes les valeurs `votre_vrai_...` par vos vraies credentials !

---

## 4. Test de l'authentification

### Étape 4.1 : Redémarrer l'application

1. Arrêtez l'application si elle est en cours d'exécution
2. Redémarrez-la :
   ```powershell
   npm run start
   ```
   ou en mode développement :
   ```powershell
   npm run start:dev
   ```

### Étape 4.2 : Tester Google OAuth

1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:3002/api/v1/auth/google`
3. Vous devriez être redirigé vers la page de connexion Google
4. Connectez-vous avec votre compte Google
5. Autorisez l'application à accéder à vos informations
6. Vous serez redirigé vers le callback et un token JWT sera généré

### Étape 4.3 : Tester Facebook OAuth

1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:3002/api/v1/auth/facebook`
3. Vous devriez être redirigé vers la page de connexion Facebook
4. Connectez-vous avec votre compte Facebook
5. Autorisez l'application à accéder à vos informations
6. Vous serez redirigé vers le callback et un token JWT sera généré

---

## 🔧 Dépannage

### Erreur : "Google OAuth2 is not configured"

- Vérifiez que `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont bien remplis dans le `.env`
- Vérifiez qu'il n'y a pas d'espaces avant ou après les valeurs
- Redémarrez l'application après avoir modifié le `.env`

### Erreur : "redirect_uri_mismatch" (Google)

- Vérifiez que l'URL de redirection dans Google Cloud Console correspond exactement à :
  `http://localhost:3002/api/v1/auth/google/redirect`
- Assurez-vous qu'il n'y a pas d'espaces ou de caractères supplémentaires

### Erreur : "Invalid OAuth redirect URI" (Facebook)

- Vérifiez que l'URL de redirection dans Facebook Developers correspond exactement à :
  `http://localhost:3002/api/v1/auth/facebook/redirect`
- Assurez-vous que "Use Strict Mode" est activé

### L'application ne trouve pas l'email

- Vérifiez que les scopes `email` et `profile` sont bien configurés
- Pour Facebook, assurez-vous que la permission `email` est demandée

---

## 📝 Notes importantes

1. **En développement** : Les URLs de callback utilisent `http://localhost:3002`
2. **En production** : Vous devrez utiliser `https://votre-domaine.com/api/v1/auth/.../redirect`
3. **Sécurité** : Ne partagez jamais vos secrets OAuth publiquement
4. **JWT_SECRET** : Changez la valeur par défaut en production pour une clé sécurisée

---

## ✅ Checklist finale

- [ ] Google OAuth2 configuré dans Google Cloud Console
- [ ] Facebook OAuth2 configuré dans Facebook Developers
- [ ] Credentials copiés dans le fichier `.env`
- [ ] URLs de redirection configurées correctement
- [ ] Application redémarrée
- [ ] Test Google OAuth réussi
- [ ] Test Facebook OAuth réussi

---

Besoin d'aide ? Consultez aussi le fichier `ENV_SETUP.md` pour plus de détails.

