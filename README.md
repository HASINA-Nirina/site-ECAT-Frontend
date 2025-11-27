# ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)

# site-ECAT-Frontend

## Description du projet

Le projet **site-ECAT-Frontend** est une application web développée avec **Next.js**, **TypeScript** et **React**. Il est conçu pour fournir une interface utilisateur pour la gestion des étudiants et des ressources éducatives. Ce projet permet aux utilisateurs de s'inscrire, de se connecter, de gérer leur compte et d'accéder à divers services tels que l'achat de livres et la consultation de rapports.

### Fonctionnalités clés
- Inscription et connexion des utilisateurs
- Gestion des comptes étudiants
- Achat de livres
- Consultation de rapports
- Interface administrateur pour la gestion des utilisateurs et des ressources

## Stack technique

| Technologie      | Description                                      |
|------------------|--------------------------------------------------|
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) | Framework React pour le rendu côté serveur     |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | Superset de JavaScript pour une meilleure typage |
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | Bibliothèque JavaScript pour construire des interfaces utilisateur |

## Instructions d'installation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Guide d'installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/HASINA-Nirina/site-ECAT-Frontend.git
   cd site-ECAT-Frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

3. Configurez les variables d'environnement si nécessaire. Créez un fichier `.env.local` à la racine du projet et ajoutez les variables requises.

4. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```
   ou
   ```bash
   yarn dev
   ```

## Utilisation

Une fois le serveur en cours d'exécution, vous pouvez accéder à l'application à l'adresse [http://localhost:3000](http://localhost:3000). 

### Exemples d'utilisation
- Pour vous inscrire, accédez à la page d'inscription.
- Pour vous connecter, utilisez la page de connexion.
- Les fonctionnalités de gestion des comptes et d'achat de livres sont accessibles depuis le tableau de bord étudiant.

## Structure du projet

Voici un aperçu de la structure du projet :

```
site-ECAT-Frontend/
├── public/                  # Contient les fichiers statiques (images, icônes, etc.)
├── src/                     # Contient le code source de l'application
│   ├── app/                 # Dossier principal pour les pages et composants
│   │   ├── admin/           # Fonctionnalités administratives
│   │   ├── AlocalRegister/   # Page d'enregistrement local
│   │   ├── Etudiant/        # Fonctionnalités liées aux étudiants
│   │   ├── ForgotPassword/  # Gestion de la réinitialisation de mot de passe
│   │   ├── login/           # Page de connexion
│   │   ├── globals.css      # Styles globaux
│   │   ├── layout.tsx       # Mise en page principale de l'application
│   │   └── page.tsx         # Point d'entrée principal
├── .gitignore               # Fichiers à ignorer par Git
├── package.json             # Dépendances et scripts du projet
└── tsconfig.json            # Configuration TypeScript
```

### Explication des fichiers principaux
- **public/** : Contient des fichiers accessibles publiquement, comme les images et les icônes.
- **src/app/** : Contient toutes les pages et composants de l'application, organisés par fonctionnalité.
- **globals.css** : Fichier de styles globaux appliqués à l'ensemble de l'application.
- **layout.tsx** : Définit la mise en page de l'application, utilisée par toutes les pages.

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer, veuillez suivre ces étapes :
1. Forkez le projet.
2. Créez votre branche (`git checkout -b feature/YourFeature`).
3. Commitez vos modifications (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. Poussez votre branche (`git push origin feature/YourFeature`).
5. Ouvrez une pull request.

Nous vous remercions de votre intérêt pour le projet !
