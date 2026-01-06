# 📍 Éditeur Cartographique PAT Rufisque

## 🎯 Bienvenue

Cet éditeur vous permet de **modifier les données géographiques** du site PAT Rufisque directement depuis votre navigateur, sans avoir besoin d'outils techniques complexes.

**URL de l'éditeur** : https://pat-rufisque.pages.dev/edit/

---

## 🔑 Prérequis : Configuration de votre accès GitHub

Pour utiliser l'éditeur, vous devez d'abord configurer votre accès GitHub.

### Étape 1 : Être collaborateur du dépôt

Vous devez être ajouté comme **collaborateur** sur le dépôt GitHub `studio-noble-val/pat-rufisque`.

Si ce n'est pas encore fait, demandez à l'administrateur du projet de vous inviter via :
```
https://github.com/studio-noble-val/pat-rufisque/settings/access
```

### Étape 2 : Créer un Personal Access Token (PAT)

Un **Personal Access Token** est comme un mot de passe temporaire qui donne accès au dépôt GitHub.

#### 📋 Procédure de création du token :

1. **Connectez-vous sur GitHub** avec votre compte

2. **Allez dans vos paramètres** :
   - Cliquez sur votre photo de profil (en haut à droite)
   - Cliquez sur **"Settings"**

3. **Accédez aux tokens** :
   - Dans le menu de gauche, descendez jusqu'à **"Developer settings"** (tout en bas)
   - Cliquez sur **"Personal access tokens"**
   - Cliquez sur **"Tokens (classic)"**

4. **Générez un nouveau token** :
   - Cliquez sur **"Generate new token (classic)"**
   - GitHub vous demandera peut-être votre mot de passe

5. **Configurez le token** :
   - **Note** : Donnez-lui un nom descriptif (ex: "PAT Rufisque Editor")
   - **Expiration** : Choisissez une durée (30, 60 ou 90 jours recommandés)
   - **Permissions** : ✅ **Cochez uniquement `repo`** (Full control of private repositories)
     - Cette permission inclut automatiquement toutes les sous-permissions nécessaires

6. **Générez et copiez le token** :
   - Cliquez sur **"Generate token"** (en bas de page)
   - ⚠️ **IMPORTANT** : Copiez immédiatement le token qui s'affiche
   - **Conservez-le dans un endroit sûr** (fichier texte local, gestionnaire de mots de passe)
   - ⚠️ Vous ne pourrez **plus jamais le revoir** après avoir quitté cette page !

---

## 🚀 Utilisation de l'éditeur

### 1️⃣ Connexion

1. Ouvrez l'éditeur : https://pat-rufisque.pages.dev/edit/
2. Collez votre **Personal Access Token** dans le champ prévu
3. Cliquez sur **"Se connecter"**

✅ Si le token est valide, vous verrez :
- La carte de Rufisque s'afficher
- Votre nom d'utilisateur GitHub en haut à gauche
- Les couches de données disponibles

❌ Si le token ne fonctionne pas :
- Vérifiez que vous avez bien coché la permission `repo`
- Vérifiez que le token n'a pas expiré
- Générez un nouveau token si nécessaire

### 2️⃣ Navigation sur la carte

- **Zoomer/dézoomer** : Utilisez la molette de la souris ou les boutons `+` / `-`
- **Se déplacer** : Cliquez et glissez sur la carte
- **Afficher/masquer les couches** : Utilisez le contrôle des couches (en haut à droite)

### 3️⃣ Éditer un point

1. **Cliquez sur un marqueur** (point sur la carte)
2. Le **panneau d'édition** s'ouvre à droite avec :
   - Les informations actuelles du point
   - Un formulaire pour modifier les données
   - Un marqueur **draggable** (déplaçable) sur la carte

3. **Modifier les informations** :
   - Modifiez les champs texte, nombres, dates selon vos besoins
   - Les champs obligatoires sont généralement marqués

4. **Déplacer le point** (optionnel) :
   - Le marqueur **rouge** sur la carte peut être **déplacé** avec la souris
   - Glissez-le simplement vers sa nouvelle position
   - Les nouvelles coordonnées seront automatiquement enregistrées

5. **Enregistrer les modifications** :
   - Cliquez sur le bouton **"Enregistrer"** (vert)
   - Patientez quelques secondes pendant la sauvegarde
   - Un message de confirmation s'affichera

