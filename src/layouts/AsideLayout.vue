

<template>
  <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
    <div class="drawer-header">
      <div class="image-container">
        <img
          :src="getMinecraftSkinUrl(userData.username)"
          class="user-avatar"
        />
      </div>
      <q-item-label header style="font-size: 25px; text-align: center">
        AvC Latin
      </q-item-label>
    </div>

    <q-list
      style="
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      "
      class="menu-list"
    >
      <div>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          :onClick="
            link.title === 'Crear'
              ? showCreatePostDialog
              : link.title === 'Perfil'
              ? toProfile
              : null
          "
          v-bind="link"
        />
      </div>

      <!-- Este div se asegura que el botón quede al final del todo en el drawer -->
      <div class="logout-button">
        <q-btn icon="exit_to_app" color="negative" @click="logout" />
      </div>
    </q-list>

    <!-- Incluye el diálogo en tu template -->
    <CreatePostDialog
      v-model="isDialogVisible"
      :show="isDialogVisible"
      @update:show="isDialogVisible = $event"
    />
  </q-drawer>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import { useUserStore } from "../stores/userStore";
import EssentialLink from "components/EssentialLink.vue";
import CreatePostDialog from "pages/NewPost.vue"; // Importa el diálogo
import { useRouter } from "vue-router";
const linksList = [
  {
    title: "Inicio",
    icon: "home",
    link: "/explorer",
  },
  {
    title: "Buscar",
    icon: "search",
    link: "/search",
  },
  {
    title: "Explorar",
    icon: "explore",
    link: "/explorer",
  },
  {
    title: "Shorts",
    icon: "movie",
    link: "/shorts",
  },
  {
    title: "Perfil",
    icon: "person",
    link: "/profile",
  },
  {
    title: "Mensajes",
    icon: "email",
    link: "/messages-list",
  },
  {
    title: "Crear",
    icon: "add_circle_outline",
    link: "/create",
  },
];

export default {
  components: {
    EssentialLink,
    CreatePostDialog, // Añade el diálogo a los componentes
  },
  setup() {
    const userStore = useUserStore();
    const leftDrawerOpen = ref(false);
    const isDialogVisible = ref(false); // Propiedad para controlar la visibilidad del diálogo
    const router = useRouter();
    const userData = ref({
      username: "",
      bio: "",
      image: "",
      followers: false,
      following: false,
    });

    onMounted(async () => {
      const id = JSON.parse(localStorage.getItem("user")).id;
      userData.value = await userStore.getUserById({ id });
    });
    const getMinecraftSkinUrl = (username) => {
      return `https://minotar.net/avatar/${username}`;
    };

    const showCreatePostDialog = () => {
      // Método para mostrar el diálogo
      isDialogVisible.value = true;
    };

    const toProfile = () => {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      router.push("/profile/" + userId);
    };

    const logout = () => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      console.log("Usuario ha cerrado sesión");
      router.push("/login");
    };

    return {
      userData,
      essentialLinks: linksList,
      leftDrawerOpen,
      isDialogVisible, // Devuelve la propiedad del diálogo
      showCreatePostDialog, // Devuelve el método del diálogo
      toProfile,
      getMinecraftSkinUrl,
      logout,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>
<style>
.image-container {
  text-align: center;
}

.user-avatar {
  border-radius: 50%;
}

.drawer-header {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logout-button {
  padding: 10px;
  text-align: center;
}

.q-drawer--left.q-drawer--bordered {
  border: none;
}

.menu-list {
  background-color: #eeebeb;
  border-radius: 20px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>