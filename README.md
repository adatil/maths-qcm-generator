# 🧮 QCM Maths Generator

> **Générateur automatique de QCM mathématiques à partir de cours LaTeX**

[![🚀 Deploy QCM Generator](https://github.com/adatil/maths-qcm-generator/actions/workflows/deploy.yml/badge.svg)](https://github.com/adatil/maths-qcm-generator/actions/workflows/deploy.yml)
[![📱 PWA Ready](https://img.shields.io/badge/PWA-Ready-blue?logo=pwa)](https://adatil.github.io/maths-qcm-generator/)
[![📚 Education](https://img.shields.io/badge/Category-Education-green)](https://adatil.github.io/maths-qcm-generator/)

## 🎯 **Démo en direct**

**👉 [Essayer l'application](https://adatil.github.io/maths-qcm-generator/)**

Une Progressive Web App (PWA) complète qui transforme automatiquement vos cours LaTeX en QCM interactifs !

## ✨ **Fonctionnalités**

### 🔄 **Génération automatique**
- **Parser LaTeX intelligent** : Analyse vos cours et extrait automatiquement définitions, propriétés, méthodes
- **Questions variées** : Génère des QCM sur les définitions, calculs, propriétés et applications
- **Mise à jour en temps réel** : GitHub Actions reconstruit automatiquement les QCM à chaque modification de cours

### 📱 **Interface moderne**
- **Progressive Web App (PWA)** : Installable sur mobile/desktop, fonctionne hors-ligne
- **Design responsive** : Interface optimisée pour tous les écrans
- **Timer intégré** : Chronomètre pour simuler les conditions d'examen
- **Résultats détaillés** : Statistiques par catégorie et révision des réponses

### 🎨 **Expérience utilisateur**
- **Sélection de catégories** : Choisissez les types de questions (définitions, calculs, etc.)
- **Feedback immédiat** : Explications détaillées pour chaque question
- **Mode révision** : Revoir toutes les réponses avec les corrections
- **Interface ludique** : Style moderne inspiré de Kahoot

## 🏗️ **Architecture du projet**

```
maths-qcm-generator/
├── 📁 cours/                    # Vos cours LaTeX
│   └── Nombres_3.tex           # Exemple : cours sur les nombres réels
├── 📁 scripts/                 # Scripts de génération
│   ├── latex_parser.py         # Analyse les cours LaTeX
│   └── qcm_generator.py        # Génère les questions QCM
├── 📁 qcm-data/               # Données générées
│   ├── parsed_concepts.json    # Concepts extraits
│   └── generated_questions.json # Questions QCM
├── 📁 .github/workflows/       # Automatisation GitHub
│   └── deploy.yml              # Déploiement automatique
├── 📱 Interface web PWA
│   ├── index.html              # Application principale
│   ├── styles.css              # Design moderne
│   ├── app.js                  # Logique interactive
│   ├── manifest.json           # Configuration PWA
│   └── sw.js                   # Service Worker (mode hors-ligne)
└── 📄 README.md
```

## 🚀 **Démarrage rapide**

### 1. **Fork et clone**
```bash
git clone https://github.com/adatil/maths-qcm-generator.git
cd maths-qcm-generator
```

### 2. **Ajoutez vos cours**
- Placez vos fichiers LaTeX dans le dossier `cours/`
- Le parser reconnaît automatiquement les environnements : `definition`, `propriete`, `methode`, `exemples`

### 3. **Génération locale (optionnel)**
```bash
cd scripts
python latex_parser.py      # Analyse le cours
python qcm_generator.py     # Génère les questions
```

### 4. **Déploiement automatique**
- Activez GitHub Pages dans les paramètres du repository
- Chaque push déclenche automatiquement :
  - 🔍 Analyse des cours LaTeX
  - 🎯 Génération des questions QCM
  - 🌐 Déploiement de l'application web

## 🧠 **Intelligence du parser**

Le parser LaTeX reconnaît et extrait automatiquement :

### 📚 **Définitions**
```latex
\begin{definition}
$\sqrt{a}$ est le nombre positif qui a pour carré $a$.
\end{definition}
```
→ Génère des QCM de type "Quelle est la définition de... ?"

### ⚡ **Propriétés**
```latex
\begin{propriete}
Si $a$ et $b$ sont deux entiers naturels, alors $\sqrt{a} \times \sqrt{b} = \sqrt{a\times b}$
\end{propriete}
```
→ Génère des questions sur les règles mathématiques

### 🧮 **Méthodes**
```latex
\begin{methode}
Regroupements et simplifications d'écritures :
$\sqrt{20} = \sqrt{4\times 5} = 2\sqrt{5}$
\end{methode}
```
→ Crée des exercices de calcul

## 🎮 **Types de questions générées**

- **📖 Définitions** : "Quelle est la définition de √a ?"
- **🔢 Calculs** : "Calculez √25", "Simplifiez √20"
- **⚖️ Propriétés** : "Que vaut √a × √b ?"
- **📏 Intervalles** : "Que signifie [2; 5] ?", "Calculez ]1;4] ∪ [3;6]"
- **📐 Valeurs absolues** : "Calculez |-7|", "Distance entre deux nombres"

## 🛠️ **Technologies utilisées**

- **🐍 Python** : Parser LaTeX et générateur de questions
- **🌐 Vanilla JavaScript** : Application web sans framework
- **🎨 CSS moderne** : Design responsive avec animations
- **📱 PWA** : Service Worker pour le mode hors-ligne
- **⚙️ GitHub Actions** : Déploiement automatique
- **📄 GitHub Pages** : Hébergement gratuit

## 🎯 **Exemple concret**

**Input LaTeX :**
```latex
\begin{definition}
$\sqrt{a}$ est le nombre positif qui a pour carré $a$.
\end{definition}
```

**Output QCM :**
```json
{
  "question": "Quelle est la définition de √a ?",
  "options": [
    "√a est le nombre positif qui a pour carré a",
    "√a est le nombre négatif qui a pour carré a",
    "√a peut être positif ou négatif",
    "√a est toujours égal à a/2"
  ],
  "correct": 0,
  "explanation": "√a est par définition le nombre positif qui, élevé au carré, donne a."
}
```

## 🔧 **Personnalisation**

### 📝 **Ajouter de nouveaux types de questions**
Éditez `scripts/qcm_generator.py` :

```python
def _generate_custom_questions(self):
    self.questions.append({
        'question': 'Votre question personnalisée ?',
        'options': ['Option A', 'Option B', 'Option C', 'Option D'],
        'correct': 0,
        'explanation': 'Explication de la réponse'
    })
```

### 🎨 **Modifier le design**
Personnalisez `styles.css` :

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-secondary;
}
```

## 📊 **Statistiques du projet**

- **📝 25+ questions générées** automatiquement
- **🎯 4 catégories** : Définitions, Calculs, Propriétés, Intervalles
- **⏱️ Timer 20 minutes** pour conditions d'examen réelles
- **📱 100% responsive** : Mobile, tablette, desktop
- **🔄 Déploiement automatique** via GitHub Actions

## 🤝 **Contribuer**

1. **Fork** le projet
2. **Créez** votre branche : `git checkout -b feature/nouvelle-fonctionnalite`
3. **Commitez** : `git commit -m 'Ajout nouvelle fonctionnalité'`
4. **Push** : `git push origin feature/nouvelle-fonctionnalite`
5. **Ouvrez** une Pull Request

## 📜 **Licence**

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🎓 **Cas d'usage**

- **👨‍🏫 Professeurs** : Créez rapidement des QCM à partir de vos cours existants
- **🎓 Étudiants** : Générez des exercices de révision automatiquement
- **🏫 Établissements** : Standardisez la création de QCM mathématiques
- **📚 Formations** : Transformez n'importe quel contenu LaTeX en quiz interactif

## 🌟 **Prochaines fonctionnalités**

- [ ] 🧠 IA pour générer des questions plus complexes
- [ ] 📊 Analytics détaillés des performances
- [ ] 👥 Mode multijoueur en temps réel
- [ ] 🎨 Thèmes personnalisables
- [ ] 🌍 Support multilingue
- [ ] 📤 Export PDF des QCM
- [ ] 🔗 Intégration LMS (Moodle, Canvas)

---

**🚀 Transformez vos cours LaTeX en QCM interactifs en quelques clics !**

[![⭐ Star ce projet](https://img.shields.io/github/stars/adatil/maths-qcm-generator?style=social)](https://github.com/adatil/maths-qcm-generator)