6. **Annuler** :
   - Cliquez sur **"Annuler"** pour fermer sans sauvegarder

### 4️⃣ Vérifier vos modifications

Après avoir sauvegardé :
- Les modifications sont **immédiatement enregistrées** sur GitHub
- Un **commit automatique** est créé avec vos changements
- Le site principal sera **mis à jour automatiquement** dans quelques minutes

Pour voir l'historique des modifications :
👉 https://github.com/studio-noble-val/pat-rufisque/commits/main

---

## 🔒 Sécurité et bonnes pratiques

### ⚠️ Votre token est sensible !

- 🔐 **Ne le partagez JAMAIS** avec personne
- 🔐 **Ne le publiez pas** sur internet, forums, emails, etc.
- 🔐 **Ne le commitez pas** dans un fichier Git
- 🔐 Conservez-le dans un **endroit sûr** (gestionnaire de mots de passe recommandé)

### 📅 Expiration du token

- Les tokens ont une **date d'expiration** pour votre sécurité
- Quand le token expire, vous devrez en **créer un nouveau**
- GitHub vous enverra un email de rappel quelques jours avant l'expiration

### 🗑️ Révoquer un token

Si vous pensez que votre token a été compromis ou si vous ne l'utilisez plus :

1. Allez sur : https://github.com/settings/tokens
2. Trouvez votre token dans la liste
3. Cliquez sur **"Delete"** pour le révoquer
4. Créez-en un nouveau si nécessaire

### ✅ Permissions du token

Le token `repo` donne accès à :
- ✅ Lecture des fichiers du dépôt
- ✅ Modification des fichiers du dépôt
- ✅ Création de commits

⚠️ Il donne également accès à **tout le dépôt**, pas seulement les données GeoJSON. Utilisez-le avec précaution.

---

## 📊 Données modifiables

L'éditeur permet de modifier **3 couches de données** :

### 🍽️ Cantines scolaires
- Fichier : `mviewer/apps/public/cantines/cantines_scolaires.geojson`
- Marqueurs : **Rouges**
- Données : Informations sur les cantines des écoles

### 🏢 Cuisine centrale
- Fichier : `mviewer/apps/public/cantines/cuisine_centrale.geojson`
- Marqueurs : **Verts**
- Données : Informations sur la cuisine centrale

### 👥 Fournisseurs
- Fichier : `mviewer/apps/public/gouvernance/fournisseurs.geojson`
- Marqueurs : **Jaunes**
- Données : Informations sur les fournisseurs

---

## ❓ Problèmes courants

### "Invalid credentials" lors de la connexion
- ✅ Vérifiez que vous avez bien copié le token en entier
- ✅ Vérifiez que le token n'a pas expiré
- ✅ Vérifiez que la permission `repo` est cochée
- ✅ Générez un nouveau token si nécessaire

### "Failed to save" lors de l'enregistrement
- ✅ Vérifiez votre connexion internet
- ✅ Vérifiez que vous êtes toujours connecté (rechargez la page)
- ✅ Vérifiez que vous êtes bien collaborateur du dépôt

### Le panneau d'édition ne s'ouvre pas
- ✅ Vérifiez que vous avez bien cliqué sur un marqueur (pas sur la carte)
- ✅ Rechargez la page et reconnectez-vous

### Les modifications ne s'affichent pas sur le site principal
- ✅ Patientez 2-3 minutes (temps de déploiement Cloudflare)
- ✅ Videz le cache de votre navigateur (Ctrl+F5)
- ✅ Vérifiez que la sauvegarde a bien fonctionné (message de confirmation)

---

## 📞 Support

Pour toute question ou problème :

1. **Vérifiez d'abord cette documentation**
2. **Consultez l'historique GitHub** pour voir si vos modifications sont enregistrées
3. **Contactez l'administrateur du projet** si le problème persiste

---

## 🔄 Workflow recommandé

1. ✅ **Connectez-vous** avec votre token
2. ✅ **Vérifiez les données** avant de les modifier
3. ✅ **Faites une modification à la fois** (évitez les modifications massives)
4. ✅ **Vérifiez immédiatement** que la sauvegarde a fonctionné
5. ✅ **Déconnectez-vous** quand vous avez terminé

---

**Dernière mise à jour** : Janvier 2026
**Version de l'éditeur** : 1.0
**Maintenu par** : studio-noble-val
