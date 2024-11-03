<template>
  <div class="particles-container" @mousemove="handleMouseMove">
    <div v-for="n in particleCount" :key="n" class="particle"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Particles",
  data() {
    return {
      particleCount: 50, // Número de partículas
      particles: [],
    };
  },
  mounted() {
    this.initializeParticles();
  },
  methods: {
    initializeParticles() {
      this.particles = document.querySelectorAll(".particle");
      this.particles.forEach((particle) => {
        this.setPosition(particle);
      });
    },
    setPosition(particle) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      particle.style.top = `${y}vh`;
      particle.style.left = `${x}vw`;
      particle.style.animationDuration = `${Math.random() * 5 + 5}s`;
    },
    handleMouseMove(event) {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      debugger
      this.particles.forEach((particle) => {
        const particleX = particle.offsetLeft + particle.offsetWidth / 2;
        const particleY = particle.offsetTop + particle.offsetHeight / 2;
        const dx = particleX - mouseX;
        const dy = particleY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) { // Distancia a la que las partículas "huyen"
          const angle = Math.atan2(dy, dx);
          const moveX = Math.cos(angle) * 30; // Distancia de repulsión
          const moveY = Math.sin(angle) * 30;

          particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          particle.style.transform = "translate(0, 0)";
        }
      });
    },
  },
});
</script>

<style scoped>
.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: #ffffff;
  border-radius: 50%;
  opacity: 0.7;
  animation: float 10s linear infinite;
  transition: transform 0.2s ease;
}

@keyframes float {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh);
    opacity: 0;
  }
}
</style>
