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
              <div class="col-auto" v-show="showPerfil()">
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
              <span
                ><strong>{{ posts.length }}</strong> publicaciones</span
              >
              <span
                ><strong>{{ userData.followers.length }}</strong>
                seguidores</span
              >
              <span><strong>0</strong> seguidos</span>
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

            <!-- Opciones visibles si es el post seleccionado -->
            <div class="q-pa-md">
              <div class="q-gutter-md">
                <q-btn
                  color="secondary"
                  icon="more_vert"
                  class="post-options-btn"
                >
                  <q-menu auto-close>
                    <q-list style="min-width: 100px">
                      <q-item clickable @click="deletePost(post._id)">
                        <q-item-section class="text-delete"
                          >Eliminar</q-item-section
                        >
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>

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
            <div class="post-content">
              <div class="text-body1 q-my-md">
                {{ post.description }}
              </div>
              <q-item-section side top class="q-pt-none custom-icons">
                <q-icon name="favorite_border" />
                <span class="q-ml-xs">{{ post.likes.length }}</span>
                <q-icon name="chat_bubble_outline" class="q-ml-md" />
                <span class="q-ml-xs">{{ post.comments.length }}</span>
              </q-item-section>
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
          >
          </q-img>
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
import { watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useUserStore } from "../stores/userStore";
import { usePostStore } from "../stores/postStore";
import { ref, onMounted, nextTick } from "vue";
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
      debugger;
      messageBtn.value = true;
      if (res.followers.includes(id_user)) {
        isFollowingBtn.value = true;
      } else if (!res.followers.includes(id_user)) {
        followingBtn.value = true;
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
        debugger;
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

    const showPerfil = async () => {
      const idParam = route.params.id;
      const idUser = JSON.parse(localStorage.getItem("user")).id;
      let flag = true;
      if (idParam == idUser) {
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
      console.log("POST ID:", post._id);

      selectedPostId.value = post._id; // Actualizamos el ID de la publicación seleccionada
    };

    const deletePost = async (postId) => {
      try {
        // Llama a la función del store para eliminar la publicación
        await postStore.deletePost(postId);

        // Filtra la lista de publicaciones para excluir la eliminada
        debugger
        posts.value = posts.value.filter(
          (post) => post._id.toString() !== postId.toString()
        );
        debugger
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
.profile-stats span {
  color: #fff;
}

.profile-stats {
  display: grid;
}

.profile-info {
  color: #fff;
}

/* Contenedor general */
.profile-section-container {
  max-width: 800px;
  margin: 0 auto;
  overflow-y: auto;
  height: 100vh;
  padding-top: 20px;
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

/* Sección de publicaciones con desplazamiento */
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
}

/* Botón de tres puntos para opciones en la esquina superior derecha */
.post-options-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

/* Imagen de la publicación */
.post-image {
  width: 100%;
  border-radius: 10px 10px 0 0;
}

/* Contenido de la publicación */
.post-content {
  padding: 10px;
}

.text-body1 {
  color: #2c3e50;
}

/* Iconos personalizados */
.custom-icons q-icon {
  color: #2c3e50;
}

.custom-icons {
  flex-direction: row !important;
}

.border-bottom {
  border-bottom: 1px solid #d5d2d2;
}

/* Adaptaciones responsivas */
@media (max-width: 599px) {
  .profile-section-container {
    max-width: 100%;
    padding: 10px;
  }

  .profile-stats span {
    margin-right: 10px;
  }

  .post-container {
    margin-bottom: 15px;
  }
}

.text-delete {
  color: black;
}
</style>
