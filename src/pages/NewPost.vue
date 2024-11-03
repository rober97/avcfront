<template>
  <!-- <q-dialog v-model="show">
    <q-card style="width: 500px" class="q-pa-md">
      <q-card-section class="dialog-header">
        <div class="text-h6 q-my-sm">Crear nueva publicación</div>
      </q-card-section>

      <q-card-section>
        <q-file v-model="files" label="Buscar imagen">
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
        <div class="text-caption q-mb-sm q-mt-xs text-primary">
          Opcional: Agregar una imagen
        </div>

        <div v-if="imagePreview" class="q-mt-md">
          <vue-cropper
            ref="cropper"
            :src="imagePreview"
            :aspect-ratio="1"
            :guides="true"
            @cropend="onCropEnd"
            style="max-width: 300px; height: 300px"
          ></vue-cropper>
        </div>

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
  </q-dialog> -->
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "../stores/userStore";
import { useGlobal } from "../stores/global";
import { useQuasar } from "quasar";
import { watchEffect } from "vue";
import "cropperjs/dist/cropper.css";
import VueCropper from "vue-cropperjs";

const global = useGlobal();
export default {
  components: {
    VueCropper,
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
      imagePreview: null,
    };
  },
  watch: {
    files(newFiles) {
      if (newFiles) {
        const reader = new FileReader();
        reader.readAsDataURL(newFiles);
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
      }
    },
  },
  computed: {
    user() {
      return this.userStore;
    },
  },
  setup(props, { emit }) {
    const description = ref("");
    const cropper = ref("");
    const files = ref([]);
    const selectedFile = ref(null);
    const userStore = useUserStore();
    const $q = useQuasar();
    const additionalFields = ref([
      { name: "description", value: description.value },
    ]);

    const uploaderRef = ref(null);
    watchEffect(() => {});
    onMounted(() => {
      console.log("Componente montado");
    });
    const closeDialog = () => {
      emit("update:show", false);
    };

    return {
      userStore,
      description,
      files,
      selectedFile,
      additionalFields,
      uploaderRef,
      closeDialog,
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
    file_selected(file) {
      console.log(file);
      this.selected_file = file[0];
      this.check_if_document_upload = true;
    },
    onCropEnd() {
      // Una vez que se termine de recortar, puedes obtener la imagen recortada como:
      const croppedImageDataURL = this.$refs.cropper
        .getCroppedCanvas()
        .toDataURL();
      this.showNotifs("Imagen cargada correctamente!");
      // Ahora puedes usar croppedImageDataURL según lo necesites
    },

    async publish() {
      //const { userId, description, imageUrl } = req.body;
      const file = this.files;
      let imageUrl = "";
      const croppedImageDataURL = this.$refs.cropper
        ? this.$refs.cropper.getCroppedCanvas().toDataURL()
        : "";

      if (croppedImageDataURL != "") {
        // Convertir dataURL a Blob (esto es necesario para enviarlo como un archivo a través de FormData)
        const fetchResponse = await fetch(croppedImageDataURL);
        const blob = await fetchResponse.blob();
        if (file) {
          const formData = new FormData();
          formData.append("image", blob);
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
      }
      const uploadedImageUrl = imageUrl == "" ? "S/M" : imageUrl;
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        url: `${global.url_api}/new-post`,
        data: {
          userId: this.userStore.user.id,
          description: this.description,
          imageUrl: uploadedImageUrl,
        },
      };

      try {
        const res = await axios(config);
        if (res.data.success) {
          this.$emit("update:show", false);
          this.showNotifs("Publicacion creada correctamente!");
        } else {
          this.showNotifs(res.data.message);
        }
      } catch (error) {
        this.showNotifs(error);
        this.$emit("update:show", false);
      }
    },
  },
};
</script>
<style scoped>
/* Estilo para el cuadro de diálogo */
.dialog-header {
  background-color: #34495e; /* Fondo del encabezado del diálogo */
  color: #ecf0f1; /* Color del texto del encabezado */
  border-radius: 4px 4px 0 0; /* Bordes superiores redondeados */
}

.q-card {
  background-color: #ecf0f1; /* Fondo claro para el contenido del diálogo */
  border: 1px solid #bdc3c7; /* Borde gris claro para definir el contorno */
  border-radius: 4px; /* Bordes suavizados */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2); /* Sombra suave para dar profundidad */
}

.q-card-section {
  color: #2c3e50; /* Texto en gris azulado oscuro */
}

.q-file .q-field__control {
  background-color: #f7f9f9; /* Fondo ligeramente más claro para el campo de archivo */
  border: 1px solid #bdc3c7; /* Borde gris claro */
  color: #2c3e50; /* Color del texto */
  border-radius: 4px; /* Bordes suavizados */
}

.q-file .q-icon {
  color: #2c3e50; /* Color del icono en gris azulado oscuro */
}

.q-input {
  background-color: #f7f9f9; /* Fondo ligeramente más claro para el campo de texto */
  border: 1px solid #bdc3c7; /* Borde gris claro */
  color: #2c3e50; /* Texto en gris azulado oscuro */
  border-radius: 4px; /* Bordes suavizados */
}

.q-btn.flat {
  color: #e74c3c; /* Botón de cancelar en rojo (color negativo) */
}

.q-btn {
  background-color: #34495e; /* Fondo del botón de publicar */
  color: #ecf0f1; /* Texto en blanco suave */
  border-radius: 4px; /* Bordes suavizados */
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.q-btn:hover {
  background-color: #2c3e50; /* Fondo más oscuro al hacer hover */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Sombra ligera al hacer hover */
}

.text-primary {
  color: #3498db !important; /* Texto de indicación en azul suave */
}

.q-card-actions {
  background-color: #ecf0f1; /* Fondo claro para la sección de acciones */
  border-top: 1px solid #bdc3c7; /* Borde superior para separar */
  border-radius: 0 0 4px 4px; /* Bordes inferiores redondeados */
}
</style>
