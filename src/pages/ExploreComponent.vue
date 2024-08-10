<template>
  <q-page class="main-layout">
    <AsideLayout />
    <div class="feed-section">
      <q-infinite-scroll @load="loadMorePosts" :offset="200">
        <div class="posts-list">
          <div v-for="post in posts" :key="post.id" class="post-card">
            <!-- User Info -->
            <div class="user-section">
              <q-avatar class="user-avatar">
                <img :src="getMinecraftSkinUrl(post.user.username)" />
              </q-avatar>
              <div class="user-info">
                <div class="username">{{ post.user.username }}</div>
                <div class="post-date">{{ getDatePost(post.createdAt) }}</div>
              </div>
            </div>

            <!-- Post Image -->
            <div
              class="post-image-container"
              v-if="post.imageUrl && post.imageUrl != 'S/M'"
            >
              <q-img :src="post.imageUrl" class="post-image" />
            </div>

            <!-- Post Description -->
            <div class="post-description">
              {{ post.description }}
            </div>

            <!-- Post Actions -->
            <div class="post-actions">
              <q-icon
                :name="isLikedByUser(post) ? 'favorite' : 'favorite_border'"
                class="action-icon heart-icon"
                :data-post-id="post._id"
                @click="likePost(post)"
              />
              <div class="likes">{{ post.likes.length }}</div>
            </div>

            <!-- Comments Section -->
            <div class="comments-section">
              <div
                class="comment"
                v-for="comment in post.comments"
                :key="comment.id"
              >
                <strong>{{ comment.user.username }}</strong> {{ comment.text }}
              </div>

              <div class="comments">
                <q-input
                  filled
                  v-model="post.newComment"
                  placeholder="Agregar comentario"
                  class="comment-input"
                  style="flex-grow: 1; margin-right: 8px"
                  @keyup.enter="addComment(post)"
                />
                <q-icon
                  name="send"
                  class="send-icon"
                  style="flex-shrink: 0"
                  @click="addComment(post)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Loader -->
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" />
        </div>
      </q-infinite-scroll>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import AsideLayout from "layouts/AsideLayout.vue";
