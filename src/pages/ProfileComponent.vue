<template>
  <q-page class="main-layout">
    <AsideLayout />
    <div class="profile-section-container">
      <!-- Perfil fijo en la parte superior -->
      <div class="profile-section">
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
              <q-btn color="gray" icon="more_vert" class="post-options-btn" v-show="showButton()">
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
              <div class="post-icons-bar q-mt-sm">
                <q-icon name="favorite_border" />
                <span class="q-ml-xs">{{ post.likes.length }}</span>
                <q-icon name="chat_bubble_outline" class="q-ml-md" />
                <span class="q-ml-xs">{{ post.comments.length }}</span>
              </div>
              <div class="text-body1 q-mt-sm">
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
      debugger;
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
.main-layout {
  height: 100vh;
  overflow-y: auto;
}
/* CONTENEDOR GENERAL */
.profile-section-container {
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
  color: #ffffff;
  font-family: "Segoe UI", sans-serif;
  min-height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* CABECERA DE PERFIL */
.profile-section {
  background-color: #0f3460;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  padding: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 900px;
}

.profile-avatar {
  border: 4px solid #00f2ff;
  box-shadow: 0 0 20px #00f2ff70;
}

.profile-header {
  align-items: center;
}

.profile-stats span {
  margin-right: 20px;
  font-size: 16px;
}

.profile-stats strong {
  font-weight: bold;
  font-size: 18px;
  color: #00f2ff;
}

.profile-info strong {
  font-size: 20px;
  display: block;
  margin-bottom: 4px;
}

.profile-info {
  padding-left: 170px;
}

/* SECCIÓN DE PUBLICACIONES */
.profile-content-scroll {
  width: 100%;
  max-width: 900px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* CADA PUBLICACIÓN */
.post-container {
  background-color: #1a1a2e;
  border-radius: 12px;
  margin: 20px 0;
  padding: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
}

/* BOTÓN DE OPCIONES */
.post-options-btn {
  position: absolute;
  top: 16px;
  right: 16px;
}

/* IMAGEN DE LA PUBLICACIÓN */
.post-image-container {
  max-height: 460px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.post-image {
  border-radius: 10px;
  max-width: 100%;
  max-height: 450px;
  object-fit: cover;
  width: 100%;
  height: auto;
  transition: transform 0.3s ease;
}



/* ICONOS DE REACCIÓN */
.post-icons-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  color: #ccc;
  padding: 8px 0;
  gap: 8px;
  width: 100%;
}

.post-icons-bar q-icon {
  color: #fff;
  cursor: pointer;
  transition: color 0.2s ease;
}

.post-icons-bar q-icon:hover {
  color: #00f2ff;
}

/* DESCRIPCIÓN DEL POST */
.post-content {
  width: 100%;
  text-align: left;
  padding-top: 8px;
}

.text-body1 {
  color: #e0e0e0;
  font-size: 15px;
  padding: 4px 10px 10px;
  line-height: 1.5;
}

/* TEXTO DE ELIMINAR */
.text-delete {
  color: #ff4c4c;
  font-weight: bold;
}
</style>

