# Simulation Gatling - Utilisation & Structure

Ce projet permet de lancer des simulations de performance sur différents environnements via Gatling et des scripts Node.js de gestion de token.

---

## 1. Structure des fichiers

- **TokenFetcher.js**  
  Récupère un token d’authentification et le premier SIRET de l’utilisateur pour l’environnement choisi, et les stocke dans `UserState.json`.  
  Appelée avant chaque simulation pour injecter ou réinitialiser les données.

- **UserState.json**  
  Contient le token et le premier siret récupérés. Ce fichier est utilisé durant la simulation. Il peut être vidé automatiquement à la fin.

- **resetUserState.js**  
  Vide le fichier `UserState.json` en fin de simulation (utile pour l’automatisation et garantir la confidentialité des données sensibles).

- **target/dev.js**, **target/uat.js**, **target/preprod.js**  
  Fournissent respectivement la configuration (URL, credentials…) pour l’environnement de développement, UAT (recette), ou préproduction.

- **simulation.ts**  
  Fichier principal de la simulation Gatling, qui va lire le token & siret depuis `UserState.json`.

---

## 2. Lancer la simulation sur les différents environnements

Les scripts du `package.json` facilitent le lancement complet:

### Lancement selon l'environnement

- **Développement (DEV) :**

  ```bash
  npm run run-scenario-dev
  ```

  Cette commande va :
  1. Compiler le code TypeScript,
  2. Générer les fichiers pour Gatling,
  3. Récupérer le token & siret utilisateur pour l'environnement DEV,
  4. Lancer la simulation sur DEV.

- **Recette (UAT) :**

  ```bash
  npm run run-scenario-uat
  ```

  Même logique que pour DEV, mais avec les paramètres de recette/UAT.

- **Préproduction (PREPROD) :**

  ```bash
  npm run run-scenario-preprod
  ```

  Cela lance la simulation avec les accès préprod, puis nettoie le fichier utilisateur à la fin.

### Détails supplémentaires

- **Pour générer un token/siret seulement**:
  
  ```bash
  npm run get-user-state-dev      # pour DEV
  npm run get-user-state-uat      # pour UAT
  npm run get-user-state-preprod  # pour PREPROD
  ```

- **Pour nettoyer seulement le fichier d'état utilisateur**:
  
  ```bash
  npm run clean-user-state
  ```

---

## 3. Dépendances principales

- Node.js >= 18.x
- Gatling CLI (présent dans le PATH)
- Dépendances listées dans `package.json`

---

## 4. Questions courantes

- **J’ai besoin d’ajouter/modifier des variables d'environnement**  
  Va dans les fichiers de configuration du dossier `config/`.

- **J’ai une erreur de token/siret:**
  Utilise un des scripts `npm run get-user-state-...` pour te garantir que `UserState.json` est bien renseigné.

---
