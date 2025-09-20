<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const { user, isAuthenticated } = storeToRefs(authStore);

const login = () => {
  authStore.login();
};

const logout = () => {
  authStore.logout();
};
</script>

<template>
  <div class="auth-buttons flex items-center gap-2">
    <template v-if="isAuthenticated && user">
      <div class="user-info-container hidden md:flex flex-col items-end mr-3">
        <span class="user-greeting">Bonjour, </span>
        <span class="user-name">{{ user.name || user.email || 'Utilisateur' }}</span>
      </div>
      <!-- Desktop: bouton texte -->
      <button
        @click="logout"
        class="btn btn-secondary hidden md:inline-flex"
      >
        Se déconnecter
      </button>
      <!-- Mobile: icône logout -->
      <button
        @click="logout"
        class="btn-info md:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7" />
        </svg>
      </button>
    </template>

    <template v-else>
      <!-- Desktop: bouton texte -->
      <button
        @click="login"
        class="btn btn-primary hidden md:inline-flex"
      >
        Se connecter
      </button>
      <!-- Mobile: icône login -->
      <button
        @click="login"
        class="btn-info md:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 12h14M12 5l7 7-7 7" />
        </svg>
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

/* Bouton icône mobile */
.btn-info {
  background-color: #3b82f6;
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0.5rem;
}

.btn-info:hover {
  background-color: #2563eb;
}

.btn-info svg {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
