<template>
  <q-page class="main-layout">
    <AsideLayout @update:show="updatePosts" />
    <div class="particles-container" @mousemove="handleMouseMove">
      <div v-for="n in particleCount" :key="n" class="particle"></div>
    </div>
    <div class="feed-section">
      <div class="posts-list">
        <div v-for="post in posts" :key="post.id" class="post-card">
          <!-- User Info -->
          <div class="user-section" @click="toProfile(post.user._id)">
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

      <!-- Loader Trigger -->
      <div ref="loadMoreTrigger" class="row justify-center q-my-md">
        <q-spinner-dots color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import AsideLayout from "layouts/AsideLayout.vue";
import { useUserStore } from "../stores/userStore";
import { useGlobal } from "../stores/global";
import Particles from "../components/Particles.vue";
import { useQuasar } from "quasar";
import { usePostStore } from "../stores/postStore";
import axios from "axios";
const global = useGlobal();

export default {
  components: {
    AsideLayout,
    Particles,
  },
  setup() {
    const postStore = usePostStore();
    const userStore = useUserStore();
    const posts = ref([]);
    const hasMore = ref(true);
    const currentPage = ref(1);
    const pageSize = ref(5);
    const loading = ref(false);
    const loadMoreTrigger = ref(null);

    const getMinecraftSkinUrl = (username) => {
      return `https://minotar.net/avatar/${username}`;
    };

    const isLikedByUser = (post) => {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      return post.likes.includes(userId);
    };

    const updatePosts = async () => {
      currentPage.value = 1;
      posts.value = [];
      hasMore.value = true;
      await loadMorePosts();
    };

    const loadMorePosts = async () => {
      if (!hasMore.value || loading.value) {
        return;
      }

      loading.value = true;

      try {
        const config = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
          url: `${global.url_api}/list-post`,
          params: {
            page: currentPage.value,
            size: pageSize.value,
          },
        };

        const res = await axios(config);

        res.data.posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        posts.value = [...posts.value, ...res.data.posts];

        if (
          res.data.posts.length < pageSize.value ||
          res.data.posts.length === 0
        ) {
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

    const $q = useQuasar();
    return {
      postStore,
      userStore,
      posts,
      hasMore,
      loadMoreTrigger,
      isLikedByUser,
      getMinecraftSkinUrl,
      loadMorePosts,
      updatePosts,
      showNotifs(msg) {
        $q.notify({
          progress: true,
          message: msg,
          color: "primary",
          multiLine: true,
        });
      },
      particleCount: 50, // Número de partículas
      particles: [],
    };
  },
  mounted() {
    this.initializeParticles();
  },
  methods: {
    initializeParticles() {
      this.particles = document.querySelectorAll(".particle");
      this.particles.forEach((particle) => {
        this.setPosition(particle);
      });
    },
    setPosition(particle) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      particle.style.top = `${y}vh`;
      particle.style.left = `${x}vw`;
      particle.style.animationDuration = `${Math.random() * 5 + 5}s`;
    },
    handleMouseMove(event) {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      debugger;
      this.particles.forEach((particle) => {
        const particleX = particle.offsetLeft + particle.offsetWidth / 2;
        const particleY = particle.offsetTop + particle.offsetHeight / 2;
        const dx = particleX - mouseX;
        const dy = particleY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          // Distancia a la que las partículas "huyen"
          const angle = Math.atan2(dy, dx);
          const moveX = Math.cos(angle) * 30; // Distancia de repulsión
          const moveY = Math.sin(angle) * 30;

          particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          particle.style.transform = "translate(0, 0)";
        }
      });
    },
    async likePost(post) {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      let action = "";
      if (!post.likes.includes(userId)) {
        action = "add";
        post.likes.push(userId);
        post.isLiked = true;
      } else {
        action = "remove";
        const index = post.likes.indexOf(userId);
        if (index > -1) {
          post.likes.splice(index, 1);
        }
        post.isLiked = false;
      }

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
      const commentText = post.newComment.trim();
      if (!commentText) {
        console.error("El comentario no puede estar vacío");
        return;
      }

      const newComment = {
        text: commentText,
        createdAt: new Date(),
        user: {
          id: userObject.id,
          username: userObject.username,
        },
      };

      post.comments.push(newComment);
      const objPost = {
        postId: post._id,
        comment: newComment,
        username: userObject.username,
      };

      const res = await this.postStore.addComment(objPost);
      if (res) {
        this.showNotifs("Comentario enviado correctamente!");
        post.newComment = "";
      }
    },

    getDatePost(createdAt) {
      const now = new Date();
      const postDate = new Date(createdAt);

      const seconds = Math.floor((now - postDate) / 1000);
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
};
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.feed-section {
  flex-grow: 1;
  overflow-y: auto;
  height: 100vh;
  padding: 16px; /* Relleno para evitar bordes pegados */
  position: relative; /* Asegura que el feed esté sobre las partículas */
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Espaciado consistente entre tarjetas */
  padding: 0;
  margin: 0 auto;
  max-width: 800px; /* Máximo ancho en pantallas grandes */
  width: 100%; /* Asegura que ocupe todo el ancho disponible */
}

.post-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px; /* Limita el tamaño en pantallas grandes */
  margin: 0 auto; /* Centra las tarjetas horizontalmente */
}

.post-description {
  overflow-wrap: break-word; /* Rompe palabras largas */
  white-space: normal; /* Ajusta el texto a varias líneas */
  word-wrap: break-word; /* Compatible con navegadores antiguos */
  margin-top: 8px;
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
  cursor: pointer;
}

.user-info .username {
  font-weight: bold;
  cursor: pointer;
}

.post-image-container {
  position: relative;
  margin-top: 8px;
}

.post-image {
  width: 100%;
  max-height: 500px; /* Limita la altura para evitar desbordes */
  object-fit: cover; /* Asegura que la imagen se ajuste bien */
  border-radius: 4px;
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

.comments {
  display: flex;
  width: 100%;
  align-items: center;
}

.send-icon {
  cursor: pointer;
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

.particles-container {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0; /* Colocar detrás del contenido */
  top: 0;
  left: 0;
}

.particle {
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: #ffffff;
  border-radius: 50%;
  opacity: 0.7;
  animation: float 10s linear infinite;
  transition: transform 0.2s ease;
}

@keyframes float {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh);
    opacity: 0;
  }
}

/* Media Queries para pantallas más pequeñas */
@media (max-width: 768px) {
  .feed-section {
    padding: 8px; /* Reduce el relleno */
  }

  .posts-list {
    padding: 0 8px;
    max-width: 100%; /* Ocupa todo el ancho en pantallas pequeñas */
  }

  .post-card {
    padding: 12px; /* Reduce el relleno */
    max-width: 100%;
  }

  .post-image {
    max-height: 200px; /* Ajusta la altura para pantallas pequeñas */
  }

  .user-avatar img {
    width: 32px; /* Reduce el tamaño del avatar */
    height: 32px;
  }

  .comment-input {
    margin: 4px 0; /* Reduce los márgenes */
  }

  .post-actions {
    justify-content: space-between; /* Espacio entre elementos */
  }
}

/* Media Queries para pantallas grandes */
@media (min-width: 1200px) {
  .posts-list {
    max-width: 60%; /* Ajusta el ancho para pantallas grandes */
  }

  .post-card {
    padding: 24px; /* Aumenta el relleno */
  }
}
</style>
