<template>
  <q-page class="feed-section q-ma-md">
    <AsideLayout />
    <q-input
      v-model="searchQuery"
      outlined
      placeholder="Buscar usuario"
      @input="searchUsers"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-list bordered separator>
      <q-item
        v-for="user in users"
        :key="user.id"
        clickable
        @click="selectUser(user)"
      >
        <q-item-section avatar>
          <q-avatar>
            <!-- Añadimos el evento onerror para cambiar la imagen en caso de error -->
            <img
              :src="getMinecraftSkinUrl(user.username)"
              @error="onImageError($event)"
              alt="User Avatar"
            />
          </q-avatar>
        </q-item-section>
        <q-item-section @click="toProfile(user)">
          <q-item-label>{{ user.username }}</q-item-label>
          <q-item-label caption>{{ user.email }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
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
