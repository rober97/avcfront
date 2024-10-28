<template>
  <q-page>
    <AsideLayout />
    <div class="achievement-section-container">
      <div class="iframe-container">
        <iframe
          src="http://shop.avclatin.com/"
          frameborder="0"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  </q-page>
</template>

<script>
import AsideLayout from "layouts/AsideLayout.vue";
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores/userStore";

export default {
  components: {
    AsideLayout,
  },
  setup() {
    const userStore = useUserStore();
    const userData = ref({
      username: "",
      bio: "",
      followers: false,
      following: false,
      verified: false,
    });

    onMounted(async () => {
      const id = JSON.parse(localStorage.getItem("user")).id;
      const uuidUser = await userStore.getUUIDUser({ id });

      if (uuidUser.success) {
        const user = await userStore.getUserByUUID({ uuid: uuidUser.uuid });
        userData.value = user.user;
        userData.value.verified = true;
      } else {
        userData.value = {
          username: "",
          bio: "",
          followers: false,
          following: false,
          verified: false,
        };
      }
    });

    return {
      userData,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 28px;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.achievement-section-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

/* Responsivo para el contenedor de iframe */
.iframe-container {
  width: 100%;
  height: 95vh;
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Ajustes responsivos */
@media (max-width: 1024px) {
  .iframe-container {
    height: 70vh;
  }
}

@media (max-width: 768px) {
  .achievement-section-container {
    padding: 10px;
  }
  .iframe-container {
    height: 60vh;
    border-radius: 6px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 24px;
  }
  .iframe-container {
    height: 50vh;
  }
}

.iframe-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