import { useUserStore } from "../stores/userStore";
import { useGlobal } from "../stores/global";
import { useQuasar } from "quasar";
import { usePostStore } from "../stores/postStore";
import axios from "axios";
const global = useGlobal();
export default {
  components: {
    AsideLayout,
  },
  data() {
    return {
      posts: [
        // {
        //   id: 1,
        //   // ... [otros campos del post] ...
        //   comments: [
        //     { id: 1, username: "comentarista1", text: "¡Genial!" },
        //     { id: 2, username: "comentarista2", text: "Me encanta esta foto." },
        //   ],
        //   newComment: "",
        // },
      ],
      hasMore: true, // Variable para rastrear si aún hay más publicaciones por cargar
      currentPage: 1, // Paginación: número de página actual
      pageSize: 5, // Paginación: número de publicaciones por página
    };
  },
  setup() {
    const postStore = usePostStore();
    const userStore = useUserStore();
    const getMinecraftSkinUrl = (username) => {
      // || '../assets/steve-avatar.png
      return `https://minotar.net/avatar/${username}`;
    };
    
    const isLikedByUser = (post) => {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      return post.likes.includes(userId);
    };

    const $q = useQuasar();
    return {
      postStore,
      userStore,
      isLikedByUser,
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
  methods: {

    async likePost(post) {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      let action = "";
      debugger;
      if (!post.likes.includes(userId)) {
        action = "add";
        post.likes.push(userId);

        // Activar la animación de "like"
        post.isLiked = true;
      } else {
        action = "remove";
        const index = post.likes.indexOf(userId);
        if (index > -1) {
          post.likes.splice(index, 1);
        }

        // Remover el "like"
        post.isLiked = false;
      }

      // Selecciona el ícono correspondiente al post actual
      const icon = document.querySelector(
        `.heart-icon[data-post-id="${post._id}"]`
      );
      if (icon) {
        icon.classList.add("liked");
        setTimeout(() => {
          icon.classList.remove("liked");
          icon.classList.add("liked-reverse");
        }, 200);
      }

      const objPost = { postId: post._id, userId, action };
      await this.postStore.updateLike(objPost);
    },
    async addComment(post) {
      const userObject = JSON.parse(localStorage.getItem("user"));
      const commentText = post.newComment.trim(); // Asumo que tienes un campo newComment en el objeto post para recoger el texto del comentario. Si no es así, ajusta según tu estructura.
      if (!commentText) {
        console.error("El comentario no puede estar vacío");
        return;
      }
      // Creando el objeto comentario
      const newComment = {
        text: commentText,
        createdAt: new Date(), // Establecer la fecha actual
        user: {
          id: userObject.id,
          username: userObject.username,
        },
      };
      // Añadiendo el comentario al post local
      post.comments.push(newComment);
      const objPost = {
        postId: post._id,
        comment: newComment,
        username: userObject.username,
      };

      const res = await this.postStore.addComment(objPost);
      if (res) {
        this.showNotifs("Comentario enviado correctamente!");
        post.newComment = ""; // Limpiar el comentario del post local
      }
    },

    async loadMorePosts(index, done) {
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
        url: `${global.url_api}/list-post`,
        params: {
          page: this.currentPage,
          size: this.pageSize,
        },
      };

      try {
        const res = await axios(config);

        res.data.posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

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
    },

    getDatePost(createdAt) {
      const now = new Date();
      const postDate = new Date(createdAt);

      const seconds = Math.floor((now - postDate) / 1000); // Convertir milisegundos a segundos
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (seconds < 60) {
        return `Hace ${seconds} segundos`;
      } else if (minutes < 60) {
        return `Hace ${minutes} minutos`;
      } else if (hours < 24) {
        return `Hace ${hours} horas`;
      } else if (days < 7) {
        return `Hace ${days} días`;
      } else if (weeks < 4) {
        return `Hace ${weeks} semanas`;
      } else if (months < 12) {
        return `Hace ${months} meses`;
      } else {
        return `Hace ${years} años`;
      }
    },

    async toProfile(id) {
      const user = await this.userStore.getUserById({ id });

      this.userStore.setUser(user);
      this.$router.push({ path: `/profile/${id}` });
    },
  },

  mounted() {
    //this.loadMorePosts(() => {});
  },
};
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: row;
}

.feed-section {
  width: 100%;
  padding: 16px;
  overflow: auto;
}

.posts-list {
  display: flex;
  flex-direction: column;
  padding-left: 35%;
  padding-right: 20%;
}

.post-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.user-section {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.user-avatar img {
  width: 40px;
  height: 40px;
}

.user-section .user-avatar {
  margin-right: 8px;
}

.user-info .username {
  font-weight: bold;
}

.post-image-container {
  position: relative;
}

.post-image {
  width: 100%;
  border-radius: 4px;
}

.post-description {
  margin-top: 8px;
}

.post-actions {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.action-icon {
  cursor: pointer;
  margin-right: 8px;
}

.comments-section {
  margin-top: 12px;
}

.comment {
  margin-bottom: 4px;
}

.comment-input {
  margin-top: 8px;
  margin-bottom: 8px;
}

.send-icon {
  cursor: pointer;
}

.comments {
  display: flex;
  width: 100%;
  align-items: center;
}

.main-layout {
  display: flex;
  height: 100vh;
}

.feed-section {
  flex-grow: 1;
  overflow-y: auto; /* Habilita el scroll solo en el contenido de esta sección */
  padding-right: 10px; /* Opcional, para evitar el desplazamiento horizontal */
}

.heart-icon {
  transition: transform 0.2s ease-in-out;
  color: red; /* Cambia el color a rojo cuando está activo */
}

.heart-icon.liked {
  transform: scale(1.3); /* Efecto de agrandar el corazón */
}

.heart-icon.liked-reverse {
  transform: scale(1); /* Volver al tamaño original */
}
</style>
