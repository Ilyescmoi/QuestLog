# 🎮 QuestLog

**QuestLog** est une application de gestion de ludothèque personnelle, conçue comme un *"Letterboxd pour les jeux vidéo"*.
L'utilisateur peut gérer sa collection, suivre sa progression, noter ses jeux et garder une trace de ses expériences vidéoludiques.
---

## 🎯 Objectif du Projet

Ce projet est avant tout un **outil d'apprentissage approfondi**.

**Philosophie de développement :**
* **No Magic :** Pas d'ORM (type Prisma/TypeORM), utilisation de **SQL brut** pour comprendre les relations et l'optimisation des requêtes.
* **Architecture Clean :** Séparation stricte des responsabilités (Controller ↔ Service ↔ Repository).
* **Type Safety :** Utilisation stricte de TypeScript (Backend & Frontend).
* **Sécurité :** Compréhension des mécanismes d'Auth (JWT, Hashing, Middleware).

---

## 🛠 Stack Technique

### Backend (API REST)
* **Runtime :** Node.js
* **Framework :** Express.js
* **Langage :** TypeScript (Strict Mode)
* **Base de données :** PostgreSQL
* **Driver BDD :** `pg` (node-postgres) avec gestion de Pool
* **Architecture :** Layered Architecture (Controller / Service / Repository)

### Frontend (Client Web)
* **Framework :** React
* **Build Tool :** Vite
* **Langage :** TypeScript
* **Styling :** (À définir : TailwindCSS ou CSS Modules)

### Outils & DevOps
* **Linter :** ESLint
* **Formatter :** Prettier
* **Client SQL :** TablePlus

---

## 🏗 Architecture Backend

Le projet suit une architecture en couches pour assurer la maintenabilité et la testabilité :

1.  **Routes :** Définition des endpoints API.
2.  **Controllers :** Gestion des requêtes HTTP (Validation input, envoi réponse).
3.  **Services :** Logique métier (Business Logic).
4.  **Repositories :** Communication directe avec la Base de Données (SQL Queries).
5.  **Models :** Interfaces et Types TypeScript représentant les données.

---

## 🚀 Installation & Démarrage
### Pré-requis
* Node.js (v18+)
* PostgreSQL (local)
