# 🔧 Fix : Error 400: redirect_uri_mismatch

## ❌ Problème

Vous obtenez l'erreur :
```
Error 400: redirect_uri_mismatch
Access blocked: This app's request is invalid
```

## 🎯 Cause

L'URL de redirection utilisée par votre application ne correspond **pas exactement** à celle configurée dans Google Cloud Console.

---

## ✅ Solution : Corriger dans Google Cloud Console

### **Étape 1 : Aller sur Google Cloud Console**

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Connectez-vous avec votre compte Google
3. Sélectionnez votre projet

### **Étape 2 : Ouvrir votre OAuth 2.0 Client ID**

1. Dans le menu latéral, allez dans **"APIs & Services"** → **"Credentials"**
2. Trouvez votre **OAuth 2.0 Client ID** (celui que vous utilisez pour l'application)
3. Cliquez sur l'icône **✏️ (Modifier)** à droite

### **Étape 3 : Ajouter l'URL de redirection correcte**

Dans la section **"URI de redirection autorisées"**, vous devez ajouter **exactement** :

#### **Pour Production (Render) :**
```
https://peakplay-14.onrender.com/api/v1/auth/google/redirect
```

#### **Pour Local (Développement) :**
```
http://localhost:3001/api/v1/auth/google/redirect
```

#### **Important :**
- ✅ L'URL doit être **exactement** la même (pas d'espace, pas de slash final)
- ✅ Utilisez `https://` pour la production, `http://` pour le local
- ✅ Vous pouvez ajouter **plusieurs URLs** (une pour production, une pour local)

### **Étape 4 : Sauvegarder**

1. Cliquez sur **"ENREGISTRER"** ou **"SAVE"**
2. Attendez quelques secondes pour que les changements soient pris en compte

---

## 🔍 Vérifier l'URL Utilisée par Votre Application

### **Comment l'URL est construite :**

D'après le code dans `google.strategy.ts` :

```typescript
// Si GOOGLE_CALLBACK_URL est défini, il l'utilise
// Sinon, il construit : BACKEND_URL + /api/v1/auth/google/redirect
const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
const cleanBackendUrl = backendUrl.replace(/\/$/, ''); // Supprime le slash final
const defaultCallbackURL = `${cleanBackendUrl}/api/v1/auth/google/redirect`;
const callbackURL = process.env.GOOGLE_CALLBACK_URL || defaultCallbackURL;
```

### **Vérifier dans Render :**

1. Allez sur votre dashboard Render
2. Ouvrez votre service backend
3. Allez dans **"Environment"**
4. Vérifiez que `BACKEND_URL` est défini :
   ```
   BACKEND_URL=https://peakplay-14.onrender.com
   ```
   ⚠️ **IMPORTANT :** Pas de slash final (`/`) à la fin !

5. **Optionnel :** Vous pouvez aussi définir directement :
   ```
   GOOGLE_CALLBACK_URL=https://peakplay-14.onrender.com/api/v1/auth/google/redirect
   ```

---

## 📋 Checklist de Vérification

### **Dans Google Cloud Console :**

- [ ] L'URL de redirection est **exactement** :
  ```
  https://peakplay-14.onrender.com/api/v1/auth/google/redirect
  ```
- [ ] Pas d'espace avant ou après
- [ ] Pas de slash final (`/`)
- [ ] Utilise `https://` (pas `http://`) pour la production
- [ ] Les modifications sont sauvegardées

### **Dans Render (Variables d'environnement) :**

- [ ] `BACKEND_URL=https://peakplay-14.onrender.com` (sans slash final)
- [ ] `GOOGLE_CLIENT_ID` est défini
- [ ] `GOOGLE_CLIENT_SECRET` est défini
- [ ] L'application a été redéployée après modification des variables

---

## 🧪 Test Après Correction

1. **Attendez 1-2 minutes** après avoir sauvegardé dans Google Cloud Console
2. **Redéployez votre application** sur Render (si vous avez modifié les variables d'environnement)
3. **Testez à nouveau** :
   ```
   https://peakplay-14.onrender.com/api/v1/auth/google
   ```

**Résultat attendu :**
- ✅ Redirection vers Google
- ✅ Page de connexion Google
- ✅ Après connexion, redirection vers votre backend
- ✅ Pas d'erreur `redirect_uri_mismatch`

---

## 🔄 URLs à Ajouter dans Google Cloud Console

### **Pour Développement + Production :**

Ajoutez **les deux URLs** dans "URI de redirection autorisées" :

```
http://localhost:3001/api/v1/auth/google/redirect
https://peakplay-14.onrender.com/api/v1/auth/google/redirect
```

Cela vous permettra de tester en local ET en production.

---

## 🐛 Dépannage Avancé

### **Problème : L'erreur persiste après correction**

**Solutions :**

1. **Vérifier que l'URL est exactement la même :**
   - Copiez l'URL depuis Google Cloud Console
   - Collez-la dans un éditeur de texte
   - Comparez caractère par caractère avec celle utilisée par l'app

2. **Vider le cache du navigateur :**
   - Les erreurs OAuth peuvent être mises en cache
   - Essayez en navigation privée

3. **Vérifier les logs du backend :**
   - Regardez les logs pour voir quelle URL est utilisée
   - Comparez avec celle dans Google Cloud Console

4. **Vérifier que vous utilisez le bon Client ID :**
   - Assurez-vous que `GOOGLE_CLIENT_ID` dans Render correspond à celui dans Google Cloud Console

---

## 📝 Exemple de Configuration Complète

### **Dans Render (Environment Variables) :**

```env
BACKEND_URL=https://peakplay-14.onrender.com
GOOGLE_CLIENT_ID=votre-client-id-google
GOOGLE_CLIENT_SECRET=votre-client-secret-google
```

### **Dans Google Cloud Console (URI de redirection autorisées) :**

```
https://peakplay-14.onrender.com/api/v1/auth/google/redirect
http://localhost:3001/api/v1/auth/google/redirect
```

---

## ✅ Résultat Attendu

Après correction :
- ✅ Plus d'erreur `redirect_uri_mismatch`
- ✅ Redirection vers Google fonctionne
- ✅ Connexion Google réussie
- ✅ Redirection vers le backend après authentification

---

## 🎯 Résumé Rapide

1. **Aller sur** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. **Ouvrir** votre OAuth 2.0 Client ID
3. **Ajouter** dans "URI de redirection autorisées" :
   ```
   https://peakplay-14.onrender.com/api/v1/auth/google/redirect
   ```
4. **Sauvegarder**
5. **Attendre 1-2 minutes**
6. **Tester à nouveau**

**C'est tout !** 🎉

