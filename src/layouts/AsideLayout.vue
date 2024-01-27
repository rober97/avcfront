<template>
  <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
    <q-list style="display: flex; flex-direction: column; height: 100%">
      <div>
        <q-item-label header style="font-size: 25px; text-align: center">
          AvC Latin
        </q-item-label>

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

        <q-separator spaced></q-separator>
      </div>

      <!-- Esto se posicionará al final del drawer -->
      <div style="margin-top: auto; margin-bottom: 20px" class="text-center">
        <q-btn icon="logout" color="negative" @click="logout" />
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
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import CreatePostDialog from "pages/NewPost.vue"; // Importa el diálogo
import { useRouter } from "vue-router";
const linksList = [
  {
    title: "Inicio",
    icon: "school",
    link: "/explorer",
  },
  {
    title: "Buscar",
    icon: "school",
    link: "/search",
  },
  {
    title: "Explorar",
    icon: "school",
    link: "/explorer",
  },
  {
    title: "Perfil",
    caption: "",
    icon: "school",
    link: "/",
  },
  {
    title: "Mensajes",
    caption: "",
    icon: "school",
    link: "/messages-list",
  },
  {
    title: "Crear",
    caption: "",
    icon: "school",
    link: "/",
  },
];
export default defineComponent({
  components: {
    EssentialLink,
    CreatePostDialog, // Añade el diálogo a los componentes
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const isDialogVisible = ref(false); // Propiedad para controlar la visibilidad del diálogo
    const router = useRouter();

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
      essentialLinks: linksList,
      leftDrawerOpen,
      isDialogVisible, // Devuelve la propiedad del diálogo
      showCreatePostDialog, // Devuelve el método del diálogo
      toProfile,
      logout,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
