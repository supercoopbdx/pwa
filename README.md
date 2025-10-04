# Supercoop PWA

Application web pour gérer les stocks du magasin Supercoop.  

## Fonctionnalités

### Inventaire

Permet de faire l'inventaire par zone du magasin.  
Les articles sont scannés (ou le code barre est saisi manuellement) puis comptés et envoyés au backend pour traitement.

### Réception (WIP)

Permet de réceptionner les commandes fournisseurs à leur arriver en magasin.

## Développement 

### Installation

```shell
$ npm install
```

### Configuration

Copier le fichier `.env.example` vers `.env` puis saisir les valeurs souhaitées

### Démarrage

```shell
$ npm dev
```

On peut ensuite accéder à l'application sur [localhost:5173/](http://localhost:5173/)

## Déploiement 

Le déploiement de la branche `main` est automatique sur [Github Pages](https://docs.github.com/fr/pages), via [un workflow Github Actions](.github/workflows/build-deploy.yml).  

### Worflow

Le workflow comporte 2 phases :
- **build** qui déclenche le build via npm
- **deploy** qui va commit le résultat du build dans la branche `gh-pages`

### Github Pages

Github Pages est configuré pour déployer automatiquement le contenu de la branche `gh-pages` à l'adresse suivante [supercoopbdx.github.io/pwa](https://supercoopbdx.github.io/pwa)

## Dépendances (docs)

- [Vue](https://vuejs.org/guide/)
- [Pinia](https://pinia.vuejs.org/core-concepts/)
- [Vite](https://vite.dev/guide/)
- [Vite PWA plugin](https://vite-pwa-org.netlify.app/guide/)
- [Tailwindcss](https://tailwindcss.com/docs/installation/using-vite)
- [oidc-client-ts](https://authts.github.io/oidc-client-ts/)
