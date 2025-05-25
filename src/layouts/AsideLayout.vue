

<template>
    <q-drawer  v-model="leftDrawerOpen" show-if-above bordered>
      <div class="drawer-header">
        <div class="image-container">
          <img :src="getMinecraftSkinUrl(userData.username)" class="user-avatar" />
        </div>
        <q-item-label header style="font-size: 25px; text-align: center">AvC Latin</q-item-label>
      </div>

      <q-list class="menu-list" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
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
            :active="isActive(link.link)"
          />
        </div>

        <!-- Este div se asegura que el botón quede al final del todo en el drawer -->
        <div class="logout-button">
          <q-btn icon="exit_to_app" color="negative" @click="confirmLogout" />
        </div>
      </q-list>

      <!-- Incluye el diálogo en tu template -->
      <CreatePostDialog v-model="isDialogVisible" :show="isDialogVisible" @update:model-value="handlePostCreated" />

      <!-- Diálogo de confirmación para cerrar sesión -->
      <q-dialog v-model="confirmLogoutDialog">
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <q-icon name="warning" color="negative" size="40px" />
            <div class="q-ml-sm">¿Estás seguro de que quieres cerrar sesión?</div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn flat label="Cerrar sesión" color="negative" @click="logout" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-drawer>
</template>


<script>
import { ref, onMounted, nextTick } from "vue";
import { useUserStore } from "../stores/userStore";
import { useQuasar } from "quasar";
import EssentialLink from "components/EssentialLink.vue";
import CreatePostDialog from "pages/NewPost.vue"; // Importa el diálogo
import { useRouter, useRoute } from "vue-router";
const linksList = [
  {
    title: "Inicio",
    icon: "home",
    link: "/home",
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
    title: "Guia",
    icon: "movie",
    link: "/guide",
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
    title: "Store",
    icon: "store",
    link: "/store",
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
  setup(props, { emit }) {
    const userStore = useUserStore();
    const leftDrawerOpen = ref(false);
    const isDialogVisible = ref(false); // Propiedad para controlar la visibilidad del diálogo
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();
    const confirmLogoutDialog = ref(false); // Controla el diálogo de confirmación
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

    const handlePostCreated = ($event) => {
      isDialogVisible.value = $event
      emit('update:show', true);
    };
    const getMinecraftSkinUrl = (username) => {
      return `https://minotar.net/avatar/${username}`;
    };

    const showCreatePostDialog = () => {
      // Método para mostrar el diálogo
      isDialogVisible.value = true;
    };

    // Mostrar el diálogo de confirmación
    const confirmLogout = () => {
      confirmLogoutDialog.value = true;
    };

    const toProfile = () => {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      router.push("/profile/" + userId);
    };

    // Computada para verificar si el enlace es activo
    const isActive = (link) => {
      return route.path === link;
    };

    const logout = async () => {
      try {
        // Llama a un endpoint de backend para invalidar el token si es necesario
        await userStore.logout(); // Puedes implementar este método en el store

        // Limpia el almacenamiento local
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");

        // Redirige al usuario a la página de login
        router.push("/");

        // Notificación de éxito
        $q.notify({
          color: "green-5",
          textColor: "white",
          icon: "logout",
          message: "Has cerrado sesión correctamente.",
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "error",
          message: "Error al cerrar sesión.",
        });
      }
    };

    return {
      userData,
      essentialLinks: linksList,
      leftDrawerOpen,
      isDialogVisible, // Devuelve la propiedad del diálogo
      showCreatePostDialog, // Devuelve el método del diálogo
      toProfile,
      confirmLogoutDialog, // Controla el diálogo de confirmación
      getMinecraftSkinUrl,
      confirmLogout, // Método para mostrar el diálogo
      logout,
      handlePostCreated,
      isActive, // Computada para verificar el enlace activo
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
  background-color: #2c3e50; /* Fondo del drawer, utilizando el color principal de la paleta */
}

.menu-list {
  background-color: #34495e; /* Fondo de la lista de menú dentro del drawer, más oscuro para dar contraste */
  border-radius: 20px;
  margin-left: 10px;
  margin-right: 10px;
}

.q-item {
  color: #ecf0f1; /* Color de texto claro para que sea legible sobre el fondo oscuro */
}

.logout-button q-btn {
  color: #ecf0f1;
}

.q-item--active{
  background-color: #566573
}
</style>
