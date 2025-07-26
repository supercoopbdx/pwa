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
  <div class="auth-buttons">
    <template v-if="isAuthenticated && user">
      <div class="user-info-container">
        <span class="user-greeting">Bonjour, </span>
        <span class="user-name">{{ user.name || user.email || 'Utilisateur' }}</span>
      </div>
      <div class="auth-actions">
        <button @click="logout" class="btn btn-secondary">Se déconnecter</button>
      </div>
    </template>
    <button v-else @click="login" class="btn btn-primary">Se connecter</button>
  </div>
</template>

<style scoped>
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 0.75rem;
}

.user-greeting {
  font-size: 0.875rem;
  color: #4b5563; /* gray-600 */
}

.user-name {
  font-weight: 600;
  color: #111827; /* gray-900 */
}

.auth-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  border: none;
  cursor: pointer;
}

.btn {
  min-height: 2.5rem;
}

.btn-primary {
  background-color: #10b981; /* emerald-500 */
  color: white;
}

.btn-primary:hover {
  background-color: #059669; /* emerald-600 */
}

.btn-secondary {
  background-color: #ef4444; /* red-500 */
  color: white;
}

.btn-secondary:hover {
  background-color: #dc2626; /* red-600 */
}

.btn-info {
  background-color: #3b82f6; /* blue-500 */
  color: white;
  padding: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-info:hover {
  background-color: #2563eb; /* blue-600 */
}

.btn-info svg {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
