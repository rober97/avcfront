<template>
  <div id="particlesContainer" class="particles-container"></div>
</template>

<script>
import { onMounted } from "vue";
import "particles.js";

export default {
  name: "Particles",
  setup() {
    onMounted(() => {
      window.particlesJS.load(
        "particlesContainer",
        "/src/assets/particles.json", // Asegúrate de que esta ruta sea correcta
        function () {
          console.log("Particles.js config loaded");
        }
      );
    });
  },
};
</script>

<style scoped>
.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
