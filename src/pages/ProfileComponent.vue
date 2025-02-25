<template>
  <q-page>
    <AsideLayout />
    <div class="profile-section-container">
      <!-- Perfil fijo en la parte superior -->
      <div class="profile-section q-pa-md q-mb-md">
        <div class="q-gutter-md row items-center profile-header">
          <div class="col-auto">
            <q-avatar size="150px" class="profile-avatar">
              <img
                :src="getMinecraftSkinUrl(userData.username)"
                alt="User Avatar"
              />
            </q-avatar>
          </div>
          <div class="col">
            <div class="q-gutter-md row items-center justify-start">
              <div class="col-auto" v-show="showPerfil()">
                <q-btn
                  label="Seguir"
                  color="primary"
                  @click="follow()"
                  v-show="followingBtn"
                />
                <q-btn
                  label="Siguiendo"
                  color="primary"
                  flat
                  @click="unfollow()"
                  v-show="isFollowingBtn"
                />
              </div>
              <div class="col-auto" v-show="showMessage()">
                <q-btn
                  label="Mensaje"
                  color="primary"
                  flat
                  @click="sendMessage"
                />
              </div>
              <div class="col-auto" v-show="checkProfile()">
                <q-btn
                  label="Editar perfil"
                  color="primary"
                  outline
                  @click="editProfile"
                />
              </div>
            </div>
            <div class="profile-stats q-mt-md">
              <span>
                <strong>{{ posts.length }}</strong> publicaciones
              </span>
              <span>
                <strong>{{ userData.followers.length }}</strong> seguidores
              </span>
              <span> <strong>0</strong> seguidos </span>
            </div>
          </div>
        </div>

        <!-- Bio y Username -->
        <div class="profile-info q-mt-md">
          <strong>{{ userData.username }}</strong>
          <div>{{ userData.bio }}</div>
        </div>
      </div>

      <!-- Contenido desplazable -->
      <div class="profile-content-scroll">
        <q-list class="rounded-borders">
          <q-item
            v-for="post in posts"
            :key="post.id"
            class="q-pa-md post-container border-bottom"
          >
            <!-- Botón de tres puntos en la esquina superior derecha -->
            <div class="post-options-btn">
              <q-btn
                color="gray"
                icon="more_vert"
                class="post-options-btn"
              >
                <q-menu auto-close>
                  <q-list style="min-width: 100px">
                    <q-item clickable @click="deletePost(post._id)">
                      <q-item-section class="text-delete" v-show="showButton()"
                        >Eliminar</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <!-- Imagen de la publicación -->
            <div
              v-if="post.imageUrl && post.imageUrl !== 'S/M'"
              class="post-image-container"
            >
              <img
                :src="post.imageUrl"
                :alt="post.description"
                class="post-image"
              />
            </div>

            <!-- Contenido de la publicación -->
            <div class="post-content">
              <q-item-section side top class="q-pt-none custom-icons">
                <q-icon name="favorite_border" />
                <span class="q-ml-xs">{{ post.likes.length }}</span>
                <q-icon name="chat_bubble_outline" class="q-ml-md" />
                <span class="q-ml-xs">{{ post.comments.length }}</span>
              </q-item-section>
              <div class="text-body1 q-my-md">
                {{ post.description }}
              </div>
            </div>
          </q-item>
        </q-list>

        <!-- Loader Trigger -->
        <div ref="loadMoreTrigger" class="row justify-center q-my-md">
          <q-spinner-dots color="primary" v-if="loading" />
        </div>
      </div>
    </div>

    <!-- Diálogo para editar la foto de perfil -->
    <q-dialog v-model="showEditDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar foto de perfil</div>
        </q-card-section>

        <q-card-section>
          <q-file
            v-model="files"
            label="Buscar imagen"
            square
            flat
            counter
            outlined
            clearable
            max-files="1"
            max-file-size="5120000"
            @rejected="onRejected"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <!-- Previsualización de la imagen -->
          <div v-if="imagePreview" class="q-mt-md">
            <q-img :src="imagePreview" style="max-width: 300px">
              <div class="absolute-bottom right q-pa-md">
                <q-btn round icon="clear" color="white" @click="clearImage" />
              </div>
            </q-img>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showEditDialog = false" />
          <q-btn label="Guardar" color="primary" @click="saveProfilePhoto" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo para editar perfil -->
    <q-dialog v-model="showEditProfile">
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar perfil</div>
        </q-card-section>
        <q-card-section>
          <!-- Formulario de edición de perfil -->
          <q-input
            outlined
            type="textarea"
            v-model="userData.bio"
            label="Biografia"
            class="q-mb-md"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showEditProfile = false" />
          <q-btn label="Guardar" color="primary" @click="saveProfile(user)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo para mostrar detalles de una publicación -->
    <q-dialog v-model="showPostDialog">
      <q-card class="post-image-users">
        <q-card-section>
          <div class="action-buttons">
            <q-btn flat icon="more_vert" @click="showActions = !showActions">
              <q-menu v-model="showActions">
                <q-list>
                  <q-item clickable @click="deletePost(selectedPost)">
                    <q-item-section>Eliminar publicación</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <q-img
            :src="selectedPost.imageUrl"
            :alt="selectedPost.description"
            style="max-width: 100%"
          />
          <div class="q-mt-md">{{ selectedPost.description }}</div>
          <div class="q-mt-md">
            <i class="fas fa-heart"></i>&nbsp;
            {{ selectedPost.likes.length }}&nbsp;&nbsp;&nbsp;
            <i class="fas fa-comment"></i>&nbsp;
            {{ selectedPost.comments.length }}
          </div>
        </q-card-section>
        <q-item v-for="comment in selectedPost.comments" :key="comment.id">
          <q-item-section>
            <strong>{{ comment.user.username }}:</strong>
            <span>{{ comment.text }}</span>
          </q-item-section>
        </q-item>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" @click="showPostDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import AsideLayout from "layouts/AsideLayout.vue";
