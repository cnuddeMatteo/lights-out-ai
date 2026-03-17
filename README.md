# 💡 Lights_Out

> **Un puzzle binaire minimaliste où chaque clic change la donne.**

**Lights_Out** est une adaptation moderne du célèbre jeu de réflexion électronique des années 90. Ce projet explore la logique de voisinage et la résolution de systèmes d'équations linéaires à travers une interface fluide et réactive.

🔗 **[Jouer en ligne](#)** *(Insère ton lien GitHub Pages ici)*

---

## 🎮 Concept du Jeu

Le plateau est une grille de 5x5 lumières. Au début, un nombre aléatoire de lumières est allumé. 
* **Le but :** Éteindre toutes les lumières du plateau.
* **La règle :** Appuyer sur une lumière bascule son état (On/Off) ainsi que celui de ses quatre voisines directes (Haut, Bas, Gauche, Droite) en forme de croix.



---

## ✨ Fonctionnalités

* **Algorithme de génération :** Chaque partie commence par une configuration aléatoire **garantie solvable**.
* **Interface Responsive :** Design moderne de type "Neon-Glassmorphism" s'adaptant aux mobiles.
* **Statistiques :** Compteur de mouvements et chronomètre pour suivre vos performances.
* **Niveaux de difficulté :** Options pour varier la taille de la grille ou la complexité initiale.

---

## 🛠️ Stack Technique

* **Langages :** HTML5, CSS3, JavaScript (ES6+).
* **Rendu :** Manipulation dynamique du DOM (Grid Layout).
* **Algorithmique :** Gestion des états binaires par masques de voisinage.

---

## 🧬 Le Défi Mathématique (Cyber & Math)

D'un point de vue mathématique, **Lights Out** peut être modélisé comme un système d'équations linéaires sur le corps fini $\mathbb{F}_2$ (algèbre booléenne).

Chaque pression sur une case $i$ est représentée par un vecteur de changement $v_i$. On cherche une combinaison de pressions $x$ telle que :

$$A \mathbf{x} = \mathbf{b}$$

Où :
* $A$ est la matrice de voisinage.
* $\mathbf{b}$ est la configuration initiale du plateau.
* $\mathbf{x}$ est le vecteur solution (quelles cases presser).

---

## 🚀 Installation

1. **Cloner le dépôt :**
   ```bash
   git clone [https://github.com/cnuddeMatteo/lights_out.git](https://github.com/cnuddeMatteo/lights_out.git)
