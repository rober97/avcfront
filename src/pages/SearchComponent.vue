<template>
  <q-page class="feed-section q-ma-md">
    <div class="search-section">
      <q-input
        v-model="searchQuery"
        filled
        placeholder="Buscar usuario"
        @update:model-value="searchUsers"
        class="search-input"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="user-cards">
      <div
        v-for="user in users"
        :key="user.id"
        class="user-card"
        @click="selectUser(user)"
      >
        <div class="q-pa-none image-section">
          <img
            :src="getMinecraftSkinUrl(user.username)"
            @error="onImageError($event)"
            alt="User Avatar"
          />
        </div>
        <div class="name-cont">
          <div class="text-h6 name-section">{{ user.username }}</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import fallbackAvatar from "../resources/steve.png";

export default {
  setup() {
    const router = useRouter();
    const searchQuery = ref("");
    const users = ref([]);
    const userStore = useUserStore();

    const searchUsers = async () => {
      if (searchQuery.value.trim() === "") {
        loadUsers();
        return;
      }

      if (searchQuery.value.length >= 3) {
        try {
          users.value = await userStore.searchUsers(searchQuery.value);
        } catch (error) {
          console.error("Error al buscar usuarios:", error);
        }
      }
    };

    const selectUser = (user) => {
      toProfile(user);
    };

    const loadUsers = async () => {
      users.value = await userStore.getListUsers();
    };

    const toProfile = (user) => {
      router.push("/profile/" + user._id);
    };

    const getMinecraftSkinUrl = (username) => {
      return `https://minotar.net/avatar/${username}`;
    };

    const onImageError = (event) => {
      event.target.src = fallbackAvatar;
    };

    loadUsers();

    return {
      searchQuery,
      users,
      searchUsers,
      selectUser,
      toProfile,
      getMinecraftSkinUrl,
      onImageError,
    };
  },
};
</script>

<style>
.feed-section {
  max-width: 1200px;
  margin: 0 auto;
}

.search-input {
  max-width: 600px;
  margin: 0 auto 24px;
}

.user-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 0 0 24px;
  max-height: 85vh;
  overflow-y: auto;
}

.user-card {
  cursor: pointer;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.2);
  background: linear-gradient(180deg, rgba(22, 21, 46, 0.98), rgba(13, 12, 24, 0.98));
}

.user-card:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 168, 67, 0.32);
  box-shadow: 0 24px 44px rgba(0, 0, 0, 0.28);
}

.q-avatar__content {
  height: 100%;
}

.name-section {
  text-align: center;
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 700;
  letter-spacing: 0.4px;
}

.name-cont {
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.image-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 220px;
  background: radial-gradient(circle at top, rgba(212, 168, 67, 0.18), rgba(22, 21, 46, 0.92) 45%, rgba(13, 12, 24, 0.98));
}

.image-section img {
  width: 72%;
  height: 72%;
  object-fit: contain;
  image-rendering: pixelated;
  filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.32));
}

.search-input .q-field__control {
  background: rgba(255, 255, 255, 0.04) !important;
  color: var(--text-primary);
  border: 1px solid var(--border-color-light);
  border-radius: 12px;
  font-weight: 500;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input .q-field__control input::placeholder,
.search-input .q-field__native::placeholder {
  color: var(--text-muted) !important;
  opacity: 1;
}

.search-input .q-field__control:hover,
.search-input .q-field__control:focus-within {
  border-color: rgba(212, 168, 67, 0.24);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.search-input .q-field__label {
  color: var(--text-secondary) !important;
  font-weight: 600;
  text-transform: uppercase;
}

.search-input .q-icon,
.search-input .q-field__native,
.search-input input {
  color: var(--text-primary) !important;
}

.search-input .q-field--float .q-field__label {
  color: var(--gold) !important;
}
</style>
