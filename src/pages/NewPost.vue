<template>
  <q-dialog v-model="show">
    <q-card style="width: 500px" class="q-pa-md">
      <q-card-section class="bg-primary text-white text-center rounded-t">
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
  </q-dialog>
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
    const files = ref("");
    const selectedFile = ref(null);
    const userStore = useUserStore();
    const $q = useQuasar();
    const additionalFields = ref([
      { name: "description", value: description.value },
    ]);

    const uploaderRef = ref(null);
    watchEffect(() => {
      console.log("uploaderRef.value:", uploaderRef.value);
    });
    onMounted(() => {
      console.log("Componente montado");
      console.log(uploaderRef.value);
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
      debugger;
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
      debugger;
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
  