<template>
  <q-page>
    <AsideLayout />
    <div class="profile-section q-ma-md" style="margin-top: 20px">
      <div class="q-gutter-md row items-center">
        <div class="col">
          <q-avatar size="150px" @click="showEditDialog = true">
            <img
              v-if="user.imageUrl != ''"
              :src="user.imageUrl"
              alt="User Avatar"
            />

            <img v-else src="../resources/steve.png" />
          </q-avatar>
        </div>
        <div class="col">
          <!-- Botones agregados aquí -->
          <div class="q-gutter-md row items-center justify-center">
            <div class="col-auto">
              <q-btn label="Seguir" color="secondary" class="q-mr-md" />
            </div>
            <div class="col-auto">
              <q-btn
                label="Mensaje"
                color="secondary"
                class="q-mr-md"
                @click="sendMessage"
              />
            </div>
            <div class="col-auto">
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
            <div><strong>0</strong> seguidores</div>
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
              v-model="user.bio"
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
        <strong>{{ user.username }}</strong>
        <div>{{ user.bio }}</div>
      </div>
      <q-infinite-scroll
        @load="(index, done) => loadMorePosts(index, done)"
        :offset="200"
      >
        <div class="q-gutter-md row custom-grid" style="margin-top: 40px">
          <div
            v-for="post in posts"
            :key="post.id"
            @click="showPostDetails(post)"
            class="col-4"
          >
            <template v-if="post.imageUrl && post.imageUrl !== 'S/M'">
              <q-img
                :src="post.imageUrl"
                :alt="post.description"
                class="post-image"
              >
                <div class="post-overlay">
                  <i class="fas fa-heart"></i>&nbsp;
                  <span>{{ post.likes.length }}</span
                  >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <i class="fas fa-comment"></i>&nbsp;
                  <span>{{ post.comments.length }}</span>
                </div>
              </q-img>
            </template>
            <template v-else>
              <div class="post-placeholder q-pa-md">
                {{ post.description }}
              </div>
            </template>
          </div>
        </div>
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
                  <q-item clickable @click="deletePost(selectedPost.id)">
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
import { useUserStore } from "../stores/userStore";
import { usePostStore } from "../stores/postStore";
import { ref, onMounted, nextTick } from "vue";
import "font-awesome/css/font-awesome.css";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
const global = useGlobal();
export default {
  components: {
    AsideLayout,
  },
  data() {
    const user = ref("");
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();
    onMounted(async () => {
      const id = route.params.id;
      const user_ = await userStore.getUserById({ id });
      user.value = user_;
    });
    return {
      showEditDialog: false,
      showPostDialog: false,
      userProfileImage: "",
      files: null,
      imagePreview: null,
      selectedPost: null,
      posts: [],
      user,
    };
  },
  watch: {
    files(newFiles) {
      debugger;
      if (newFiles) {
        const reader = new FileReader();
        reader.readAsDataURL(newFiles);
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
      }
    },
  },
  setup() {
    const userStore = useUserStore();
    const postStore = usePostStore();
    const showEditProfile = ref(false);
    const editProfile = () => {
      showEditProfile.value = !showEditProfile.value;
      debugger;
    };
    return {
      userStore,
      postStore,
      hasMore: true, // Variable para rastrear si aún hay más publicaciones por cargar
      currentPage: 1, // Paginación: número de página actual
      pageSize: 5, // Paginación: número de publicaciones por página
      showEditProfile,
      editProfile,
    };
  },

  methods: {
    onRejected() {
      // Manejo de rechazo aquí...
    },

    async deletePost(postId) {
      try {
        const res = await this.postStore.deletePost(postId);
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.showPostDialog = false;
      } catch (error) {
        console.error("Error al eliminar la publicación:", error);
      }
    },
    clearImage() {
      this.files = null;
      this.imagePreview = null;
    },
    async saveProfilePhoto() {
      if (this.files) {
        const urlImage = await this.userStore.uploadImage(this.files);
        const id = JSON.parse(localStorage.getItem("user")).id;
        const user = await this.userStore.getUserById(id);
        user.imageUrl = urlImage;
        await this.userStore.updateUser(user);
      }
    },

    async saveProfile(user) {
      debugger;
      await this.userStore.updateUser(user);
      this.showEditProfile = false;
    },
    showPostDetails(post) {
      debugger;
      this.selectedPost = post;
      this.showPostDialog = true;
    },

    sendMessage() {
      const id = this.$route.params.id;
      this.$router.push({ path: `/messages/${id}` });
    },

    async loadMorePosts(index, done) {
      const id = this.$route.params.id;
      if (id) {
        if (!this.hasMore) {
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
            page: this.currentPage,
            size: this.pageSize,
            id,
          },
        };

        try {
          const res = await axios(config);
          this.posts = [...this.posts, ...res.data.posts];
          if (res.data.posts.length < this.pageSize) {
            this.hasMore = res.data.hasMore;
            // Si se devolvieron menos publicaciones de las solicitadas, asume que no hay más publicaciones por cargar
          } else {
            this.currentPage++; // Incrementa el número de página para la siguiente carga
          }

          done(); // Finaliza el proceso del Infinite Scroll
        } catch (error) {
          // Maneja errores como prefieras
          console.error("Error al cargar más publicaciones:", error);
          done(true); // Si hay un error, detiene el Infinite Scroll
        }
      }
    },
  },

  mounted() {},
};
</script>
    
<style scoped>
.post-placeholder {
  background-color: #f2f2f2; /* color de fondo del placeholder */
  border: 1px dashed #ccc; /* borde punteado */
  text-align: center; /* centrar el texto */
  border-radius: 5px; /* bordes redondeados */
  height: 150px; /* puedes ajustar según prefieras */
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-section {
  max-width: 600px;
  margin: 0 auto;
}

.post-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
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
}

.custom-grid {
  display: flex;
  flex-wrap: wrap;
}

.custom-column {
  flex: 1 1 calc(33.33% - 16px); /* Asume un margen de 16px */
  max-width: calc(33.33% - 16px);
}

.action-buttons {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1; /* para asegurarnos de que se muestre por encima del contenido */
}

.post-image-users {
  width: 600px;
  height: auto;
}

/* Asegurándose de que la imagen ocupe todo el espacio disponible */
</style>
    