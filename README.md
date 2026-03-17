# 💡 Lights_Out AI

> **Un puzzle binaire minimaliste doublé d'un solveur mathématique puissant.**

**Lights_Out** est une adaptation moderne du célèbre jeu de réflexion électronique des années 90. Ce projet explore la logique de voisinage et la résolution de systèmes d'équations linéaires à travers une interface fluide et un algorithme de résolution automatique.

🔗 **[Jouer en ligne](https://cnuddematteo.github.io/lights-out-ai/)** ---

## 🎮 Concept du Jeu

Le plateau est une grille de 5x5 lumières. 
* **Le but :** Éteindre toutes les lumières du plateau.
* **La règle :** Appuyer sur une lumière bascule son état (On/Off) ainsi que celui de ses quatre voisines directes (Haut, Bas, Gauche, Droite) en forme de croix.



---

## 🤖 L'Intelligence Artificielle (The Solver)

La particularité de cette version est l'intégration d'un **Solver** capable de trouver la solution optimale depuis n'importe quelle configuration. 

Contrairement à une approche par force brute (qui nécessiterait $2^{25}$ tests), ce projet utilise l'**élimination de Gauss-Jordan** sur le corps fini $\mathbb{F}_2$. Le jeu est modélisé comme un système d'équations :

$$A \mathbf{x} = \mathbf{b}$$

Où :
* **A** est la matrice d'adjacence (625 entrées pour une grille 5x5).
* **b** est l'état actuel de la grille.
* **x** est le vecteur solution (quelles cases presser).

---

## ✨ Fonctionnalités

* **Garantie de solvabilité :** L'algorithme de génération ne propose que des puzzles mathématiquement résolubles.
* **Mode IA / Hint :** Visualisation de la solution étape par étape grâce au solveur intégré.
* **Design Cyber-Cyber :** Interface en Glassmorphism avec effets néon réactifs.
* **Mobile First :** Entièrement jouable sur smartphone.

---

## 🛠️ Stack Technique

* **Core :** Vanilla JavaScript (ES6+).
* **UI :** HTML5 / CSS3 (Grid & Flexbox).
* **Maths :** Implémentation manuelle du calcul matriciel binaire.

---

## 🚀 Installation

1. **Cloner le dépôt :**
   ```bash
   git clone [https://github.com/cnuddeMatteo/lights_out-ai.git](https://github.com/cnuddeMatteo/lights_out-ai.git)
