# Support natif de la détection de code-barres (BarcodeDetector API)

L'appli utilise l'API native `BarcodeDetector` quand elle est disponible, et bascule sur la librairie JavaScript **ZXing** en fallback.

## Support par OS / Navigateur

### Natif disponible (`BarcodeDetector`)

| OS | Navigateur | Version minimale |
|---|---|---|
| Android | Chrome | 83+ |
| Android | Samsung Internet | 13+ |
| macOS | Chrome / Edge / Opera | récent |
| ChromeOS | Chrome / Edge / Opera | récent |
| iOS 17 / iOS 26 | Safari | expérimental (flag à activer manuellement, voir ci-dessous) |

### Pas de support natif → fallback ZXing

| OS | Navigateur |
|---|---|
| Tous | Firefox |
| macOS | Safari |
| Windows | Tous |
| Linux | Tous |
| iOS < 17 | Safari |

## Activer BarcodeDetector dans Safari iOS 17 / iOS 26

1. Ouvrir **Réglages**
2. Aller dans **Safari**
3. Défiler jusqu'à **Avancé**
4. Appuyer sur **Indicateurs de fonctionnalités** (Feature Flags)
5. Activer **Shape Detection API**

> **Note :** Cette fonctionnalité est **cassée dans iOS 18** et ne fonctionne pas même avec le flag activé. Les utilisateurs iOS 18 resteront sur le fallback ZXing.

## Remarques

- Les formats supportés sont **dépendants de la plateforme** — utiliser `BarcodeDetector.getSupportedFormats()` pour vérifier à l'exécution (c'est ce que fait la page Debug de l'appli).
- Sur iOS, le flag Safari est rarement activé : la quasi-totalité des utilisateurs iPhone sera en **ZXing**.
- Sur Android avec Chrome, le décodage natif est généralement plus rapide et moins gourmand en CPU.
- L'API nécessite un contexte sécurisé (**HTTPS**).

## Diagnostic

La page **Debug** de l'appli (`/debug`) affiche en temps réel :
- Si `BarcodeDetector` est supporté sur l'appareil
- Les formats natifs disponibles (dont `ean_13`)
- Le user-agent complet pour identifier le couple OS/navigateur
