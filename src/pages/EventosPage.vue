<template>
  <q-page class="eventos-page q-pa-lg">
    <h1 class="page-title font-orbitron q-mb-lg">EVENTOS</h1>

    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <div class="featured-event avc-card">
          <div class="flex items-center gap-lg">
            <div class="event-icon-large">
              <q-icon name="shield" size="54px" class="text-gold" />
            </div>
            <div class="event-info">
              <div class="avc-badge vip q-mb-xs">PROXIMAMENTE</div>
              <h2 class="event-title font-orbitron">Guerras de Clanes</h2>
              <p class="event-desc text-grey-5">
                Forma tu clan y lucha por el control del territorio. Las mejores
                recompensas esperan a los vencedores.
              </p>
              <div class="flex items-center gap-sm q-mt-sm">
                <q-icon name="schedule" class="text-gold" />
                <span class="text-gold font-orbitron">Comienza en: 2h 45m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6" v-for="event in events" :key="event.name">
        <div class="avc-card event-card">
          <div class="flex items-center gap-md">
            <div class="event-icon-medium">
              <q-icon :name="event.icon" size="34px" class="text-gold" />
            </div>
            <div>
              <div class="event-name">{{ event.name }}</div>
              <div class="event-time text-grey-6">{{ event.time }}</div>
              <div class="event-description text-grey-5 q-mt-xs">
                {{ event.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const events = [
  {
    name: "Torneo PvP",
    icon: "sports_martial_arts",
    time: "Sabado 18:00",
    description: "Torneo 1v1 de eliminacion directa.",
  },
  {
    name: "Carrera de Elytra",
    icon: "flight",
    time: "Domingo 16:00",
    description: "Carrera aerea por los cielos del servidor.",
  },
  {
    name: "Construccion Tematica",
    icon: "architecture",
    time: "Viernes 20:00",
    description: "Concurso de construccion con tema sorpresa.",
  },
  {
    name: "Boss Rush",
    icon: "local_fire_department",
    time: "Lunes 19:00",
    description: "Derrota oleadas de bosses por recompensas.",
  },
];
</script>

<style lang="scss" scoped>
.eventos-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 2px;
}

.featured-event {
  background: linear-gradient(135deg, var(--bg-card), rgba(42, 31, 78, 0.4));
  border-color: rgba(212, 168, 67, 0.3);
}

.event-icon-large {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 168, 67, 0.08);
  border-radius: 16px;
  flex-shrink: 0;
}

.event-icon-medium {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 168, 67, 0.06);
  border-radius: 12px;
  flex-shrink: 0;
}

.event-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 4px 0;
  letter-spacing: 1px;
}

.event-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.event-time {
  font-size: 12px;
  margin-top: 2px;
}

.event-description {
  font-size: 13px;
}

.event-card {
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(212, 168, 67, 0.3);
  }
}

.text-gold {
  color: #d4a843 !important;
}

.gap-lg {
  gap: 24px;
}

.gap-md {
  gap: 16px;
}

.gap-sm {
  gap: 8px;
}
</style>
