<template>
  <q-page>
    <AsideLayout />
    <div class="chat-section q-ma-md">
      <div class="row">
        <!-- Lista de Chats -->
        <div class="col-4 chat-list">
          <div class="chat-header">
            <q-btn flat round dense icon="arrow_back" @click="goBack" />
            <strong class="q-ml-sm">Chats</strong>
          </div>

          <q-list bordered>
            <q-item
              v-for="chat in chatsData"
              :key="chat.id"
              clickable
              @click="openChat(chat)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img
                    v-if="chat.imageUrl"
                    :src="chat.imageUrl"
                    alt="User Avatar"
                  />

                  <img v-else :src="getMinecraftSkinUrl(chat.name)" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ chat.name }}</q-item-label>
                <q-item-label caption>{{ chat.lastMessage }}</q-item-label>
              </q-item-section>

              <!-- Icono de tres puntos y menú -->
              <q-item-section side top>
                <q-btn flat icon="more_vert" @click.stop="toggleMenu(chat.id)">
                  <q-menu v-show="menuOpenForChatId === chat.id">
                    <q-list>
                      <q-item clickable @click="deleteChat(chat.id)">
                        <q-item-section>Eliminar chat</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Vista del Chat Seleccionado -->
        <div class="col-6" v-if="selectedChat">
          <div class="chat-header">
            <strong>{{ selectedChat.name }}</strong>
          </div>

          <div class="messages">
            <div
              v-for="(message, index) in selectedChat.messages"
              :key="message.timestamp"
              :class="message.sender === 'sent' ? 'you' : 'them'"
              :id="
                index === selectedChat.messages.length - 1
                  ? 'lastMessageChat'
                  : null
              "
              :ref="
                index === selectedChat.messages.length - 1
                  ? 'lastMessage'
                  : null
              "
            >
              <span>{{ message.text }}</span>
            </div>
          </div>

          <div class="send-message">
            <q-input
              v-model="newMessage"
              label="Enviar mensaje"
              @keyup.enter="sendMessage"
            />
            <q-btn @click="sendMessage" label="Enviar" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import AsideLayout from "layouts/AsideLayout.vue";
import { useUserStore } from "../stores/userStore";
import { ref, onMounted, nextTick } from "vue";
import { io } from "socket.io-client";
import { useRouter, useRoute } from "vue-router";

