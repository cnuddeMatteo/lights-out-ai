## 📂 Architecture du Projet

Une structure **Vanilla JS** propre et modulaire, idéale pour un portfolio performant :

```text
lights_out-ai/
├── index.html          # Structure HTML et interface utilisateur
├── style.css           # Design Neon-Glassmorphism (CSS Moderne)
├── script.js           # Moteur du jeu, gestion des clics et événements
├── solver.js           # IA : Résolution par élimination de Gauss-Jordan (Maths)
└── README.md           # Documentation technique et mathématique
```

-----

## 📄 Contenu du README.md

````markdown
# 💡 Lights_Out AI

> **Un puzzle binaire minimaliste doublé d'un solveur mathématique puissant.**

**Lights_Out** est une adaptation moderne du célèbre jeu de réflexion électronique des années 90. Ce projet explore la logique de voisinage et la résolution de systèmes d'équations linéaires à travers une interface fluide et un algorithme de résolution automatique par intelligence artificielle.

🔗 **[Jouer en ligne](https://cnuddematteo.github.io/lights-out-ai/)**

---

## 🎮 Concept du Jeu

Le plateau est une grille de 5x5 lumières. Au démarrage, une configuration aléatoire est générée.
* **Le but :** Éteindre toutes les lumières du plateau (passer à l'état "Sombre").
* **La règle :** Appuyer sur une lumière bascule son état (On/Off) ainsi que celui de ses quatre voisines directes (Haut, Bas, Gauche, Droite) suivant un motif en croix.

---

## 🤖 L'Intelligence Artificielle (The Solver)

La particularité de cette version est l'intégration d'un **Solver** capable de trouver la solution optimale depuis n'importe quelle configuration. 

Plutôt que d'utiliser une recherche par force brute ($2^{25}$ combinaisons), ce projet implémente l'**élimination de Gauss-Jordan** sur le corps fini $\mathbb{F}_2$ (algèbre booléenne). Le jeu est modélisé comme un système d'équations :

$$A \mathbf{x} = \mathbf{b}$$

Où :
* **A** est la matrice d'adjacence représentant les règles du jeu.
* **b** est le vecteur d'état actuel de la grille.
* **x** est le vecteur solution indiquant les cases sur lesquelles cliquer.

---

## ✨ Fonctionnalités

* **Garantie de solvabilité :** L'algorithme de génération assure que chaque puzzle proposé possède au moins une solution.
* **IA / Hint :** Visualisation de la solution mathématique en temps réel.
* **Design Cyber-Néon :** Esthétique "Glassmorphism" avec effets de lumière réactifs.
* **Statistiques :** Suivi du compteur de mouvements et du chronomètre.

---

## 🛠️ Stack Technique

* **Langages :** HTML5, CSS3, JavaScript (ES6+).
* **Rendu :** Manipulation dynamique du DOM (CSS Grid Layout).
* **Algorithmique :** Implémentation manuelle du calcul matriciel binaire pour le solveur.

---

## 🚀 Installation

1. **Cloner le dépôt :**
   ```bash
   git clone [https://github.com/cnuddeMatteo/lights_out-ai.git](https://github.com/cnuddeMatteo/lights_out-ai.git)
````

2.  **Lancer le jeu :**
    Ouvrez simplement le fichier `index.html` dans votre navigateur web préféré.

-----

## 👤 Auteur

**Mattéo Cnudde** - *Étudiant en Cybersécurité & Développeur*

  * [GitHub](https://github.com/cnuddeMatteo)
  * [LinkedIn](https://www.google.com/search?q=%23)

> *"L'obscurité est l'état final de la logique."*

```


Souhaites-tu que je t'aide à rédiger le **LinkedIn post** parfait pour annoncer la sortie de ton portfolio `Cyber_Nexus` ?
```
