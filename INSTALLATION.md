# 🚀 Installation Rapide - Investment Calculator Pro

## 📦 Ce Package Contient

```
investment-calculator/
├── src/
│   ├── App.jsx          # Calculateur principal (800+ lignes)
│   └── main.jsx         # Point d'entrée React
├── .gitignore          # Fichiers à ignorer par Git
├── index.html          # Page HTML principale
├── package.json        # Dépendances npm
├── vite.config.js      # Configuration Vite
├── README.md           # Documentation complète
└── INSTALLATION.md     # Ce fichier !
```

---

## ⚡ Installation en 5 Minutes

### Étape 1 : Extraire les Fichiers
Extrayez le ZIP dans un dossier de votre choix, par exemple :
- `C:/Users/VotreNom/Documents/investment-calculator`
- `/Users/VotreNom/Documents/investment-calculator`

### Étape 2 : Ouvrir le Terminal

**Windows :**
- Ouvrez le dossier dans l'Explorateur
- Maintenez **Shift + Clic droit** dans le dossier
- Choisissez "Ouvrir dans le Terminal" ou "Git Bash Here"

**Mac :**
- Ouvrez Terminal
- Tapez : `cd ` puis glissez le dossier dans le terminal

**Linux :**
- Ouvrez Terminal
- Tapez : `cd /chemin/vers/investment-calculator`

### Étape 3 : Installer les Dépendances

```bash
npm install
```

⏱️ Attendez 1-2 minutes (télécharge React, Vite, Recharts...)

### Étape 4 : Lancer en Local

```bash
npm run dev
```

✅ Ouvrez votre navigateur sur : http://localhost:3000

**Identifiants par défaut :**
- Username : `admin`
- Password : `invest2024`

---

## 🌐 Déployer sur Internet (Git + Vercel)

### Option A : Via GitHub Desktop (Le Plus Simple)

1. **Téléchargez GitHub Desktop**
   - https://desktop.github.com
   - Installez et connectez-vous avec votre compte GitHub

2. **Ajoutez le projet**
   - File → Add Local Repository
   - Sélectionnez votre dossier `investment-calculator`
   - Si demandé "This directory does not appear to be a Git repository", cliquez "Create a repository"

3. **Premier Commit**
   - Dans la zone de texte en bas à gauche, écrivez : "Initial commit"
   - Cliquez sur "Commit to main"

4. **Publier sur GitHub**
   - Cliquez sur "Publish repository" en haut
   - Décochez "Keep this code private" si vous voulez qu'il soit public
   - Cliquez sur "Publish Repository"

5. **Déployer sur Vercel**
   - Allez sur https://vercel.com
   - "Sign Up" avec GitHub
   - "Add New..." → "Project"
   - Sélectionnez `investment-calculator`
   - "Deploy"

**🎉 Votre site est en ligne !**

---

### Option B : Via Git en Ligne de Commande

**Prérequis :** Git installé (https://git-scm.com)

```bash
# 1. Initialiser Git
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Premier commit
git commit -m "Initial commit: Investment Calculator Pro"

# 4. Créer le repository sur GitHub
# Allez sur github.com → New repository → Nommez-le "investment-calculator"

# 5. Connecter et pousser (remplacez VOTRE-USERNAME)
git remote add origin https://github.com/VOTRE-USERNAME/investment-calculator.git
git branch -M main
git push -u origin main
```

**Ensuite Vercel** (comme Option A, étape 5)

---

## 🔧 Configuration

### Changer les Identifiants de Connexion

Ouvrez `src/App.jsx` et modifiez (ligne ~7) :

```javascript
const CREDENTIALS = {
  username: 'votre-username',
  password: 'votre-password'
};
```

### Personnaliser les Fonds

Dans `src/App.jsx`, modifiez l'array `funds` (ligne ~11) :

```javascript
const funds = [
  { 
    name: 'Votre Fonds Personnalisé', 
    rate: 0.008,    // 0.8% par jour
    minimum: 50000,  // 50,000$ minimum
    duration: 12,    // 12 mois
    color: '#6366f1' 
  },
  // ... autres fonds
];
```

---

## 🐛 Résolution de Problèmes

### "npm: command not found"
→ Installez Node.js : https://nodejs.org

### Port 3000 déjà utilisé
```bash
npm run dev -- --port 3001
```

### Erreur lors de `npm install`
```bash
# Nettoyez le cache et réessayez
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Le graphique ne s'affiche pas
Vérifiez que `recharts` est installé :
```bash
npm install recharts
```

---

## 📝 Prochaines Étapes

1. ✅ Testez l'application en local
2. ✅ Personnalisez les identifiants
3. ✅ Ajustez les fonds selon vos besoins
4. ✅ Déployez sur Vercel
5. ✅ Partagez le lien !

---

## 📚 Documentation Complète

Consultez le **README.md** pour :
- Liste complète des fonctionnalités
- Guide d'utilisation détaillé
- Options de configuration avancées
- Structure du projet

---

## 🎯 Fonctionnalités Incluses

- ✅ Système de login sécurisé
- ✅ 3 vues d'investissement (Income/Growth/Compound)
- ✅ Comparateur de fonds
- ✅ Mode objectif (calcul inversé)
- ✅ Historique des simulations
- ✅ Sauvegarde automatique (localStorage)
- ✅ Slider interactif + Input
- ✅ Tooltips explicatifs
- ✅ Panel d'aide complet
- ✅ Mode clair/sombre
- ✅ Graphique interactif
- ✅ Design responsive
- ✅ Animations fluides

---

## 💡 Astuces

### Développement Rapide
Modifiez les fichiers pendant que `npm run dev` tourne.
Les changements s'affichent automatiquement dans le navigateur ! 🔥

### Avant de Déployer
Testez toujours le build de production :
```bash
npm run build
npm run preview
```

### Mises à Jour Automatiques
Une fois déployé sur Vercel, chaque `git push` redéploie automatiquement ! ✨

---

## 📞 Besoin d'Aide ?

1. Consultez le **README.md**
2. Lisez le **GUIDE-GIT-DEBUTANT.md** (si problème Git)
3. Vérifiez les erreurs dans le terminal
4. Googlez le message d'erreur

---

## ⭐ Version

Investment Calculator Pro - v1.0.0
Décembre 2024

**Fait avec ❤️ pour l'AMG**

🚀 Bon déploiement !
