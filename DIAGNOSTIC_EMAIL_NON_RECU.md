# 🔍 Diagnostic : Email de Vérification Non Reçu

## ❌ Problème
L'email de vérification n'est pas reçu après l'inscription.

---

## 🔍 Étapes de Diagnostic

### 1️⃣ Vérifier les Logs de l'Application

**Sur Render :**
1. Allez dans votre dashboard Render
2. Cliquez sur votre service
3. Ouvrez l'onglet "Logs"
4. Cherchez les logs lors de l'inscription

**Logs à Chercher :**

#### ✅ Si la Configuration est Correcte :
```
✅ [MAIL_SERVICE] Configuration Brevo API chargée avec succès
✅ [MAIL_SERVICE] Sender configuré: PeakPlay <9b8f34001@smtp-brevo.com>
📧 [REGISTER] Génération de l'URL de vérification
📧 [SEND_VERIFICATION] Tentative d'envoi d'email de vérification
📤 [SEND_VERIFICATION] Envoi de l'email via Brevo API...
✅ [SEND_VERIFICATION] Email envoyé avec succès via Brevo API
   → Message ID: abc123...
```

#### ❌ Si BREVO_API_KEY est Manquant :
```
❌ [MAIL_SERVICE] BREVO_API_KEY n'est pas défini dans les variables d'environnement
⚠️ [MAIL_SERVICE] Mode développement: service d'email désactivé
```

#### ❌ Si l'Envoi Échoue :
```
❌ [SEND_VERIFICATION] Erreur lors de l'envoi de l'email via Brevo API
   → Erreur: [détails de l'erreur]
   → Détails Brevo API: { ... }
```

---

### 2️⃣ Vérifier les Variables d'Environnement sur Render

**Dans Render Dashboard :**
1. Allez dans votre service
2. Cliquez sur "Environment"
3. Vérifiez que ces variables sont définies :

```env
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAIL_FROM_EMAIL=9b8f34001@smtp-brevo.com
MAIL_FROM_NAME=PeakPlay
BACKEND_URL=https://peakplay-10.onrender.com
```

**⚠️ Important :**
- `BREVO_API_KEY` doit commencer par `xkeysib-`
- `MAIL_FROM_EMAIL` doit être le sender validé dans Brevo
- Pas d'espaces avant/après les valeurs

---

### 3️⃣ Vérifier le Sender dans Brevo

**Sur Brevo :**
1. Allez sur https://app.brevo.com
2. Settings > Senders & IP
3. Vérifiez que `9b8f34001@smtp-brevo.com` est **"Validated"** (pas "Pending" ou "Invalid")

**Si le sender n'est pas validé :**
- Brevo rejettera l'email
- Vous verrez une erreur dans les logs : `Invalid sender`

---

### 4️⃣ Vérifier la Clé API Brevo

**Sur Brevo :**
1. Allez sur https://app.brevo.com
2. Settings > SMTP & API > API Keys
3. Vérifiez que votre clé API v3 est active
4. Copiez la clé complète (commence par `xkeysib-`)

**Test de la Clé :**
```bash
# Testez avec curl (remplacez YOUR_API_KEY)
curl -X POST 'https://api.brevo.com/v3/smtp/email' \
  -H 'api-key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "sender": {"email": "9b8f34001@smtp-brevo.com", "name": "PeakPlay"},
    "to": [{"email": "votre-email@example.com"}],
    "subject": "Test",
    "htmlContent": "<p>Test email</p>"
  }'
```

---

### 5️⃣ Vérifier le Déploiement sur Render

**Vérifications :**
1. ✅ Le code a été poussé sur GitHub
2. ✅ Render a détecté le nouveau commit
3. ✅ Le build s'est terminé avec succès
4. ✅ L'application a redémarré

**Si le code n'est pas déployé :**
- Les changements ne seront pas actifs
- L'ancien code (avec SMTP ou ancien template) sera utilisé

---

### 6️⃣ Vérifier les Logs Brevo

**Sur Brevo :**
1. Allez sur https://app.brevo.com
2. Statistics > Transactional Emails
3. Vérifiez si l'email apparaît dans l'historique
4. Si présent, vérifiez le statut :
   - ✅ **Sent** : Email envoyé (vérifiez les spams)
   - ❌ **Bounced** : Email rejeté (adresse invalide)
   - ❌ **Failed** : Erreur d'envoi (voir les détails)

---

## 🛠️ Solutions par Problème

### Problème 1 : BREVO_API_KEY Non Configuré

**Symptômes :**
```
❌ [MAIL_SERVICE] BREVO_API_KEY n'est pas défini
⚠️ [MAIL_SERVICE] Mode développement: service d'email désactivé
```

**Solution :**
1. Obtenez votre clé API sur https://app.brevo.com
2. Ajoutez-la dans Render : `BREVO_API_KEY=xkeysib-...`
3. Redéployez l'application

