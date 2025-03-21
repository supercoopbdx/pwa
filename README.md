# Supercoop PWA

Ce projet en Vue a pour objectif de fournir une application pour effectuer l'inventaire périodique du magasin Supercoop via un smartphone

## Développement 

### Installation

```shell
$ npm install
$ npm run dev
```

On peut ensuite accéder à l'application sur [localhost:5174/pwa/](http://localhost:5174/pwa/)

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
- [Vite](https://vite.dev/guide/)
- [Vite PWA](https://vite-pwa-org.netlify.app/guide/)
- [Tailwindcss](https://tailwindcss.com/docs/installation/using-vite)
