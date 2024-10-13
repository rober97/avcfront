import { defineStore } from 'pinia';
import axios from "axios";
import { useGlobal } from "../stores/global";

export const usePostStore = defineStore({
  id: 'post',
  state: () => ({
  }),
  getters: {
  },
  actions: {
    async deletePost(id) {
      const global = useGlobal();
    
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: 'DELETE', // Usar DELETE en la solicitud
        url: `${global.url_api}/delete-post`,
        data: {
          postId: id, // Enviar el ID en el cuerpo
        },
      };
    
      try {
        const res = await axios.request(config); // Usar axios.request para enviar cuerpo en DELETE
    
        if (res.data.success) {
          console.log("Post eliminado exitosamente.");
          // Realiza cualquier acción necesaria después de eliminar, como actualizar la lista
        } else {
          console.log("No se pudo eliminar el post:", res.data.message);
        }
      } catch (error) {
        console.error("Error al eliminar el post:", error);
      }
    }
    
    ,
    async updatePost(post) {
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        url: `${global.url_api}/update-post`,
      };

      try {
        const res = await axios.post(config, post);
        debugger
        if (res.data.success) {
        } else {

        }
      } catch (error) {
        console.log(error)
      }
    },

    async updateLike(post) {
      const global = useGlobal();
      const uploadResponse = await axios.post(
        `${global.url_api}/update-like`,
        post
      );
      if (uploadResponse.data.success) {
        return true
      } else {
        throw new Error(
          uploadResponse.data.message || "Error al update like"
        );
      }
    },

    async addComment(post) {
      const global = useGlobal();
      const uploadResponse = await axios.post(
        `${global.url_api}/add-comment`,
        post
      );
      if (uploadResponse.data.success) {
        return true
      } else {
        throw new Error(
          uploadResponse.data.message || "Error al update like"
        );
      }
    },

  }
});
