# 🎓 Guide Git pour Débutants - Déploiement de votre Calculateur

## 📚 Table des matières
1. [Qu'est-ce que Git ?](#quest-ce-que-git)
2. [Installation de Git](#installation)
3. [Configuration initiale](#configuration)
4. [Créer un compte GitHub](#créer-github)
5. [Étapes détaillées avec Git](#étapes-git)
6. [Commandes essentielles](#commandes-essentielles)
7. [Résolution de problèmes](#problèmes)

---

## 🤔 Qu'est-ce que Git ?

**Git** est un outil qui permet de :
- 📁 Sauvegarder votre code
- 🕐 Garder un historique de tous vos changements
- 🌐 Partager votre code avec d'autres (ou vous-même sur un autre ordinateur)
- 🔄 Collaborer sur des projets

**GitHub** est un site web qui héberge votre code Git (comme Google Drive pour le code).

**Analogie simple :**
- Git = Appareil photo 📸 (prend des "photos" de votre code)
- GitHub = Album photo en ligne 📔 (stocke toutes vos "photos")
- Vercel = Cadre photo 🖼️ (affiche votre travail au public)

---

## 💻 Installation de Git

### Sur Windows

**Méthode 1 : Téléchargement direct** (Recommandé)
1. Allez sur : https://git-scm.com/download/win
2. Le téléchargement démarre automatiquement
3. Ouvrez le fichier téléchargé (Git-2.xx.x-64-bit.exe)
4. **Important** : Pendant l'installation, gardez toutes les options par défaut
5. Cliquez sur "Next" → "Next" → "Install"

**Méthode 2 : Via Chocolatey** (si vous avez déjà Chocolatey)
```bash
choco install git
```

### Sur Mac

**Méthode 1 : Homebrew** (Recommandé)
```bash
# Installer Homebrew d'abord si pas encore fait
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Puis installer Git
brew install git
```

**Méthode 2 : Téléchargement direct**
1. Allez sur : https://git-scm.com/download/mac
2. Téléchargez et installez

### Sur Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git
```

### ✅ Vérifier l'installation

Ouvrez votre terminal/invite de commande et tapez :
```bash
git --version
```

Vous devriez voir quelque chose comme :
```
git version 2.42.0
```

Si vous voyez ça, **Git est installé** ! ✅

---

## ⚙️ Configuration Initiale de Git

**Pourquoi ?** Git a besoin de savoir qui vous êtes pour signer vos modifications.

Ouvrez votre terminal et tapez ces commandes (remplacez par VOS informations) :

```bash
# Votre nom (peut être votre vrai nom ou un pseudo)
git config --global user.name "Azouz"

# Votre email (utilisez le même que pour GitHub)
git config --global user.email "votre.email@exemple.com"
```

### ✅ Vérifier la configuration

```bash
git config --list
```

Vous devriez voir vos informations affichées.

---

## 🌐 Créer un Compte GitHub

### Étape 1 : Inscription
1. Allez sur : https://github.com
2. Cliquez sur **"Sign up"** (en haut à droite)
3. Remplissez :
   - Email : `votre.email@exemple.com`
   - Mot de passe : `UnMotDePasseForT123!`
   - Username : `azouz-invest` (ou ce que vous voulez)
4. Résolvez le puzzle de vérification
5. Cliquez sur **"Create account"**

### Étape 2 : Vérification
1. GitHub vous envoie un email
2. Ouvrez l'email et cliquez sur le lien de vérification
3. Répondez aux questions (vous pouvez sauter)

**Félicitations ! Votre compte GitHub est créé** ! 🎉

---

## 📂 Structure de Votre Projet

Avant de commencer avec Git, organisez vos fichiers comme ceci :

```
investment-calculator/
├── src/
│   ├── App.jsx                    ← Votre calculateur
│   └── main.jsx                   ← Point d'entrée
├── public/
│   └── index.html                 ← Page HTML
├── package.json                   ← Configuration npm
├── vite.config.js                 ← Configuration Vite
└── .gitignore                     ← Fichiers à ignorer
```

Je vais vous créer tous ces fichiers ! ⬇️

---

## 🚀 Étapes Détaillées avec Git

### Étape 1 : Ouvrir le Terminal dans Votre Dossier

**Sur Windows :**
1. Ouvrez l'Explorateur de fichiers
2. Naviguez jusqu'à votre dossier `investment-calculator`
3. Maintenez **Shift** + Clic droit dans le dossier
4. Choisissez **"Ouvrir dans le Terminal"** ou **"Git Bash Here"**

**Sur Mac/Linux :**
1. Ouvrez le Terminal
2. Tapez : `cd /chemin/vers/votre/dossier/investment-calculator`

### Étape 2 : Initialiser Git

Dans le terminal, tapez :

```bash
git init
```

**Ce que ça fait :** Transforme votre dossier en "dépôt Git" (Git commence à surveiller vos fichiers)

**Vous verrez :**
```
Initialized empty Git repository in /chemin/vers/investment-calculator/.git/
```

### Étape 3 : Ajouter Tous les Fichiers

```bash
git add .
```

**Explication :**
- `git add` = "Git, prépare ces fichiers"
- `.` = "tous les fichiers du dossier actuel"

**Alternative (plus sélective) :**
```bash
git add src/
git add package.json
git add vite.config.js
```

### Étape 4 : Créer un "Commit" (Photo du Code)

```bash
git commit -m "Premier commit : calculateur d'investissement"
```

**Explication :**
- `git commit` = "Prendre une photo de l'état actuel"
- `-m` = "avec ce message"
- Le message entre guillemets = description de ce que vous avez fait

**Vous verrez quelque chose comme :**
```
[main 1a2b3c4] Premier commit : calculateur d'investissement
 5 files changed, 234 insertions(+)
 create mode 100644 src/App.jsx
 create mode 100644 package.json
 ...
```

### Étape 5 : Créer le Repository sur GitHub

**Option A : Via le site web (Plus facile)**

1. Allez sur https://github.com
2. Connectez-vous
3. Cliquez sur le **"+"** en haut à droite
4. Choisissez **"New repository"**
5. Remplissez :
   - Repository name : `investment-calculator`
   - Description : `Calculateur d'investissement avec 3 vues`
   - **Public** (coché)
   - **NE COCHEZ PAS** "Add README" (on l'a déjà)
6. Cliquez sur **"Create repository"**

**GitHub vous montrera des instructions. IGNOREZ-LES, suivez les miennes ci-dessous !**

### Étape 6 : Connecter Votre Dossier à GitHub

**Remplacez `VOTRE-USERNAME` par votre nom d'utilisateur GitHub !**

```bash
git remote add origin https://github.com/VOTRE-USERNAME/investment-calculator.git
```

**Exemple :**
```bash
git remote add origin https://github.com/azouz-invest/investment-calculator.git
```

**Ce que ça fait :** Dit à Git "Le dossier sur GitHub s'appelle origin"

### Étape 7 : Renommer la Branche en "main"

```bash
git branch -M main
```

**Pourquoi ?** GitHub utilise maintenant "main" au lieu de "master"

### Étape 8 : Envoyer Votre Code sur GitHub

```bash
git push -u origin main
```

**Explication :**
- `git push` = "Envoie le code"
- `-u origin main` = "vers GitHub (origin), sur la branche principale (main)"

**🔐 Première fois : GitHub va demander vos identifiants**

#### Sur Windows :
Une fenêtre s'ouvre automatiquement pour vous connecter.

#### Sur Mac/Linux :
```
Username: votre-username-github
Password: [PAS votre mot de passe normal !]
```

**⚠️ Important :** Le "password" n'est PAS votre mot de passe GitHub !

Vous devez créer un **Personal Access Token** :

1. Allez sur : https://github.com/settings/tokens
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donnez un nom : `Git Access Token`
4. Cochez : **repo** (toutes les cases)
5. Durée : **No expiration** (ou 90 days)
6. Cliquez sur **"Generate token"**
7. **COPIEZ LE TOKEN** (vous ne le reverrez plus !)
8. Utilisez ce token comme "password" dans le terminal

**Vous verrez :**
```
Enumerating objects: 12, done.
Counting objects: 100% (12/12), done.
...
To https://github.com/azouz-invest/investment-calculator.git
 * [new branch]      main -> main
```

### ✅ Vérification Finale

Allez sur votre page GitHub :
```
https://github.com/VOTRE-USERNAME/investment-calculator
```

Vous devriez voir tous vos fichiers ! 🎉

---

## 📝 Commandes Git Essentielles

### Situation 1 : Vous avez modifié des fichiers

```bash
# 1. Voir ce qui a changé
git status

# 2. Ajouter les modifications
git add .

# 3. Créer un commit
git commit -m "Ajout du mode comparateur"

# 4. Envoyer sur GitHub
git push
```

### Situation 2 : Voir l'historique

```bash
git log

# Version courte
git log --oneline
```

### Situation 3 : Annuler des modifications

```bash
# Annuler les modifications d'un fichier (avant git add)
git checkout -- nom-du-fichier.jsx

# Annuler le dernier commit (garde les modifications)
git reset --soft HEAD~1

# Annuler TOUT (DANGER !)
git reset --hard HEAD
```

### Situation 4 : Récupérer du code depuis GitHub

```bash
git pull
```

---

## 🔗 Déployer sur Vercel avec Git

Maintenant que votre code est sur GitHub, déployer est FACILE !

### Étape 1 : Aller sur Vercel

1. Allez sur : https://vercel.com
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel

### Étape 2 : Importer le Projet

1. Cliquez sur **"Add New..."** → **"Project"**
2. Vous voyez votre repository `investment-calculator`
3. Cliquez sur **"Import"**

### Étape 3 : Configuration (Automatique !)

Vercel détecte automatiquement que c'est un projet React/Vite :

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

**Ne changez rien !** Cliquez sur **"Deploy"**

### Étape 4 : Attendez (1-2 minutes)

Vercel :
- 📦 Installe les dépendances
- 🔨 Build le projet
- 🚀 Le met en ligne

### ✅ Résultat

Vous obtenez une URL comme :
```
https://investment-calculator-abc123.vercel.app
```

**C'est en ligne ! Accessible partout dans le monde !** 🌍

---

## 🔄 Workflow Quotidien

Une fois que tout est configuré, voici votre routine :

### 1. Modifier le Code
Faites vos changements dans VS Code (ou votre éditeur)

### 2. Tester Localement
```bash
npm run dev
```

### 3. Envoyer sur GitHub
```bash
git add .
git commit -m "Ajout de la fonctionnalité X"
git push
```

### 4. Déploiement Automatique !
Vercel détecte le push et redéploie automatiquement ! ✨

Attendez 1-2 minutes, rafraîchissez votre site → c'est mis à jour !

---

## 🐛 Résolution de Problèmes

### Erreur : "git is not recognized"

**Solution :**
- Git n'est pas installé ou pas dans le PATH
- Réinstallez Git : https://git-scm.com/download
- Redémarrez votre terminal

### Erreur : "Permission denied (publickey)"

**Solution :**
Utilisez HTTPS au lieu de SSH :
```bash
git remote set-url origin https://github.com/VOTRE-USERNAME/investment-calculator.git
```

### Erreur : "fatal: not a git repository"

**Solution :**
Vous n'êtes pas dans le bon dossier !
```bash
cd /chemin/vers/investment-calculator
git init
```

### Erreur : "refusing to merge unrelated histories"

**Solution :**
```bash
git pull origin main --allow-unrelated-histories
```

### Erreur : "Updates were rejected"

**Solution :**
```bash
git pull origin main
git push origin main
```

### Mot de passe refusé

**Solution :**
Vous devez utiliser un **Personal Access Token**, pas votre mot de passe !
Voir "Étape 8" ci-dessus pour le créer.

---

## 📺 Vidéos Tutoriels Recommandées

Si vous préférez des vidéos (en français) :

1. **Git et GitHub pour débutants** (Grafikart)
   - https://grafikart.fr/tutoriels/git

2. **Introduction à Git** (Cocadmin)
   - YouTube : "Git et GitHub - Tutoriel pour Débutants"

---

## 🎯 Récapitulatif Ultra-Rapide

```bash
# 1. Configuration (une seule fois)
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"

# 2. Initialiser (une seule fois)
cd /chemin/vers/votre/projet
git init

# 3. Premier envoi (une seule fois)
git add .
git commit -m "Premier commit"
git remote add origin https://github.com/VOTRE-USERNAME/repo.git
git branch -M main
git push -u origin main

# 4. Mises à jour suivantes (à chaque fois)
git add .
git commit -m "Description des changements"
git push
```

---

## 💡 Conseils Pro

### Bon Messages de Commit
❌ Mauvais :
```bash
git commit -m "changements"
git commit -m "test"
git commit -m "fix"
```

✅ Bons :
```bash
git commit -m "Ajout du mode comparateur de fonds"
git commit -m "Correction du bug de calcul des jours ouvrables"
git commit -m "Amélioration du design mobile"
```

### Fichier .gitignore

Créez un fichier `.gitignore` pour ignorer les fichiers inutiles :

```
# Dépendances
node_modules/

# Build
dist/
build/

# Environnement
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

---

## 🎓 Aller Plus Loin

Quand vous serez à l'aise avec les bases :

### Branches (pour tester des features)
```bash
# Créer une branche
git checkout -b nouvelle-feature

# Revenir à main
git checkout main

# Fusionner la branche
git merge nouvelle-feature
```

### Annuler un commit spécifique
```bash
git revert abc123
```

### Voir les différences
```bash
git diff
```

---

## 📞 Besoin d'Aide ?

Si vous êtes bloqué :

1. **Lisez le message d'erreur** (souvent explicite)
2. **Googlez l'erreur** (ajoutez "git" devant)
3. **StackOverflow** est votre ami
4. **Documentation Git** : https://git-scm.com/doc

---

## ✅ Checklist de Déploiement

- [ ] Git installé et configuré
- [ ] Compte GitHub créé
- [ ] Projet initialisé avec `git init`
- [ ] Fichiers ajoutés avec `git add .`
- [ ] Premier commit créé
- [ ] Repository GitHub créé
- [ ] Code poussé sur GitHub
- [ ] Compte Vercel créé
- [ ] Projet importé sur Vercel
- [ ] Site déployé et accessible

**Félicitations ! Vous maîtrisez maintenant Git et le déploiement ! 🎉**

---

## 🎁 Bonus : Commandes Git Visuelles

### Voir l'Arbre de Commits
```bash
git log --graph --oneline --all
```

### Interface Graphique Git
Si vous préférez une interface visuelle :
- **Windows/Mac/Linux** : GitHub Desktop (https://desktop.github.com)
- **VS Code** : Extension "GitLens"

---

**Vous êtes maintenant prêt à utiliser Git comme un pro ! 💪**

N'oubliez pas : **Tout le monde fait des erreurs avec Git au début. C'est normal !**

La pratique rend parfait. Faites des commits régulièrement et vous prendrez l'habitude ! 🚀
