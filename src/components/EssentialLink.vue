<template>
  <q-item clickable @click="handleClick">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },
    onClick: {
      type: Function,
      default: null,
    },
  },
  methods: {
    navigate() {
      this.$router.push(this.link);
    },
    handleClick() {
      if (this.onClick) {
        this.onClick();
      } else if (this.link) {
        // Aquí estamos utilizando vue-router para navegar.
        // Si estás usando un enfoque diferente, ajusta este código.
        this.$router.push(this.link);
      }
    },
  },
});
</script>
