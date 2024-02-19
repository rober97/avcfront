<template>
  <q-page class="q-pa-md">
    <AsideLayout />
    <div class="q-pa-md" style="max-width: 500px; margin: auto">
      <q-card>
        <q-card-section>
          <div class="text-h6">Título del Short</div>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <video controls class="full-width">
            <source src="path/to/your/video.mp4" type="video/mp4" />
            Tu navegador no soporta la etiqueta de video.
          </video>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2">Comentarios</div>
          <q-input v-model="newComment" label="Añade un comentario" dense />
          <q-btn @click="postComment" label="Publicar" color="primary" />
          <div
            v-for="(comment, index) in comments"
            :key="index"
            class="q-mt-md"
          >
            {{ comment }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import AsideLayout from "layouts/AsideLayout.vue";

export default {
  components: {
    AsideLayout,
  },
  setup() {
    const newComment = ref("");
    const comments = ref([]);

    function postComment() {
      if (newComment.value.trim() !== "") {
        comments.value.push(newComment.value);
        newComment.value = "";
      }
    }

    return { newComment, comments, postComment };
  },
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
