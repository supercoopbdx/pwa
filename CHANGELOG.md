# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Versioning Sémantique](https://semver.org/lang/fr/).

---

## [0.4.3] - 2026-04-09

### Ajouts
- Page d'accueil repensée : bouton de connexion centré, sans menu hamburger (affiché uniquement après connexion)
- Déconnexion déplacée exclusivement dans le menu hamburger (avec nom d'utilisateur)
- Page de scan produit (`/scan`) accessible depuis le menu (dernière entrée)
- Scanner : détection native `BarcodeDetector` (Chrome/Chromium) avec fallback automatique sur ZXing JS
- Scanner : overlay de debug affichant le décodeur actif (natif vs JS), le nombre de scans et le dernier code-barres détecté
- HTTPS en développement local via `@vitejs/plugin-basic-ssl` pour permettre l'accès caméra sur le réseau local
- Proxy Vite complet pour les endpoints OIDC et backend (tests sur téléphone sans mixed-content)
- Inventaire : affichage du numéro de soumission et message quand deux inventaires sont disponibles pour comparaison

### Modifications
- `vite.config.js` : activation HTTPS, `host: true` pour l'exposition réseau, proxy avec clés de chemin simples

---

## [0.4.2] - 2026-03-25

### Corrigé
- Réception : suppression du prefetch d'images sur la page liste des commandes (gel de l'application au chargement)
- Réception : correction des champs `parcels` et `packSize` envoyés au backend (quantités toujours à 1 dans le CSV)

---

## [0.4.1] - 2026-03-22

### Corrigé
- Remplacement des textes lorem ipsum par des descriptions fonctionnelles
- Remplacement de "joker" par "coordo" dans le message d'alerte réception
- Externalisation des textes hardcodés de la page produits réception vers `fr.json`
- Mise à jour axios 1.12 → 1.13.6 (CVE prototype pollution)
- Mise à jour vite-plugin-pwa 0.21 → 1.2.0 et @vite-pwa/assets-generator 0.2 → 1.0.2
- Override serialize-javascript → 7.0.4 (CVE RCE via workbox-build)

---

## [0.4.0] - 2026-03-20

### Ajouté
- Réception : affichage de l'unité réelle des produits (unités/kg/litre)
- Scan : mutualisation de l'écran de scan en composant partagé

### Corrigé
- Réception : affichage du colisage dans le formulaire d'erreur

### Refactorisé
- Renommage complet : `inbound` → `reception` dans tout le code
- Renommage complet : `order/orders` → `commande/commandes`
- Renommage complet : `stock` → `inventaire`

---

## [0.3.8] - 2026-03-14

### Corrigé
- Prefetch des images utilise désormais axios avec le cache partagé
- Récupération des images via axios pour inclure le Bearer token (correction erreur 401)
- Affichage du placeholder quand une image ne charge pas (gestionnaire `@error`)

---

## [0.3.7] - 2026-03-14

### Corrigé
- Stock : utilise `image_url` fournie par le backend pour les images produit
- Inbound : utilise `image_url` directement (alignement avec le backend)
- Inbound : mapping `image_url` → `image` dans la réponse backend
- Scanner : import de `NotFoundException` depuis `@zxing/library`
- Inbound : préfixe les URLs d'images avec le `baseURL` du backend
- Scanner : remplacement de `BarcodeDetector` + polyfill par **ZXing** (meilleure compatibilité)
- Stock : correction de l'état de chargement dans `StockFormPage`
- Router : ajout de `requiresAuth` sur la route `stock-scan`
- Types : ajout du champ `is_already_processed` dans `MappedInboundOrder`
- Remplacement des `alert()` bloquants par des toasts non-bloquants ; suppression des fichiers JS legacy
- Correction du doublon `tailwindcss()` dans `vite.config.js`
- Correction du nom de la variable `VITE_BACKEND_BASEURL` dans `.env.example`

---

## [0.3.6] - 2026-03-14

### Ajouté
- Affichage du numéro de version en bas de chaque page
- Inbound : prefetch des images pour les commandes visibles + alerte produits sans code barre
- Inbound : lazy loading avec placeholder sur les images produit

---

## [0.3.5] - 2026-03-14

### Ajouté
- Bouton de chargement lors de l'envoi d'une commande
- Visualisation des commandes déjà traitées (affichées en gris avec une icône "check") avec possibilité de les retraiter
- Renommage de l'application en **Supercoop App** / **SuperApp** sur les raccourcis

### Sécurité
- Suppression du `.npmrc` exposé dans le dépôt
- Remplacement de `npm install` par `npm ci` dans la CI (installation propre)
- Désactivation de l'exécution automatique des scripts npm lors de l'installation de paquets

### CI/CD
- Correction des variables d'environnement de déploiement (vars vs secrets)
- Correction du déclencheur : passage de `push` à `release` pour le déploiement

---

## [0.3.x] - Historique antérieur

### Ajouté
- Authentification avec axios et intercepteur pour l'ajout du `access_token`
- Scanner de code barre personnalisé (BarcodeDetection API + polyfills, puis migré vers ZXing)
- Module réception : liste des commandes, détail produit, page de scan, formulaire d'erreur produit
- Module stock : liste en vue mobile, formulaire de correction, page par zone
- Menu de navigation, page 404
- Internationalisation (i18n) et routing
- Mise en place du projet PWA avec Vite + Vue + Tailwind CSS
- Déploiement via GitHub Actions
