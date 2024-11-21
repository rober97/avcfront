<template>
  <q-dialog :model-value="show">
    <q-card style="width: 500px" class="q-pa-md">
      <q-card-section class="dialog-header">
        <div class="text-h6 q-my-sm">Crear nueva publicación</div>
      </q-card-section>

      <q-card-section>
        <!-- Input de archivo -->
        <div>
          <label for="imageInput" class="text-caption text-primary">
            Selecciona una imagen
          </label>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="q-mt-sm"
            style="display: block"
          />
        </div>

        <!-- Cropper -->
        <div v-if="imagePreview" class="q-mt-md">
          <cropper
            v-if="cropperSrc"
            ref="cropper"
            :src="cropperSrc"
            :stencil-props="{ aspectRatio: 1 }"
            :auto-zoom="true"
            :background="true"
            class="cropper"
          />
        </div>

        <!-- Input de descripción -->
        <q-input
          filled
          v-model="description"
          type="textarea"
          label="Comentario"
          lazy-rules
          :rules="[(val) => !!val || 'La descripción no puede estar vacía']"
          class="q-mt-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="negative" @click="closeDialog" />
        <q-btn label="Publicar" color="primary" @click="publish" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import axios from "axios";
import { useUserStore } from "../stores/userStore";
import { useGlobal } from "../stores/global";
import { useQuasar } from "quasar";

const global = useGlobal();

export default {
  components: {
    Cropper,
  },
  props: {
    show: Boolean,
    uploadUrl: {
      type: String,
      default: "/upload",
    },
  },
  data() {
    return {
      imagePreview: null, // Imagen cargada para previsualización
      cropperSrc: null, // Fuente de imagen para el cropper
    };
  },
  setup(props, { emit }) {
    const description = ref("");
    const userStore = useUserStore();
    const $q = useQuasar();

    const closeDialog = () => {
      if (this.imagePreview) {
        URL.revokeObjectURL(this.imagePreview);
      }
      emit("update:model-value", false);
    };

    const showNotifs = (msg) => {
      $q.notify({
        progress: true,
        message: msg,
        color: "primary",
        multiLine: true,
      });
    };

    return {
      userStore,
      description,
      closeDialog,
      showNotifs,
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        if (this.imagePreview) {
          URL.revokeObjectURL(this.imagePreview);
        }
        this.imagePreview = URL.createObjectURL(file);
        this.cropperSrc = this.imagePreview; // Actualiza la fuente del cropper
      } else {
        this.showNotifs("Por favor, selecciona un archivo de imagen válido.");
        this.imagePreview = null;
        this.cropperSrc = null;
      }
    },

    async getCroppedImageBlob() {
      try {
        const cropperRef = this.$refs.cropper;
        if (!cropperRef) {
          throw new Error("El recorte no está disponible.");
        }
        debugger
        // Obtener el resultado del cropper
        const result = cropperRef.getResult(); // Esto devuelve un objeto con los datos del recorte

        if (!result || !result.canvas) {
          throw new Error("No se pudo obtener el canvas del recorte.");
        }

        // Convertir el canvas a un DataURL
        const croppedImageDataURL = result.canvas.toDataURL("image/jpeg");

        // Convertir el DataURL en un Blob
        const fetchResponse = await fetch(croppedImageDataURL);
        return await fetchResponse.blob();
      } catch (error) {
        console.error("Error al obtener la imagen recortada:", error);
        this.showNotifs("Error al recortar la imagen: " + error.message);
        return null;
      }
    },
    async publish() {
      try {
        if (!this.description || this.description.trim() === "") {
          this.showNotifs("La descripción no puede estar vacía.");
          return;
        }

        let imageUrl = "";
        const croppedImageBlob = await this.getCroppedImageBlob();

        if (croppedImageBlob) {
          const formData = new FormData();
          formData.append("image", croppedImageBlob);

          // Subir la imagen al servidor
          const uploadResponse = await axios.post(
            `${global.url_api}/upload`,
            formData
          );

          if (uploadResponse.data.success) {
            imageUrl = uploadResponse.data.imageUrl;
          } else {
            throw new Error(
              uploadResponse.data.message || "Error al subir la imagen"
            );
          }
        }

        const uploadedImageUrl = imageUrl || "S/M";

        // Crear la publicación
        const res = await axios.post(`${global.url_api}/new-post`, {
          userId: this.userStore.user.id,
          description: this.description,
          imageUrl: uploadedImageUrl,
        });

        if (res.data.success) {
          this.$emit("update:model-value", false);
          this.showNotifs("Publicación creada correctamente!");
        } else {
          this.showNotifs(res.data.message);
        }
      } catch (error) {
        console.error("Error al crear la publicación:", error);
        this.showNotifs("Error al crear la publicación: " + error.message);
      }
    },
  },
};
</script>

<style scoped>
.cropper {
  max-width: 300px;
  height: 300px;
}
</style>
