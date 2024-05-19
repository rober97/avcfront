<template>
  <q-page>
    <AsideLayout />
    <div class="profile-section q-ma-md" style="margin-top: 20px">
      <div class="q-gutter-md row items-center">
        <div class="col">
          <q-avatar size="150px">
            <!-- Utilizamos la función getMinecraftSkinUrl para obtener la URL del skin -->
            <img
              :src="getMinecraftSkinUrl(userData.username)"
              alt="User Avatar"
            />
          </q-avatar>
        </div>
        <div class="col">
          <!-- Botones agregados aquí -->
          <div class="q-gutter-md row items-center justify-center">
            <div class="col-auto" v-show="showPerfil()">
              <q-btn
                label="Seguir"
                color="secondary"
                class="q-mr-md"
                @click="follow()"
                v-show="followingBtn"
              />

              <q-btn
                label="Siguiendo"
                color="secondary"
                class="q-mr-md"
                @click="unfollow()"
                v-show="isFollowingBtn"
              />
            </div>
            <div class="col-auto" v-show="showPerfil()">
              <q-btn
                label="Mensaje"
                color="secondary"
                class="q-mr-md"
                v-show="messageBtn"
                @click="sendMessage"
              />
            </div>
            <div class="col-auto" v-show="checkProfile()">
              <q-btn
                label="Editar perfil"
                color="primary"
                flat
                @click="editProfile"
              />
            </div>
          </div>

          <div class="q-mt-md">
            <div>
              <strong>{{ posts.length }}</strong> publicaciones
            </div>
            <div>
              <strong>{{ userData.followers.length }}</strong>
              seguidores
            </div>
            <div><strong>0</strong> seguidos</div>
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
            <!-- ... otros campos ... -->
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" @click="showEditProfile = false" />
            <q-btn label="Guardar" color="primary" @click="saveProfile(user)" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div class="q-mt-md">
        <strong>{{ userData.username }}</strong>
        <div>{{ userData.bio }}</div>
      </div>
      <q-infinite-scroll
        @load="(index, done) => loadMorePosts(done)"
        :offset="200"
      >
        <q-list class="rounded-borders">
          <q-item
            v-for="post in posts"
            :key="post.id"
            clickable
            @click="showPostDetails(post)"
            class="q-pa-md post-container border-bottom"
          >
            <!-- Verifica si hay una imagen para la publicación -->
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
            <!-- Contenedor de la descripción y los íconos -->
            <div class="post-content">
              <div class="text-body1 q-my-md">{{ post.description }}</div>
              <q-item-section side top class="q-pt-none custom-icons">
                <q-icon name="favorite_border" />
                <span class="q-ml-xs">{{ post.likes.length }}</span>
                <q-icon name="chat_bubble_outline" class="q-ml-md" />
                <span class="q-ml-xs">{{ post.comments.length }}</span>
              </q-item-section>
            </div>
          </q-item>
        </q-list>
        <q-spinner-dots v-if="loading" class="q-mt-md" />
      </q-infinite-scroll>
    </div>
    <!-- Nuevo diálogo para mostrar detalles de una publicación -->
    <q-dialog v-model="showPostDialog">
      <q-card class="post-image-users">
        <q-card-section>
          <div class="action-buttons">
            <q-btn flat icon="more_vert" @click="showActions = !showActions">
              <!-- Desplegable para eliminar publicación -->
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
            <span
              ><strong>{{ comment.user.username }}:</strong></span
            >
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
    const messageBtn = ref(false);
    const followingBtn = ref(false);
    const currentPage = ref(0);
    const pageSize = ref(10);
    const hasMore = ref(true);
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

    const checkProfile = () => {
      const idParam = route.params.id;
      const idUser = JSON.parse(localStorage.getItem("user")).id;
      let flag = false;
      if (idParam == idUser) {
        flag = true;
      }
      return flag;
    };

    const deletePost = async (postId) => {
      try {
        const res = await this.postStore.deletePost(postId._id);
        posts = posts.filter((post) => post.id !== postId);
        this.showPostDialog = false;
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

    const loadMorePosts = async (done) => {
      const id = route.params.id;

      if (id) {
        if (!hasMore.value) {
          done(true); // Si no hay más publicaciones por cargar, detiene el Infinite Scroll
          return;
        }

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

        try {
          const res = await axios(config);

          if (res.data.posts.length > 0) {
            res.data.posts.forEach((element) => {
              posts.value.push(element);
            });
          }

          if (res.data.posts.length < pageSize.value) {
            hasMore.value = res.data.hasMore;
            // Si se devolvieron menos publicaciones de las solicitadas, asume que no hay más publicaciones por cargar
          } else {
            currentPage.value++; // Incrementa el número de página para la siguiente carga
          }

          done(); // Finaliza el proceso del Infinite Scroll
        } catch (error) {
          // Maneja errores como prefieras
          console.error("Error al cargar más publicaciones:", error);
          done(true); // Si hay un error, detiene el Infinite Scroll
        }
      }
    };

    onMounted(async () => {
      const id = route.params.id;
      userData.value = await userStore.getUserById({ id });
      await checkFollow();
    });

    return {
      userData,
      showPostDetails,
      checkFollow,
      messageBtn,
      follow,
      posts,
      sendMessage,
      deletePost,
      showPerfil,
      isFollowingBtn,
      followingBtn,
      unfollow,
      clearImage,
      loadMorePosts,
      userStore,
      checkProfile,
      postStore,
      hasMore,
      currentPage: 1, // Paginación: número de página actual
      pageSize: 5, // Paginación: número de publicaciones por página
      showEditProfile,
      editProfile,
      getMinecraftSkinUrl,
    };
  },
};
</script>
    
<style scoped>
.post-image-container {
  width: 40%;
  margin-bottom: 8px; /* Espacio entre la imagen y la descripción */
}
.post-container {
  display: grid;
}
.custom-img {
  height: 100px;
}
.custom-icons {
  display: inline-block;
}
.post-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #f5f5f5;
}

.profile-section {
  max-width: 600px;
  margin: 0 auto;
}

.post-image {
  width: 100%; /* Las imágenes deben ocupar el ancho completo */
  /* Altura eliminada para permitir la relación de aspecto */
  /* object-fit eliminado ya que ya no tenemos una altura fija */
  position: relative;
}

.post-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Esto ayuda a separar elementos de la izquierda y la derecha */
}

.action-buttons {
  position: absolute;
  top: 10px;
  right: 10px; /* Posicionado a la derecha para evitar solapamiento con los contadores */
  z-index: 1;
}

.post-image-users {
  width: 100%; /* Haciéndolo responsivo */
  max-width: 600px; /* Limitando el ancho máximo */
  margin: auto; /* Centrado si es más pequeño que el máximo */
  height: auto; /* La altura es automática para mantener la relación de aspecto de la imagen */
}

/* Adaptaciones responsivas, por ejemplo: */
@media (max-width: 599px) {
  .profile-section,
  .post-image-users {
    max-width: 100%; /* Ocupa todo el ancho disponible en pantallas pequeñas */
  }
}

.border-bottom {
  border-bottom: 1px solid #d5d2d2;
}
</style>

    