---

### Problème 2 : Sender Non Validé

**Symptômes :**
```
❌ [SEND_VERIFICATION] Erreur lors de l'envoi
   → Détails Brevo API: {"code": "invalid_parameter", "message": "Invalid sender"}
```

**Solution :**
1. Allez sur Brevo > Settings > Senders & IP
2. Validez le sender `9b8f34001@smtp-brevo.com`
3. Attendez la validation (peut prendre quelques minutes)

---

### Problème 3 : Clé API Invalide

**Symptômes :**
```
❌ [SEND_VERIFICATION] Erreur lors de l'envoi
   → Status HTTP: 401
   → Détails Brevo API: {"code": "unauthorized"}
```

**Solution :**
1. Vérifiez que la clé commence par `xkeysib-`
2. Vérifiez que c'est une clé API v3 (pas v2)
3. Régénérez une nouvelle clé si nécessaire
4. Mettez à jour `BREVO_API_KEY` dans Render

---

### Problème 4 : Quota Atteint

**Symptômes :**
```
❌ [SEND_VERIFICATION] Erreur lors de l'envoi
   → Détails Brevo API: {"code": "quota_exceeded"}
```

**Solution :**
- Compte gratuit : 300 emails/jour
- Attendez le lendemain ou passez à un plan payant

---

### Problème 5 : Email dans les Spams

**Symptômes :**
- Les logs montrent "Email envoyé avec succès"
- Mais l'email n'est pas dans la boîte de réception

**Solution :**
1. Vérifiez le dossier Spam/Indésirables
2. Vérifiez les filtres Gmail
3. Ajoutez le sender à vos contacts

---

### Problème 6 : Code Non Déployé

**Symptômes :**
- L'email est envoyé mais avec l'ancien format (texte brut)
- Le sender est "DAM Backend" au lieu de "PeakPlay"

**Solution :**
1. Vérifiez que le code est sur GitHub
2. Vérifiez que Render a détecté le nouveau commit
3. Forcez un redéploiement sur Render
4. Vérifiez les logs après le redéploiement

---

## 🧪 Test Complet

### Étape 1 : Vérifier la Configuration

```bash
# Dans les logs Render, vous devriez voir :
✅ [MAIL_SERVICE] Configuration Brevo API chargée avec succès
✅ [MAIL_SERVICE] Sender configuré: PeakPlay <9b8f34001@smtp-brevo.com>
```

### Étape 2 : Tester l'Inscription

```bash
curl -X POST https://peakplay-10.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre-email@example.com",
    "password": "Test123456",
    "prenom": "Test",
    "nom": "User"
  }'
```

### Étape 3 : Vérifier les Logs

**Dans Render Logs, cherchez :**
```
📧 [REGISTER] Génération de l'URL de vérification
📧 [SEND_VERIFICATION] Tentative d'envoi d'email de vérification
📤 [SEND_VERIFICATION] Envoi de l'email via Brevo API...
✅ [SEND_VERIFICATION] Email envoyé avec succès via Brevo API
   → Message ID: [un ID]
```

**Si vous voyez une erreur :**
```
❌ [SEND_VERIFICATION] Erreur lors de l'envoi de l'email via Brevo API
   → Erreur: [détails]
   → Détails Brevo API: [JSON avec le code d'erreur]
```

### Étape 4 : Vérifier dans Brevo

1. Allez sur https://app.brevo.com
2. Statistics > Transactional Emails
3. Vérifiez si l'email apparaît
4. Vérifiez le statut (Sent, Bounced, Failed)

---

## 📋 Checklist de Vérification

- [ ] `BREVO_API_KEY` est défini dans Render (commence par `xkeysib-`)
- [ ] `MAIL_FROM_EMAIL` est défini (`9b8f34001@smtp-brevo.com`)
- [ ] `MAIL_FROM_NAME` est défini (`PeakPlay`)
- [ ] `BACKEND_URL` est défini (URL HTTPS de Render)
- [ ] Le sender est validé dans Brevo (status: "Validated")
- [ ] La clé API est valide et active
- [ ] Le code est déployé sur Render (dernier commit)
- [ ] Les logs montrent "Configuration Brevo API chargée avec succès"
- [ ] Les logs montrent "Email envoyé avec succès" (pas d'erreur)
- [ ] L'email n'est pas dans les spams
- [ ] Le quota Brevo n'est pas atteint

---

## 🎯 Prochaines Étapes

1. **Vérifiez les logs Render** - C'est la source la plus importante d'information
2. **Vérifiez les variables d'environnement** - Assurez-vous qu'elles sont toutes définies
3. **Vérifiez Brevo Dashboard** - Voir si l'email apparaît dans l'historique
4. **Testez avec un autre email** - Pour éliminer les problèmes de spam

**Partagez-moi les logs Render lors de l'inscription et je pourrai identifier le problème exact !**

