import { defineStore } from 'pinia';
import axios from "axios";
import { useGlobal } from "../stores/global";


export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || {},
    userData: null,
  }),
  getters: {
    isLoggedIn(state) {
      return !!state.user;
    }
  },
  actions: {
    setUser(userInfo) {
      this.user = userInfo;
    },
    logout() {
      this.user = null;
    },
    async uploadImage(file) {
      let imageUrl = ''
      const global = useGlobal();
      const formData = new FormData();
      formData.append("image", file);
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

      return imageUrl
    },

    async getUserById(id) {
      const global = useGlobal();
      try {
        const res = await axios.post(
          `${global.url_api}/getUserById`,
          id
        );
        return res.data.user;  // Asumo que en tu respuesta viene un objeto 'user' cuando es exitosa.
      } catch (error) {
        console.error("Error al obtener el usuario por ID:", error);
        throw error; // Lanzar error para que pueda ser manejado por quien llame a esta función.
      }
    },

    async unfollow(data) {
      const global = useGlobal();
      try {
        const res = await axios.post(
          `${global.url_api}/unfollow`,
          data
        );
        return res
      } catch (error) {
        console.error("Error al obtener el usuario por ID:", error);
        throw error; // Lanzar error para que pueda ser manejado por quien llame a esta función.
      }
    },
    async follow(data) {
      const global = useGlobal();
      try {
        const res = await axios.post(
          `${global.url_api}/follow`,
          data
        );
        return res
      } catch (error) {
        console.error("Error al obtener el usuario por ID:", error);
        throw error; // Lanzar error para que pueda ser manejado por quien llame a esta función.
      }
    },

    async newMessage(message) {
      const global = useGlobal();
      try {
        const res = await axios.post(
          `${global.url_api}/create-message`,
          message
        );
        if (res.data.success) {
          return res.data;  // Asumo que en tu respuesta viene un objeto 'user' cuando es exitosa.
        } else {
          // Lanzar error si el servidor devuelve una respuesta no exitosa.
          throw new Error(res.data.message || "Error al obtener el usuario.");
        }
      } catch (error) {
        console.error("Error al obtener el usuario por ID:", error);
        throw error; // Lanzar error para que pueda ser manejado por quien llame a esta función.
      }
    },

    async deleteChat(chatId) {
      const global = useGlobal();
      try {
        const res = await axios.delete(
          `${global.url_api}/deleteChat/${chatId}`
        );
        if (res.data.success) {
          return res.data;  // Asumo que en tu respuesta viene un objeto 'user' cuando es exitosa.
        } else {
          // Lanzar error si el servidor devuelve una respuesta no exitosa.
          throw new Error(res.data.message || "Error al eliminar el chat.");
        }
      } catch (error) {
        console.error("Error al eliminar el chat:", error);
        throw error; // Lanzar error para que pueda ser manejado por quien llame a esta función.
      }
    },




    async updateUser(user) {
      const global = useGlobal();
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        url: `${global.url_api}/updateUser`,
        data: {
          id: user._id,
          imageUrl: user.imageUrl,
          bio: user.bio // Aquí asumo que tu objeto 'user' tiene una propiedad 'username'.
        },
      };

      debugger

      try {
        const res = await axios(config);

        if (res.data.success) {
        } else {

        }
      } catch (error) {
        console.log(error)
      }
    },


    async getMessageByUser(id, id_target) {
      const global = useGlobal();
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
        url: `${global.url_api}/messages-between/${id}/${id_target}`,
      };

      try {
        const res = await axios(config);
        return res.data
      } catch (error) {
        console.log(error)
      }
    },

    async getChatByUser(id) {
      const global = useGlobal();
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
        url: `${global.url_api}/chat-by-user/${id}`,
      };

      try {
        const res = await axios(config);
        return res.data
      } catch (error) {
        console.log(error)
      }
    },

    async getListUsers() {
      const global = useGlobal();
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
        url: `${global.url_api}/get-list-users?limit=100&page=1`,
      };

      try {
        const res = await axios(config);
        return res.data
      } catch (error) {
        console.log(error)
      }
    }

  }
});
