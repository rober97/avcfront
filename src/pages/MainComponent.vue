<template>
  <q-page class="flex flex-center">
    <AsideLayout />
    <div class="q-pa-md">
      <div class="q-gutter-md" style="max-width: 300px">
        <h1>SOY MAIN</h1>
      </div>
    </div>
  </q-page>
</template>
  
  <script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
import AsideLayout from "layouts/AsideLayout.vue";

export default {
  components: {
    AsideLayout,
  },
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const username = ref(null);
    const password = ref(null);
    const accept = ref(false);

    return {
      username,
      password,
      accept,

      onSubmit() {
        router.push("/main");
        // if (accept.value !== true) {
        //   $q.notify({
        //     color: "red-5",
        //     textColor: "white",
        //     icon: "warning",
        //     message: "You need to accept the license and terms first",
        //   });
        // } else {
        //   $q.notify({
        //     color: "green-4",
        //     textColor: "white",
        //     icon: "cloud_done",
        //     message: "Submitted",
        //   });
        // }
      },

      onReset() {
        username.value = null;
        password.value = null;
        accept.value = false;
      },
    };
  },
};
</script>
  