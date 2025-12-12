# 🚀 Guide d'Hébergement Gratuit - Calculateur d'Investissement

## 📋 Table des matières
1. [Base de données : Est-ce nécessaire ?](#base-de-données)
2. [Options d'hébergement gratuit](#options-hébergement)
3. [Guide détaillé Vercel (RECOMMANDÉ)](#guide-vercel)
4. [Guide Netlify](#guide-netlify)
5. [Guide GitHub Pages](#guide-github-pages)

---

## 🗄️ Base de données : Est-ce nécessaire ?

### ❌ **NON, pas de base de données nécessaire !**

Votre application est **100% frontend** :
- ✅ Tous les calculs se font dans le navigateur
- ✅ Aucune donnée n'est sauvegardée côté serveur
- ✅ Pas besoin de backend
- ✅ Hébergement gratuit illimité possible

**Pourquoi ?**
- L'application utilise uniquement React (JavaScript)
- Les données (montant, fonds sélectionné) restent dans la mémoire du navigateur
- Quand l'utilisateur actualise la page, tout redémarre (aucune sauvegarde)

**Si vous voulez sauvegarder les simulations :**
Alors oui, il faudrait une base de données. Mais pour l'instant, ce n'est pas nécessaire !

---

## 🌐 Options d'Hébergement Gratuit

### 1. **Vercel** ⭐ RECOMMANDÉ
- ✅ Gratuit illimité
- ✅ Déploiement automatique depuis GitHub
- ✅ HTTPS gratuit
- ✅ Très rapide (CDN mondial)
- ✅ Nom de domaine personnalisé gratuit
- ✅ Parfait pour React

### 2. **Netlify**
- ✅ Gratuit illimité
- ✅ Simple à utiliser
- ✅ HTTPS gratuit
- ✅ Bon pour React

### 3. **GitHub Pages**
- ✅ Gratuit
- ⚠️ Plus complexe pour React
- ✅ Parfait si vous connaissez déjà GitHub

---

## 🎯 Guide Vercel (RECOMMANDÉ)

### Étape 1 : Préparer votre projet

**Structure des fichiers nécessaires :**

```
mon-calculateur/
├── package.json
├── src/
│   └── App.jsx (votre fichier calculateur)
├── public/
│   └── index.html
└── vite.config.js (ou next.config.js)
```

**Créez un `package.json` :**
```json
{
  "name": "investment-calculator",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

### Étape 2 : Créer un compte GitHub

1. Allez sur https://github.com
2. Cliquez sur "Sign up"
3. Créez votre compte (gratuit)

### Étape 3 : Créer un repository (dépôt)

1. Une fois connecté, cliquez sur le bouton "+" en haut à droite
2. Sélectionnez "New repository"
3. Nommez-le : `investment-calculator`
4. Cochez "Public"
5. Cliquez sur "Create repository"

### Étape 4 : Uploader vos fichiers

**Option A : Via l'interface web (plus simple)**
1. Sur la page de votre repository, cliquez sur "uploading an existing file"
2. Glissez-déposez tous vos fichiers
3. Cliquez sur "Commit changes"

**Option B : Via Git (plus pro)**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE-USERNAME/investment-calculator.git
git push -u origin main
```

### Étape 5 : Déployer sur Vercel

1. Allez sur https://vercel.com
2. Cliquez sur "Sign Up" et choisissez "Continue with GitHub"
3. Autorisez Vercel à accéder à votre GitHub
4. Cliquez sur "Import Project"
5. Sélectionnez votre repository `investment-calculator`
6. Vercel détectera automatiquement que c'est un projet React
7. Cliquez sur "Deploy"

**C'est tout ! 🎉**

Votre site sera disponible à :
`https://investment-calculator-XXXXX.vercel.app`

### Étape 6 : Personnaliser le domaine (optionnel)

1. Dans Vercel, allez dans "Settings" > "Domains"
2. Ajoutez un nom personnalisé : `calculateur-investissement.vercel.app`

---

## 📱 Guide Netlify

### Étape 1 : Créer un compte

1. Allez sur https://netlify.com
2. Cliquez sur "Sign up" et choisissez GitHub
3. Autorisez Netlify

### Étape 2 : Déployer

**Option A : Drag & Drop (le plus simple)**
1. Buildez votre projet localement : `npm run build`
2. Allez sur Netlify Dashboard
3. Glissez-déposez le dossier `dist/` sur Netlify
4. Votre site est en ligne !

**Option B : Via GitHub**
1. Connectez votre repository GitHub
2. Netlify détectera automatiquement React
3. Build command : `npm run build`
4. Publish directory : `dist`
5. Cliquez sur "Deploy"

**URL :** `https://RANDOM-NAME.netlify.app`

Vous pouvez changer le nom dans Settings > Domain management

---

## 📂 Guide GitHub Pages

### Étape 1 : Installer gh-pages

```bash
npm install --save-dev gh-pages
```

### Étape 2 : Modifier package.json

Ajoutez :
```json
{
  "homepage": "https://VOTRE-USERNAME.github.io/investment-calculator",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Étape 3 : Déployer

```bash
npm run deploy
```

Votre site sera à :
`https://VOTRE-USERNAME.github.io/investment-calculator`

---

## 🎨 Fichiers à inclure absolument

### 1. `src/App.jsx`
Votre fichier calculateur React (celui que je vous ai créé)

### 2. `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 3. `index.html`
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Investment Calculator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 4. `src/main.jsx`
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## ⚡ Comparaison des solutions

| Critère | Vercel | Netlify | GitHub Pages |
|---------|--------|---------|--------------|
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Vitesse** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **React friendly** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **HTTPS** | ✅ Auto | ✅ Auto | ✅ Auto |
| **Domaine perso** | ✅ Gratuit | ✅ Gratuit | ✅ Limité |
| **Build auto** | ✅ | ✅ | ⚠️ Manuel |

---

## 🔄 Mise à jour de votre site

### Avec Vercel/Netlify (automatique) :
1. Modifiez votre code localement
2. Faites un `git push` vers GitHub
3. Le site se met à jour automatiquement ! ✨

### Avec GitHub Pages :
1. Modifiez votre code
2. Lancez `npm run deploy`
3. Le site est mis à jour !

---

## 🆘 Besoin d'aide ?

### Problèmes courants :

**"Module not found: recharts"**
→ Solution : `npm install recharts`

**"Build failed"**
→ Vérifiez que `package.json` contient toutes les dépendances

**"Page blanche"**
→ Vérifiez la console du navigateur (F12)

---

## ✅ Checklist avant déploiement

- [ ] Tous les fichiers sont dans le projet
- [ ] `package.json` est correct
- [ ] Le projet fonctionne en local (`npm run dev`)
- [ ] GitHub repository est créé
- [ ] Code est push sur GitHub
- [ ] Compte Vercel/Netlify créé
- [ ] Projet importé et déployé

---

## 🎉 Félicitations !

Votre calculateur d'investissement est maintenant en ligne et accessible au monde entier !

**Prochaines étapes possibles :**
- Partager le lien avec vos collègues
- Ajouter Google Analytics
- Personnaliser le domaine
- Ajouter une sauvegarde locale (localStorage)
