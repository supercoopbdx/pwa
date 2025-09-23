<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.js';

const authStore = useAuthStore();
const { user, isAuthenticated } = storeToRefs(authStore);

const login = () => authStore.login();
const logout = () => authStore.logout();
</script>

<template>
  <div class="auth-buttons flex items-center gap-2">
    <!-- Utilisateur connecté -->
    <template v-if="isAuthenticated && user">
      <!-- Info utilisateur desktop -->
      <div class="user-info-container hidden md:flex flex-col items-end mr-3">
        <span class="user-greeting">Bonjour, </span>
        <span class="user-name">{{ user.name || user.email || 'Utilisateur' }}</span>
      </div>

      <!-- Desktop: bouton texte logout -->
      <button
        @click="logout"
        class="btn btn-secondary hidden md:inline-flex"
      >
        Se déconnecter
      </button>

    </template>

    <!-- Utilisateur non connecté -->
    <template v-else>
      <!-- Desktop: bouton texte login -->
      <button
        @click="login"
        class="btn btn-primary hidden md:inline-flex"
      >
        Se connecter
      </button>
    </template>
  </div>
</template>

<style scoped>
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-info-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 0.75rem;
}

.user-greeting {
  font-size: 0.875rem;
  color: #4b5563;
}

.user-name {
  font-weight: 600;
  color: #111827;
}

/* Bouton texte */
button.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #10b981;
  color: white;
}

.btn-primary:hover {
  background-color: #059669;
}

.btn-secondary {
  background-color: #ef4444;
  color: white;
}

.btn-secondary:hover {
  background-color: #dc2626;
}

</style>
