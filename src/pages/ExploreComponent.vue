<template>
  <q-page>
    <AsideLayout />
    <div class="feed-section q-ma-md">
      <q-infinite-scroll
        @load="(index, done) => loadMorePosts(index, done)"
        :offset="200"
      >
        <q-list v-for="post in posts" :key="post.id" bordered separator>
          <!-- User section -->

          <q-item>
            <q-item-section side top avatar>
              <q-avatar>
                <img
                  v-if="post.user.imageUrl != ''"
                  :src="post.user.imageUrl"
                  alt="User Avatar"
                />

                <img v-else src="../resources/steve.png" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <span
                style="cursor: pointer"
                @click="toProfile(post.user._id)"
                class="q-ml-sm text-weight-bold"
                >{{ post.user.username }}</span
              >
            </q-item-section>
            <q-item-section side>
              <span class="text-caption">{{
                getDatePost(post.createdAt)
              }}</span>
            </q-item-section>
          </q-item>

          <!-- Image or Description based on imageUrl -->
          <q-item v-if="post.imageUrl !== 'S/M'" clickable>
            <q-item-section>
              <q-img
                :src="post.imageUrl"
                :alt="post.description"
                class="post-image"
              />
            </q-item-section>
          </q-item>
          <q-item v-else>
            <q-item-section>
              <span class="text-weight-bold">{{ post.description }}</span>
            </q-item-section>
          </q-item>

          <!-- Post Description (only when there's an image) -->
          <q-item v-if="post.imageUrl !== 'S/M'">
            <q-item-section>
              <span class="text-weight-bold">{{ post.user.username }}: </span>
              {{ post.description }}
            </q-item-section>
          </q-item>

          <!-- Likes section -->
          <q-item>
            <q-item-section>
              <div class="row items-center">
                <q-icon
                  name="favorite"
                  color="red"
                  size="2em"
                  style="cursor: pointer"
                  @click="likePost(post)"
                ></q-icon>

                <span class="col">{{ post.likes.length }} Me gusta</span>
              </div>
            </q-item-section>
          </q-item>

          <!-- Comments -->
          <q-item v-for="comment in post.comments" :key="comment.id">
            <q-item-section>
              <span class="text-weight-bold"
                >{{ comment.user.username }}:
              </span>
              <span>{{ comment.text }}</span>
            </q-item-section>
          </q-item>

          <!-- Add comment -->
          <q-item>
            <q-item-section>
              <q-input
                v-model="post.newComment"
                dense
                placeholder="Agregar un comentario..."
                @keyup.enter="addComment(post)"
              />
            </q-item-section>
            <q-item-section side>
              <q-btn flat @click="addComment(post)" icon="send" />
            </q-item-section>
          </q-item>
        </q-list>

        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </q-page>
</template>


<script>
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
    const $q = useQuasar();
    return {
      postStore,
      userStore,
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
    // addComment(post) {
    //   if (post.newComment.trim() !== "") {
    //     // Aquí puedes añadir lógica para guardar el comentario en una base de datos si es necesario.
    //     // Por ahora, solo agregamos el comentario al array local.
    //     const newCommentId = post.comments.length + 1;
    //     post.comments.push({
    //       id: newCommentId,
    //       username: "usuario_actual", // Aquí deberías poner el nombre del usuario actual
    //       text: post.newComment,
    //     });
    //     post.newComment = ""; // Limpiar el campo de entrada
    //   }
    // },

    async likePost(post) {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      let action = "";
      if (!post.likes.includes(userId)) {
        action = "add";
        post.likes.push(userId);
      } else {
        action = "remove";
        const index = post.likes.indexOf(userId);
        if (index > -1) {
          post.likes.splice(index, 1);
        }
      }

      const objPost = { postId: post._id, userId, action };
      const res = await this.postStore.updateLike(objPost);

      if (res) {
        debugger;
      }
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
      debugger;
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
        debugger;
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
      debugger;
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
.feed-section {
  max-width: 600px;
  margin: 0 auto;
}

.post-image {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
}

.align-start {
  align-items: flex-start;
}
</style>
