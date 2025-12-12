# 💰 Investment Calculator Pro

Calculateur d'investissement professionnel avec 3 vues stratégiques et système d'authentification.

## 🌟 Fonctionnalités

### 🔐 Sécurité
- Système de login/mot de passe
- Session persistante
- Protection des données

### 📊 Calculs Avancés
- **Income View** : Revenus réguliers sans toucher au capital
- **Growth View** : Accumulation linéaire des gains
- **Compound View** : Intérêts composés pour croissance exponentielle

### ⚙️ Outils Professionnels
- ⚖️ **Comparateur** : Comparez 2 fonds côte à côte
- 🎯 **Mode Objectif** : Calcul inversé pour atteindre vos objectifs
- 📊 **Historique** : Sauvegarde des 10 dernières simulations
- 🎚️ **Slider interactif** : Ajustement visuel du montant
- ℹ️ **Tooltips** : Explications contextuelles
- 📚 **Panel d'aide** : Guide complet des stratégies

### 🎨 Interface Moderne
- 🌓 Mode clair/sombre
- 📱 Design responsive
- ✨ Animations fluides
- 📈 Graphiques interactifs

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/VOTRE-USERNAME/investment-calculator.git
cd investment-calculator
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer en développement**
```bash
npm run dev
```

Le site sera accessible sur : http://localhost:3000

4. **Build pour production**
```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## 🔑 Identifiants par défaut

- **Username** : `admin`
- **Password** : `invest2024`

⚠️ **Important** : Changez ces identifiants dans `src/App.jsx` :

```javascript
const CREDENTIALS = {
  username: 'votre-username',
  password: 'votre-mot-de-passe'
};
```

## 📦 Technologies Utilisées

- **React** 18.2.0 - Framework UI
- **Vite** 5.0.8 - Build tool
- **Recharts** 2.10.3 - Graphiques
- **localStorage** - Sauvegarde locale

## 🌐 Déploiement

### Sur Vercel (Recommandé)

1. Push votre code sur GitHub
2. Allez sur https://vercel.com
3. Connectez-vous avec GitHub
4. Importez le repository
5. Vercel détecte automatiquement la configuration
6. Cliquez sur "Deploy"

✅ **Votre site est en ligne !**

### Sur Netlify

1. Push votre code sur GitHub
2. Allez sur https://netlify.com
3. Connectez votre repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy !

## 📁 Structure du Projet

```
investment-calculator/
├── src/
│   ├── App.jsx           # Calculateur principal
│   └── main.jsx          # Point d'entrée
├── public/
├── index.html            # HTML de base
├── package.json          # Dépendances
├── vite.config.js        # Configuration Vite
├── .gitignore           # Fichiers ignorés
└── README.md            # Ce fichier
```

## 🎯 Utilisation

### 1. Connexion
Utilisez les identifiants par défaut ou ceux que vous avez configurés.

### 2. Sélection du Fonds
Choisissez parmi 3 fonds avec des taux et durées différents :
- **Health Sciences** : 0.8%/jour, 100,000$ min, 10 mois
- **Energy & Resources** : 0.6%/jour, 10,000$ min, 10 mois
- **Technology** : 0.5%/jour, 500$ min, 12 mois

### 3. Ajustement du Montant
Utilisez le slider ou l'input pour définir votre investissement.

### 4. Analyse des Résultats
Comparez les 3 vues et analysez le ROI.

### 5. Fonctionnalités Avancées
- Comparez 2 fonds
- Définissez un objectif de gains
- Sauvegardez vos simulations

## 🔧 Configuration

### Personnaliser les Fonds

Modifiez l'array `funds` dans `src/App.jsx` :

```javascript
const funds = [
  { 
    name: 'Votre Fonds', 
    rate: 0.01,      // 1% par jour
    minimum: 5000,   // 5000$ minimum
    duration: 6,     // 6 mois
    color: '#6366f1' // Couleur
  },
  // ... autres fonds
];
```

### Changer le Thème

Les couleurs sont dans l'objet `theme` :

```javascript
const theme = darkMode ? {
  bg: 'linear-gradient(...)',
  cardBg: 'rgba(...)',
  // ... autres couleurs
} : {
  // Mode clair
};
```

## 🐛 Problèmes Connus

### Le graphique ne s'affiche pas
Vérifiez que Recharts est bien installé :
```bash
npm install recharts
```

### Erreur de localStorage en mode navigation privée
Le localStorage est désactivé en navigation privée. Les sauvegardes ne fonctionneront pas.

## 📝 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question :
- Ouvrez une issue sur GitHub
- Consultez la documentation dans le code

## ⭐ Star le Projet

Si ce projet vous aide, n'hésitez pas à lui donner une étoile sur GitHub !

---

**Fait avec ❤️ par Azouz**

🚀 Version 1.0.0 - Décembre 2024