import { useGlobal } from "../stores/global";
import { useIntersectionObserver } from "@vueuse/core";
import { useUserStore } from "../stores/userStore";
import { usePostStore } from "../stores/postStore";
import { ref, onMounted, nextTick, watch } from "vue";
import "font-awesome/css/font-awesome.css";
import { debounce, useQuasar } from "quasar";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
const global = useGlobal();
export default {
  components: {
    AsideLayout,
  },
  setup() {
    const userStore = useUserStore();
    const postStore = usePostStore();
    const posts = ref([]);
    const isFollowingBtn = ref(false);
    const postMenuVisible = ref({}); // Controla la visibilidad de los menús de cada post
    const messageBtn = ref(false);
    const showEditDialog = ref(false);
    const followingBtn = ref(false);
    const loadMoreTrigger = ref(null);
    const currentPage = ref(0);
    const selectedPostId = ref(null); // Almacena el ID de la publicación seleccionada
    const pageSize = ref(10);
    const loading = ref(false);
    const showPostDialog = ref(false);
    const hasMore = ref(true);
    const showNotifs = ref(() => {});
    const route = useRoute();
    const router = useRouter(); // Obtener el objeto router
    const userData = ref({
      username: "",
      bio: "",
      image: "",
      followers: false,
      following: false,
    });
    const showEditProfile = ref(false);
    const editProfile = () => {
      showEditProfile.value = !showEditProfile.value;
    };
    const getMinecraftSkinUrl = (username) => {
      return `https://minotar.net/avatar/${username}`;
    };

    const checkFollow = async () => {
      const id_user = JSON.parse(localStorage.getItem("user")).id;
      const id_user_target = route.params.id;
      if (id_user === id_user_target) {
        isFollowingBtn.value = false;
        messageBtn.value = false;
        followingBtn.value = false;
        return;
      }

      // Supongamos que obtienes los datos del usuario y su lista de seguidores
      const res = await userStore.getUserById({ id: id_user_target });
      messageBtn.value = true;
      debugger
      if (res) {
        if (res.followers.includes(id_user)) {
          isFollowingBtn.value = true;
        } else if (!res.followers.includes(id_user)) {
          followingBtn.value = true;
        }
      }
    };

    const follow = async () => {
      try {
        const targetUserId = route.params.id;
        const id_user = JSON.parse(localStorage.getItem("user")).id;
        // Aquí enviarías el ID del usuario a seguir al backend
        const response = await userStore.follow({
          userId: id_user,
          targetUserId,
        });

        if (response.data.success) {
          followingBtn.value = false; // Actualiza el estado de seguimiento
          isFollowingBtn.value = true;
          userData.value.followers.push(targetUserId);
          // Actualizar la UI, mostrar mensaje, etc.
        }
      } catch (error) {
        console.error(error);
        // Manejar errores (mostrar mensaje, etc.)
      }
    };

    const unfollow = async () => {
      try {
        const targetUserId = route.params.id;
        const id_user = JSON.parse(localStorage.getItem("user")).id;
        // Aquí enviarías el ID del usuario a seguir al backend
        const response = await userStore.unfollow({
          userId: id_user,
          targetUserId,
        });
        if (response.data.success) {
          isFollowingBtn.value = false; // Actualiza el estado de seguimiento
          followingBtn.value = true;
          userData.value.followers = userData.value.followers.filter(
            (item) => item !== targetUserId
          );
        }
      } catch (error) {
        console.error(error);
        // Manejar errores (mostrar mensaje, etc.)
      }
    };

    const showPerfil = () => {
      const idParam = route.params.id;
      const idUser = JSON.parse(localStorage.getItem("user")).id;
      let flag = true;
      
      if (idParam == idUser) {
        flag = false;
      }
      return flag;
    };

    const showMessage = () => {
      const idParam = route.params.id;
      const idUser = JSON.parse(localStorage.getItem("user")).id;
      let flag = true;
      if (idParam == idUser) {
        flag = false;
      }
      return flag;
    };

    const showButton = () => {
      const idParam = route.params.id;
      const idUser = JSON.parse(localStorage.getItem("user")).id;
      let flag = true;
      
      if (idParam != idUser) {
        flag = false;
      }
      return flag;
    };

    const checkProfile = (post) => {
      if (post) {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          console.error("No se pudo obtener el usuario del localStorage.");
          return false;
        }

        const idUser = JSON.parse(storedUser).id;
        const postOwnerId = post.user.id;

        return idUser === postOwnerId;
      }
    };

    const showPostMenu = (post) => {
      selectedPostId.value = post._id; // Actualizamos el ID de la publicación seleccionada
    };

    const deletePost = async (postId) => {
      try {
        // Llama a la función del store para eliminar la publicación
        await postStore.deletePost(postId);

        // Filtra la lista de publicaciones para excluir la eliminada
        posts.value = posts.value.filter(
          (post) => post._id.toString() !== postId.toString()
        );
        $q.notify({
          progress: true,
          message: "Publicación eliminada correctamente!",
          color: "primary",
          multiLine: true,
        });
      } catch (error) {
        console.error("Error al eliminar la publicación:", error);
      }
    };

    const clearImage = () => {
      this.files = null;
      this.imagePreview = null;
    };
    const showPostDetails = (post) => {
      if (post.imageUrl != "S/M") {
        this.selectedPost = post;
        this.showPostDialog = true;
      }
    };

    const sendMessage = () => {
      const id = route.params.id;
      router.push({ path: `/messages/${id}` });
    };

    const loadUser = async () => {
      const id = route.params.id;
      userData.value = await userStore.getUserById({ id });
      await checkFollow();
      posts.value = [];
      hasMore.value = true;
      loading.value = false;
      currentPage.value = 1;
      await loadMorePosts();
    };

    const loadMorePosts = async () => {
      if (!hasMore.value || loading.value) {
        return;
      }

      loading.value = true;
      const id = route.params.id;

      try {
        const config = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
          url: `${global.url_api}/list-post-by-user`,
          params: {
            page: currentPage.value,
            size: pageSize.value,
            id,
          },
        };

        const res = await axios(config);
        posts.value = [...posts.value, ...res.data.posts];

        if (res.data.posts.length < pageSize.value) {
          hasMore.value = false;
        } else {
          currentPage.value++;
        }
      } catch (error) {
        console.error("Error al cargar más publicaciones:", error);
      } finally {
        loading.value = false;
      }
    };

    useIntersectionObserver(loadMoreTrigger, ([{ isIntersecting }]) => {
      if (isIntersecting && hasMore.value) {
        loadMorePosts();
      }
    });

    // Detectar cambios en route.params.id para recargar el usuario
    watch(
      () => route.params.id,
      async (newId, oldId) => {
        
        if (newId !== oldId) {
          await loadUser();
        }
      }
    );

    onMounted(async () => {
      const id = route.params.id;
      userData.value = await userStore.getUserById({ id });
      
      await checkFollow();
    });

    const $q = useQuasar();

    return {
      userData,
      showPostDialog,
      showPostMenu,
      showButton,
      showPostDetails,
      checkFollow,
      messageBtn,
      follow,
      posts,
      showEditDialog,
      sendMessage,
      loadMoreTrigger,
      deletePost,
      showPerfil,
      isFollowingBtn,
      loading,
      followingBtn,
      unfollow,
      clearImage,
      loadMorePosts,
      userStore,
      checkProfile,
      showMessage,
      postStore,
      hasMore,
      selectedPostId,
      currentPage: 1, // Paginación: número de página actual
      pageSize: 5, // Paginación: número de publicaciones por página
      showEditProfile,
      editProfile,
      postMenuVisible,
      getMinecraftSkinUrl,
      showNotifs(msg) {
        $q.notify({
          progress: true,
          message: msg,
          color: "primary",
          multiLine: true,
        });
      },
    };
  },
};
</script>

