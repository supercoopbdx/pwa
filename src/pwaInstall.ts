import { ref } from 'vue'

// Chrome n'émet `beforeinstallprompt` qu'une fois par chargement de page, parfois
// avant que le bandeau soit monté (ex. pendant le retour de connexion OIDC) :
// on le capte dès le démarrage de l'app et on le garde pour le bandeau.
export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const installPrompt = ref<InstallPromptEvent | null>(null)

export function capturePwaInstallPrompt() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault()
    installPrompt.value = e as InstallPromptEvent
  })
  window.addEventListener('appinstalled', () => {
    installPrompt.value = null
  })
}
