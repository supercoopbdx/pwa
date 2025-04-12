export default {
  nav: {
    home: 'Inventaire Supercoop',
    list: 'Zone {zone}',
    scan: 'Scanner un code-barre',
    form: 'Comptage produit',
    send: 'Envoi de la liste',
  },
  button: {
    back: 'Retour',
    back_to_home: "Retour à l'accueil",
    send_list: 'Envoyer la liste',
    scan_barcode: 'Scanner un code-barre',
    manual_input: 'Saisie manuelle',
    submit: 'Valider',
    remove: 'Supprimer',
    send_confirm: "Confirmer l'envoi",
    reset: 'Réinitialiser',
  },
  home: {
    introduction: "Bienvenue sur la fonction inventaire de l'application SUPERCOOP.",
    instructions: {
      title: "Pour bien l'utiliser :",
      zone_number:
        'Identifie le n° de la zone à inventorier et saisie la dans le champ "Numéro de la zone"',
      scan: 'Appui sur le bouton "Scanner un Code Barre" et scanne chaque produit à inventorier en saisissant la quantité effectivement comptée.',
      manual: "Si le Code Barre n'est pas lu, tu as la possibilité de le saisir manuellement.",
      send: 'Une fois le comptage de la zone terminé, tu peux envoyer le rapport à l\'aide du bouton "Envoyer la liste"',
    },
    good_luck: 'Bon comptage !!!',
    zone_number: 'Numéro de la zone',
    zone_error: 'La zone doit être un numéro à 3 chiffres',
    start: "Démarrer l'inventaire",
    continue: "Reprendre l'inventaire",
  },
  list: {
    zone_number: 'Numéro de la zone',
    barcode: 'Code-barre',
    quantity: 'Quantité',
    empty: 'La liste est vide',
    reset: 'Vous êtes sur le point de vider la liste',
  },
  scan: {
    loading: 'Chargement de la caméra',
  },
  form: {
    barcode: 'Code-barre',
    barcode_error: 'Le code-barre doit être un nombre à 13 chiffres',
    quantity: 'Quantité',
    quantity_error: 'La quantité doit être un nombre',
  },
  send: {
    confirmation:
      "Vous êtes sur le point d'envoyer la liste, êtes-vous certain que c'est ce que vous voulez faire ?",
  },
}