<style scoped>
/* Contenedor general */
.profile-section-container {
  max-width: 800px;
  margin: 0 auto;
  overflow-y: auto;
  height: 100vh;
  padding-top: 20px;
}

.post-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 10px;
}

/* Perfil fijo en la parte superior */
.profile-section {
  background-color: #2c3e50;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Contenido desplazable */
.profile-content-scroll {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  padding-top: 20px;
}

/* Contenedor de publicaciones */
.post-container {
  background-color: #ecf0f1;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Contenedor de la imagen */
.post-image-container {
  margin-bottom: 10px;
  text-align: center;
}

.post-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

/* Botón de tres puntos para opciones */
.post-options-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

.custom-svg-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: transparent;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.custom-svg-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.three-dots-svg {
  fill: gray;
  transition: fill 0.3s ease;
}

.custom-svg-btn:hover .three-dots-svg {
  fill: darkgray;
}

.custom-menu {
  position: absolute;
  top: 40px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  min-width: 120px;
  z-index: 10;
  padding: 8px 0;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 14px;
  color: #2c3e50;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

/* Estadísticas del perfil */
.profile-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-top: 20px;
  padding: 10px 0;
  background-color: #ecf0f1;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-stats span {
  flex: 1;
  color: #2c3e50;
}

.profile-stats strong {
  font-size: 1.2em;
  display: block;
  margin-bottom: 5px;
  color: #000;
}

/* Cabecera del perfil */
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.profile-avatar {
  border-radius: 50%;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-header .col {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.q-gutter-md.row.items-center.justify-start {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

/* Botones */
.q-btn {
  margin-right: 10px;
}

.text-delete {
  color: black;
}

/* Responsividad */
@media (max-width: 1024px) {
  .profile-section-container {
    max-width: 95%;
  }

  .post-container {
    margin-bottom: 15px;
  }
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-avatar {
    margin-bottom: 20px;
  }

  .profile-stats {
    flex-direction: row;
    gap: 10px;
  }

  .q-gutter-md.row.items-center.justify-start {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .custom-svg-btn {
    width: 32px;
    height: 32px;
  }

  .three-dots-svg {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .profile-section-container {
    max-width: 100%;
    padding: 10px;
  }

  .profile-stats span {
    font-size: 0.9em;
  }

  .post-container {
    margin-bottom: 10px;
    padding: 8px;
  }

  .menu-item {
    font-size: 12px;
    padding: 8px 12px;
  }
}



</style>
