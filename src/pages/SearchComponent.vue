<template>
  <q-page class="feed-section q-ma-md">
    <AsideLayout />
    <div class="search-section">
      <q-input
        v-model="searchQuery"
        filled
        placeholder="Buscar usuario"
        @input="searchUsers"
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
import AsideLayout from "layouts/AsideLayout.vue";
import { useRouter, useRoute } from "vue-router";

export default {
  components: {
    AsideLayout,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const searchQuery = ref("");
    const users = ref([]);
    const userStore = useUserStore();

    const searchUsers = async () => {
      if (searchQuery.value.length >= 3) {
        // Realiza tu lógica de búsqueda, por ejemplo:
        // users.value = await api.searchUsers(searchQuery.value);
      }
    };

    const selectUser = (user) => {
      // Lógica cuando un usuario es seleccionado
      toProfile(user);
    };

    const loadUsers = async () => {
      // Lógica para cargar usuarios, por ejemplo:
      users.value = await userStore.getListUsers();
    };

    const toProfile = (user) => {
      router.push("/profile/" + user._id);
    };

    // Función para obtener la URL del skin de Minecraft
    const getMinecraftSkinUrl = (username) => {
      return `https://minotar.net/avatar/${username}`;
    };

    // Función para manejar el error al cargar la imagen
    const onImageError = (event) => {
      event.target.src = require("../resources/steve.png");
    };

    // Llama a loadUsers en la carga del componente
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
<style scoped>
.search-input {
  max-width: 600px;
  margin: 0 auto 20px;
}

.user-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.user-card {
  cursor: pointer;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  transition: box-shadow 0.3s;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
    rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
  background-image: linear-gradient(to bottom, #4a8b96, #bcd4d6);
}

.user-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.avatar-large {
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  position: relative;
  overflow: hidden;
}

.avatar-large img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.q-avatar__content {
  height: 100%;
}

.name-section {
  text-align: center;
  font-size: 16px;
}

.name-cont {
  height: 50px;
  align-content: center;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.image-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-image: linear-gradient(to bottom, #4a8b96, #bcd4d6);
}
</style>
