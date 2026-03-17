# 💡 Lights_Out AI

> **Un puzzle binaire minimaliste doublé d'un solveur mathématique puissant.**

**Lights_Out** est une adaptation moderne du célèbre jeu de réflexion électronique des années 90. Ce projet explore la logique de voisinage et la résolution de systèmes d'équations linéaires à travers une interface fluide et un algorithme de résolution automatique par intelligence artificielle.

🔗 **[Jouer en ligne](https://cnuddematteo.github.io/lights-out-ai/)**

---

## 🎮 Concept du Jeu

Le plateau est une grille de 5x5 lumières. Au démarrage, une configuration aléatoire est générée.

- **Le but :** Éteindre toutes les lumières du plateau (passer à l'état "Sombre").
- **La règle :** Appuyer sur une lumière bascule son état (On/Off) ainsi que celui de ses quatre voisines directes (Haut, Bas, Gauche, Droite) suivant un motif en croix.

---

## 🤖 L'Intelligence Artificielle (The Solver)

La particularité de cette version est l'intégration d'un **Solver** capable de trouver la solution optimale depuis n'importe quelle configuration.

Plutôt que d'utiliser une recherche par force brute (2^25 combinaisons), ce projet implémente l'**élimination de Gauss-Jordan** sur le corps fini **F₂** (algèbre booléenne). Le jeu est modélisé comme un système d'équations :

```
A x = b
```

Où :

- **A** est la matrice d'adjacence représentant les règles du jeu.
- **b** est le vecteur d'état actuel de la grille.
- **x** est le vecteur solution indiquant les cases sur lesquelles cliquer.

---

## ✨ Fonctionnalités

- **Garantie de solvabilité :** Chaque puzzle possède au moins une solution.
- **IA / Hint :** Visualisation de la solution mathématique en temps réel.
- **Design Cyber-Néon :** Esthétique "Glassmorphism" avec effets lumineux.
- **Statistiques :** Compteur de mouvements et chronomètre.

---

## 🛠️ Stack Technique

- **Langages :** HTML5, CSS3, JavaScript (ES6+)
- **Rendu :** Manipulation dynamique du DOM (CSS Grid)
- **Algorithmique :** Calcul matriciel binaire (solveur)

---

## 🚀 Installation

1. **Cloner le dépôt :**
```bash
git clone https://github.com/cnuddeMatteo/lights_out-ai.git
```

2. **Lancer le jeu :**
Ouvrir le fichier `index.html` dans un navigateur.

---

## 👤 Auteur

**Mattéo Cnudde** — *Étudiant en Cybersécurité & Développeur*

- **GitHub :** https://github.com/cnuddeMatteo  
- **LinkedIn :** https://www.linkedin.com/in/votre-profil-ici/

---

> *"L'obscurité est l'état final de la logique."*