export default {
  components: {
    AsideLayout,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();
    const selectedChat = ref(null);
    const newMessage = ref("");
    const lastMessage = ref(null);
    const menuOpenForChatId = ref(null);
    const selectedChatUser = ref("");
    const chatId = ref("");
    const chatsData = ref([]); // Se convierte en una ref() porque ahora estamos en setup
    const socket = io("http://localhost:3000");
    socket.on("receive_message", (msg) => {
      // Crea el objeto mensaje
      debugger;
      const message = {
        text: msg.text,
        sender: msg.sender, // puedes utilizar el ID del usuario en lugar de un string como 'sent'
        timestamp: msg.timestamp,
        chatId: msg.chatId, // si aplicable, envía el ID del chat
        // otros campos que puedas necesitar en el servidor y/o otros clientes
      };

      selectedChat.value.messages.push(message);
      scrollToBottom();
    });

    const getMinecraftSkinUrl = (username) => {
      return `https://minotar.net/avatar/${username}`;
    };

    const deleteChat = async (chatId) => {
      // Aquí va la lógica para eliminar el chat
      // Por ejemplo, puedes filtrar los chats para eliminar el chat con el ID específico
      chatsData.value = chatsData.value.filter((chat) => chat.id !== chatId);
      await userStore.deleteChat(chatId);
    };

    const toggleMenu = (chatId) => {
      if (menuOpenForChatId.value === chatId) {
        menuOpenForChatId.value = null;
      } else {
        menuOpenForChatId.value = chatId;
      }
    };

    const scrollToBottom = () => {
      nextTick(() => {
        const div = document.querySelector("#lastMessageChat");
        div.scrollIntoView({ behavior: "smooth" });
      });
    };

    const goBack = () => {
      router.go(-1);
    };
    const formatDate = (timestamp) => {
      // ... misma lógica que antes ...
      const date = new Date(timestamp);

      // Opciones para la función toLocaleString
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };

      // Retorna la fecha en un formato legible, por ejemplo: "Sep 17, 2023, 3:45 PM"
      return date.toLocaleString(undefined, options);
    };

    const openChat = async (chat) => {
      selectedChat.value = chat;
      const id_target = chat.id_user || chat.id;

      selectedChatUser.value = id_target;
      // Unirse a una sala
      chatId.value = chat.id;
      socket.emit("join_room", chat.id);

      // Identificamos el ID del usuario conectado.
      const id_user = JSON.parse(localStorage.getItem("user")).id;

      // Obtenemos los mensajes entre los dos usuarios.
      const messages = await userStore.getMessageByUser(id_user, id_target);
      selectedChat.value.messages = [];
      // Ordenamos los mensajes por fecha de manera descendente.
      messages.data.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      messages.data.forEach((m) => {
        let senderType;

        // Determinamos si el mensaje fue enviado o recibido.
        if (m.sender._id === id_user) {
          senderType = "sent";
        } else {
          senderType = "received";
        }
        // Llenamos el array de mensajes.
        selectedChat.value.messages.push({
          text: m.content,
          timestamp: m.createdAt,
          sender: senderType,
        });
      });
      // scrollToBottom();
    };

    const sendMessage = async () => {
      if (newMessage.value.trim() !== "") {
        // Añade el mensaje al chat seleccionado

        const recipient = selectedChatUser.value;

        let senderType = "sent";
        const senderId = JSON.parse(localStorage.getItem("user")).id;

        // Crea el objeto mensaje
        const message = {
          text: newMessage.value,
          sender: senderType, // puedes utilizar el ID del usuario en lugar de un string como 'sent'
          timestamp: new Date(),
          chatId: selectedChat.value.id, // si aplicable, envía el ID del chat
          // otros campos que puedas necesitar en el servidor y/o otros clientes
        };

        selectedChat.value.messages.push(message);

        let obj = {
          sender: senderId,
          recipient: recipient,
          content:
            selectedChat.value.messages[selectedChat.value.messages.length - 1],
        };

        const res = await userStore.newMessage(obj);
        if (res.success) {
          socket.emit("send_message", { roomId: chatId.value, message });
          newMessage.value = "";
          scrollToBottom();
        }
      }
    };
    onMounted(async () => {
      const id = JSON.parse(localStorage.getItem("user")).id;
      if (id) {
        const chats = await userStore.getChatByUser(id);
        if (chats.data.length > 0) {
          const id_user = route.params.id;
          if (id_user) {
            let newUser = chats.data.find((el) => el.otherUser.id == id_user);
            if (!newUser) {
              const user = await userStore.getUserById({ id: id_user });

              let obj = {
                id: user._id,
                name: user.username,
                avatar: "../resources/steve.png",
                lastMessage: "",
                messages: [{ text: "", sender: "", timestamp: "" }],
              };
              chatsData.value.push(obj);
            }
          }
          chats.data.forEach((element) => {
            let obj = {
              id: element.chatId,
              name: element.otherUser.username,
              id_user: element.otherUser.id,
              avatar: "path/to/avatar1.jpg",
              lastMessage: element.lastMessage?.content,
              messages: [{ text: "", sender: "", timestamp: "" }],
            };
            chatsData.value.push(obj);
          });
        } else {
          const id_user = route.params.id;

          if (id_user) {
            let newUser = chats.data.findIndex(
              (el) => el.otherUser.id == id_user
            );

            if (newUser < 0) {
              const user = await userStore.getUserById({ id: id_user });
              let obj = {
                id: user._id,
                name: user.username,
                avatar: "../resources/steve.png",
                lastMessage: "",
                messages: [{ text: "", sender: "", timestamp: "" }],
              };

              chatsData.value.push(obj);
            }
          }
        }
      }
    });
    return {
      // Devuelve todas las propiedades y métodos que deseas exponer a la plantilla:
      selectedChat,
      newMessage,
      selectedChatUser,
      chatId,
      getMinecraftSkinUrl,
      chatsData,
      goBack,
      formatDate,
      openChat,
      sendMessage,
      lastMessage,
      deleteChat,
      toggleMenu,
      menuOpenForChatId,
    };
  },
};
</script>
<style scoped>
.chat-section {
  max-width: 1000px;
  margin: 0 auto;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.messages {
  max-height: 500px;
  overflow-y: auto;
  padding: 1rem 0;
}

.you {
  text-align: right;
  color: green;
}

.them {
  color: blue;
}

.send-message {
  margin-top: 1rem;
}

.chat-list {
  margin-right: 50px;
}

.messages {
  display: flex;
  flex-direction: column;
}

.you {
  align-self: flex-end;
  background-color: #e6f7ff;
  border-radius: 8px 0px 8px 8px;
  padding: 5px 10px;
  margin: 5px 5px 5px 20%;
  text-align: right;
}

.them {
  align-self: flex-start;
  background-color: #f1f1f1;
  border-radius: 0px 8px 8px 8px;
  padding: 5px 10px;
  margin: 5px 20% 5px 5px;
  text-align: left;
}
</style>
