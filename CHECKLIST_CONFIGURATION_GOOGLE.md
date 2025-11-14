# ✅ Checklist : Configuration Google OAuth

## 📋 Vérification Complète

### ✅ 1. Code (Déjà Fait)

- [x] **Logs ajoutés** dans `google.strategy.ts` pour afficher l'URL utilisée
- [x] **Code fonctionnel** : Le code construit automatiquement l'URL depuis `BACKEND_URL`
- [x] **Gestion d'erreur** : Le guard vérifie que les credentials sont configurés

**Status :** ✅ **TERMINÉ**

---

### ⚠️ 2. Variables d'Environnement dans Render

**À vérifier dans votre dashboard Render :**

Allez sur : [Render Dashboard](https://dashboard.render.com) → Votre service → "Environment"

#### Variables Requises :

- [ ] **`GOOGLE_CLIENT_ID`**
  - Format : `xxxxx.apps.googleusercontent.com`
  - Où l'obtenir : [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

- [ ] **`GOOGLE_CLIENT_SECRET`**
  - Format : `GOCSPX-xxxxx`
  - Où l'obtenir : [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

- [ ] **`BACKEND_URL`**
  - Format : `https://peakplay-14.onrender.com`
  - ⚠️ **IMPORTANT :** Pas de slash final (`/`) !
  - ✅ Correct : `https://peakplay-14.onrender.com`
  - ❌ Incorrect : `https://peakplay-14.onrender.com/`

- [ ] **`GOOGLE_CALLBACK_URL`** (Optionnel)
  - Si défini, doit être : `https://peakplay-14.onrender.com/api/v1/auth/google/redirect`
  - Si non défini, sera construit automatiquement depuis `BACKEND_URL`

**Comment vérifier :**
1. Allez sur Render Dashboard
2. Ouvrez votre service backend
3. Cliquez sur "Environment"
4. Vérifiez que toutes les variables sont présentes

---

### ⚠️ 3. Configuration dans Google Cloud Console

**C'est ICI que l'erreur `redirect_uri_mismatch` vient !**

#### Étape 1 : Aller sur Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Connectez-vous avec votre compte Google
3. Sélectionnez votre projet

#### Étape 2 : Ouvrir votre OAuth 2.0 Client ID

1. Dans le menu latéral : **"APIs & Services"** → **"Credentials"**
2. Trouvez votre **OAuth 2.0 Client ID**
3. Cliquez sur l'icône **✏️ (Modifier)**

#### Étape 3 : Vérifier l'URL de Redirection

Dans la section **"URI de redirection autorisées"**, vous devez avoir **exactement** :

```
https://peakplay-14.onrender.com/api/v1/auth/google/redirect
```

**Points importants :**
- [ ] L'URL est **exactement** la même (pas d'espace, pas de slash final)
- [ ] Utilise `https://` (pas `http://`) pour la production
- [ ] Pas de caractères supplémentaires
- [ ] Les modifications sont **sauvegardées**

**Pour Local (optionnel) :**
Vous pouvez aussi ajouter :
```
http://localhost:3001/api/v1/auth/google/redirect
```

---

### 🔍 4. Vérification des Logs

**Après redéploiement, vérifiez les logs du backend :**

Dans Render Dashboard → Votre service → "Logs"

Vous devriez voir au démarrage :
```
🔧 [GOOGLE_STRATEGY] Configuration OAuth Google:
   → BACKEND_URL: https://peakplay-14.onrender.com
   → URL nettoyée: https://peakplay-14.onrender.com
   → GOOGLE_CALLBACK_URL: Non défini (utilisation de la valeur par défaut)
   → Callback URL utilisée: https://peakplay-14.onrender.com/api/v1/auth/google/redirect
   → ⚠️ Assurez-vous que cette URL est EXACTEMENT la même dans Google Cloud Console
```

**Action :**
- Copiez l'URL affichée : `https://peakplay-14.onrender.com/api/v1/auth/google/redirect`
- Vérifiez qu'elle est **exactement** la même dans Google Cloud Console

---

## 🧪 Test Final

### Après avoir tout configuré :

1. **Attendez 1-2 minutes** après avoir modifié Google Cloud Console
2. **Redéployez** votre application sur Render (si vous avez modifié les variables)
3. **Testez** :
   ```
   https://peakplay-14.onrender.com/api/v1/auth/google
   ```

**Résultat attendu :**
- ✅ Redirection vers Google (pas d'erreur `redirect_uri_mismatch`)
- ✅ Page de connexion Google
- ✅ Après connexion, redirection vers votre backend
- ✅ Connexion réussie

---

## 📊 Résumé des Configurations

### Dans Render (Variables d'Environnement) :

```env
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-votre-secret
BACKEND_URL=https://peakplay-14.onrender.com
```

### Dans Google Cloud Console (URI de Redirection) :

```
https://peakplay-14.onrender.com/api/v1/auth/google/redirect
```

### Dans le Code :

✅ **Déjà configuré** - Le code construit automatiquement l'URL depuis `BACKEND_URL`

---

## ❌ Si l'Erreur Persiste

### Vérifications à Faire :

1. **L'URL dans Google Cloud Console correspond EXACTEMENT** à celle dans les logs
2. **Pas d'espace** avant ou après l'URL
3. **Pas de slash final** (`/`) dans `BACKEND_URL`
4. **Utilise `https://`** (pas `http://`) pour la production
5. **Les modifications sont sauvegardées** dans Google Cloud Console
6. **Attendu 1-2 minutes** après modification
7. **Redéployé** l'application sur Render

---

## ✅ Checklist Rapide

- [ ] `GOOGLE_CLIENT_ID` défini dans Render
- [ ] `GOOGLE_CLIENT_SECRET` défini dans Render
- [ ] `BACKEND_URL=https://peakplay-14.onrender.com` (sans slash final) dans Render
- [ ] URL de redirection ajoutée dans Google Cloud Console : `https://peakplay-14.onrender.com/api/v1/auth/google/redirect`
- [ ] URL dans Google Cloud Console correspond EXACTEMENT à celle dans les logs
- [ ] Modifications sauvegardées dans Google Cloud Console
- [ ] Application redéployée sur Render
- [ ] Test effectué : `https://peakplay-14.onrender.com/api/v1/auth/google`

---

## 🎯 Prochaines Étapes

1. **Vérifiez** les variables dans Render
2. **Vérifiez** l'URL dans Google Cloud Console
3. **Comparez** avec les logs du backend
4. **Testez** la connexion Google

**Une fois tout vérifié, le login Google devrait fonctionner !** 🎉

