<template>
  <q-page class="main-layout">
    <div class="particles-container" @mousemove="handleMouseMove">
      <div v-for="n in particleCount" :key="n" class="particle"></div>
    </div>
    <div class="feed-section">
      <div class="posts-list">
        <div v-for="post in posts" :key="post.id" class="post-card">
          <div class="user-section" @click="toProfile(post.user._id)">
            <q-avatar class="user-avatar">
              <img :src="getMinecraftSkinUrl(post.user.username)" />
            </q-avatar>
            <div class="user-info">
              <div class="username">{{ post.user.username }}</div>
              <div class="post-date">{{ getDatePost(post.createdAt) }}</div>
            </div>
          </div>

          <div
            class="post-image-container"
            v-if="post.imageUrl && post.imageUrl != 'S/M'"
          >
            <q-img :src="post.imageUrl" class="post-image" />
          </div>

          <div class="post-description">
            {{ post.description }}
          </div>

          <div class="post-actions">
            <q-icon
              :name="isLikedByUser(post) ? 'favorite' : 'favorite_border'"
              class="action-icon heart-icon"
              :data-post-id="post._id"
              @click="likePost(post)"
            />
            <div class="likes">{{ post.likes.length }}</div>
          </div>

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

      <div ref="loadMoreTrigger" class="row justify-center q-my-md">
        <q-spinner-dots color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useUserStore } from "../stores/userStore";
import { useGlobal } from "../stores/global";
import { useQuasar } from "quasar";
import { usePostStore } from "../stores/postStore";
import axios from "axios";

export default {
  setup() {
    const global = useGlobal();
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
        console.error("Error al cargar mas publicaciones:", error);
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
      particleCount: 50,
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
      this.particles.forEach((particle) => {
        const particleX = particle.offsetLeft + particle.offsetWidth / 2;
        const particleY = particle.offsetTop + particle.offsetHeight / 2;
        const dx = particleX - mouseX;
        const dy = particleY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const moveX = Math.cos(angle) * 30;
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
        console.error("El comentario no puede estar vacio");
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
        return `Hace ${days} dias`;
      } else if (weeks < 4) {
        return `Hace ${weeks} semanas`;
      } else if (months < 12) {
        return `Hace ${months} meses`;
      }
      return `Hace ${years} anos`;
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
  min-height: 100vh;
  position: relative;
}

.feed-section {
  flex-grow: 1;
  overflow-y: auto;
  height: 100vh;
  padding: 24px 16px;
  position: relative;
  z-index: 1;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0;
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
}

.post-card {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(22, 21, 46, 0.96), rgba(13, 12, 24, 0.96));
  border: 1px solid var(--border-color);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.22);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  border-color: rgba(212, 168, 67, 0.32);
  box-shadow: 0 24px 44px rgba(0, 0, 0, 0.28);
}

.post-description {
  overflow-wrap: break-word;
  white-space: normal;
  word-wrap: break-word;
  margin-top: 8px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.user-section {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
}

.user-section .user-avatar {
  cursor: pointer;
}

.user-info .username {
  font-weight: bold;
  cursor: pointer;
  color: var(--text-primary);
}

.user-info .post-date {
  font-size: 12px;
  color: var(--text-muted);
}

.post-image-container {
  position: relative;
  margin-top: 12px;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
}

.post-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 14px;
}

.post-actions {
  display: flex;
  align-items: center;
  margin-top: 12px;
  gap: 8px;
  color: var(--text-secondary);
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
  padding: 8px 0;
  color: var(--text-secondary);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.comment strong {
  color: var(--text-primary);
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
  color: var(--gold);
  transition: transform 0.2s ease, color 0.2s ease;
}

.send-icon:hover {
  color: var(--gold-light);
  transform: translateX(1px);
}

.heart-icon {
  transition: transform 0.2s ease-in-out;
  color: var(--text-muted);
}

.heart-icon:hover,
.heart-icon.liked {
  color: #ef4444;
}

.heart-icon.liked {
  transform: scale(1.3);
}

.heart-icon.liked-reverse {
  transform: scale(1);
}

.particles-container {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  top: 0;
  left: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: rgba(245, 217, 138, 0.75);
  border-radius: 50%;
  opacity: 0.7;
  animation: float 10s linear infinite;
  transition: transform 0.2s ease;
  box-shadow: 0 0 10px rgba(212, 168, 67, 0.25);
}

.likes {
  color: var(--text-secondary);
  font-weight: 600;
}

:deep(.comment-input .q-field__control) {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid var(--border-color-light);
  border-radius: 12px;
}

:deep(.comment-input .q-field__native),
:deep(.comment-input .q-field__input),
:deep(.comment-input input) {
  color: var(--text-primary) !important;
}

:deep(.comment-input .q-field__native::placeholder),
:deep(.comment-input input::placeholder) {
  color: var(--text-muted) !important;
  opacity: 1;
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

@media (max-width: 768px) {
  .feed-section {
    padding: 8px;
  }

  .posts-list {
    padding: 0 8px;
    max-width: 100%;
  }

  .post-card {
    padding: 12px;
    max-width: 100%;
  }

  .post-image {
    max-height: 200px;
  }

  .user-avatar img {
    width: 32px;
    height: 32px;
  }

  .comment-input {
    margin: 4px 0;
  }

  .post-actions {
    justify-content: space-between;
  }
}

@media (min-width: 1200px) {
  .posts-list {
    max-width: 60%;
  }

  .post-card {
    padding: 24px;
  }
}
</style>
