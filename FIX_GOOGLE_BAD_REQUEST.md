# 🔧 Fix : Error 400: bad_request (Google OAuth)

## ❌ Problème

Vous obtenez l'erreur :
```
Error 400: bad_request
Access blocked: Authorization Error
```

## 🎯 Causes Possibles

L'erreur `bad_request` peut avoir plusieurs causes :

1. **URL de redirection malformée** (le plus probable d'après l'URL dans l'erreur)
2. **Client ID ou Secret incorrect**
3. **Scopes invalides**
4. **URL de redirection non autorisée** (mais on aurait `redirect_uri_mismatch` dans ce cas)

---

## 🔍 Diagnostic

### **Problème Identifié dans l'URL**

D'après l'URL de l'erreur, je vois :
```
https://peakplay-16.onrender.com/api/v1/auth/google/redirect%3D%3D
```

Le `%3D%3D` à la fin est l'encodage URL de `==`, ce qui suggère que l'URL de redirection est **malformée**.

**Causes possibles :**
- `BACKEND_URL` contient des caractères supplémentaires
- L'URL est mal encodée
- Il y a un problème avec la construction de l'URL

---

## ✅ Solutions

### **Solution 1 : Vérifier BACKEND_URL dans Render**

1. Allez sur [Render Dashboard](https://dashboard.render.com)
2. Ouvrez votre service backend
3. Allez dans **"Environment"**
4. Vérifiez `BACKEND_URL` :

**✅ Correct :**
```
BACKEND_URL=https://peakplay-16.onrender.com
```

**❌ Incorrect :**
```
BACKEND_URL=https://peakplay-16.onrender.com/
BACKEND_URL=https://peakplay-16.onrender.com==
BACKEND_URL="https://peakplay-16.onrender.com"
```

**Points importants :**
- Pas de slash final (`/`)
- Pas de guillemets (`"`)
- Pas de caractères supplémentaires (`==`, etc.)
- Utilise `https://` (pas `http://`)

### **Solution 2 : Vérifier les Logs du Backend**

Après redéploiement, vérifiez les logs dans Render :

Vous devriez voir :
```
🔧 [GOOGLE_STRATEGY] Configuration OAuth Google:
   → BACKEND_URL: https://peakplay-16.onrender.com
   → URL nettoyée: https://peakplay-16.onrender.com
   → Callback URL utilisée: https://peakplay-16.onrender.com/api/v1/auth/google/redirect
```

**Si vous voyez des caractères étranges** (comme `==`, `%3D%3D`, etc.), c'est que `BACKEND_URL` est mal configuré.

### **Solution 3 : Utiliser GOOGLE_CALLBACK_URL Directement**

Si le problème persiste, définissez directement `GOOGLE_CALLBACK_URL` dans Render :

1. Allez dans Render → Environment
2. Ajoutez une nouvelle variable :
   ```
   GOOGLE_CALLBACK_URL=https://peakplay-16.onrender.com/api/v1/auth/google/redirect
   ```
3. Redéployez l'application

Cela bypassera la construction automatique depuis `BACKEND_URL`.

### **Solution 4 : Vérifier dans Google Cloud Console**

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Ouvrez votre OAuth 2.0 Client ID
3. Vérifiez que l'URL de redirection est **exactement** :
   ```
   https://peakplay-16.onrender.com/api/v1/auth/google/redirect
   ```
4. **Pas de caractères supplémentaires** (`==`, `%3D%3D`, etc.)

---

## 🔍 Vérifications Détaillées

### **1. Vérifier BACKEND_URL**

Dans Render Dashboard → Environment, `BACKEND_URL` doit être :

```env
BACKEND_URL=https://peakplay-16.onrender.com
```

**Vérifications :**
- [ ] Pas de slash final
- [ ] Pas de guillemets
- [ ] Pas de caractères étranges
- [ ] Utilise `https://`
- [ ] Correspond à votre vrai service Render

### **2. Vérifier les Logs**

Dans Render Dashboard → Logs, cherchez :

```
🔧 [GOOGLE_STRATEGY] Configuration OAuth Google:
   → Callback URL utilisée: ...
```

**L'URL affichée doit être :**
```
https://peakplay-16.onrender.com/api/v1/auth/google/redirect
```

**Si vous voyez autre chose** (comme `...redirect==` ou `...redirect%3D%3D`), c'est le problème.

### **3. Vérifier Google Cloud Console**

Dans Google Cloud Console → OAuth 2.0 Client ID → URI de redirection autorisées :

**Doit être exactement :**
```
https://peakplay-16.onrender.com/api/v1/auth/google/redirect
```

**Pas :**
- `https://peakplay-16.onrender.com/api/v1/auth/google/redirect==`
- `https://peakplay-16.onrender.com/api/v1/auth/google/redirect%3D%3D`
- `https://peakplay-16.onrender.com/api/v1/auth/google/redirect/`

---

## 🛠️ Actions Correctives

### **Étape 1 : Corriger BACKEND_URL dans Render**

1. Allez sur Render Dashboard
2. Ouvrez votre service
3. Allez dans "Environment"
4. Trouvez `BACKEND_URL`
5. Modifiez pour avoir **exactement** :
   ```
   https://peakplay-16.onrender.com
   ```
6. Sauvegardez

### **Étape 2 : Redéployer**

1. Dans Render, cliquez sur "Manual Deploy" → "Deploy latest commit"
2. Attendez que le déploiement soit terminé

### **Étape 3 : Vérifier les Logs**

1. Allez dans "Logs"
2. Cherchez les logs de démarrage
3. Vérifiez que l'URL de callback est correcte

### **Étape 4 : Vérifier Google Cloud Console**

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Ouvrez votre OAuth 2.0 Client ID
3. Vérifiez que l'URL de redirection est correcte
4. Sauvegardez si nécessaire

### **Étape 5 : Tester**

1. Testez à nouveau :
   ```
   https://peakplay-16.onrender.com/api/v1/auth/google
   ```
2. Vérifiez qu'il n'y a plus d'erreur

---

## 📋 Checklist de Vérification

- [ ] `BACKEND_URL` dans Render est correct (pas de slash final, pas de guillemets)
- [ ] Les logs montrent une URL de callback correcte
- [ ] L'URL dans Google Cloud Console correspond exactement
- [ ] Application redéployée après modification
- [ ] Test effectué et fonctionne

---

## 🐛 Dépannage Avancé

### **Si le problème persiste :**

1. **Utilisez GOOGLE_CALLBACK_URL directement** :
   ```env
   GOOGLE_CALLBACK_URL=https://peakplay-16.onrender.com/api/v1/auth/google/redirect
   ```
   Cela bypassera la construction automatique.

2. **Vérifiez les caractères invisibles** :
   - Copiez `BACKEND_URL` dans un éditeur de texte
   - Vérifiez qu'il n'y a pas d'espaces ou de caractères invisibles

3. **Vérifiez le nom du service Render** :
   - Assurez-vous que `peakplay-16.onrender.com` est bien votre service
   - Si vous avez changé de service, mettez à jour `BACKEND_URL`

---

## ✅ Résultat Attendu

Après correction :
- ✅ Plus d'erreur `bad_request`
- ✅ Redirection vers Google fonctionne
- ✅ Connexion Google réussie
- ✅ URL de callback correcte dans les logs

---

## 🎯 Résumé Rapide

1. **Vérifier** `BACKEND_URL` dans Render (pas de slash final, pas de guillemets)
2. **Vérifier** les logs pour voir l'URL utilisée
3. **Vérifier** Google Cloud Console
4. **Redéployer** l'application
5. **Tester** à nouveau

**Le problème vient probablement de `BACKEND_URL` mal configuré dans Render !**

