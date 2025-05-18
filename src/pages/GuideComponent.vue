<template>
  <q-page class="q-pa-md bg-page">
    <q-scroll-area class="guide-container">
      <div class="column items-center q-gutter-md">
        <!-- Bienvenida -->
        <q-banner
          class="bg-primary text-white text-center q-pa-lg q-mt-lg sticky-banner"
        >
          <div class="text-h4 q-mb-sm">
            🌟 ¡Bienvenido a AventuraCraftLatin!
          </div>

          <div class="text-subtitle1 q-mb-md">
            Tu aventura comienza aquí. Usa la IP
            <code>play.avclatin.com</code> en la versión 1.21+
          </div>

          <div class="row justify-center q-gutter-sm q-mb-md">
            <q-btn color="secondary" label="¡Conéctate ahora!" />

            <a
              href="https://discord.gg/sBRVvZ4r2d"
              target="_blank"
              rel="noopener noreferrer"
              style="text-decoration: none"
            >
              <q-btn color="blue" icon="chat" label="Discord" />
            </a>

            <a
              href="https://www.instagram.com/avclatinofficial/"
              target="_blank"
              rel="noopener noreferrer"
              style="text-decoration: none"
            >
              <q-btn
                color="deep-orange"
                icon="photo_camera"
                label="Instagram"
              />
            </a>

            <a
              href="https://www.youtube.com/@ShotCraft3x"
              target="_blank"
              rel="noopener noreferrer"
              style="text-decoration: none"
            >
              <q-btn color="red" icon="smart_display" label="YouTube" />
            </a>
          </div>
        </q-banner>

        <!-- Primeros pasos -->
        <div
          class="q-pa-md bg-grey-1 text-dark rounded-borders shadow-2 full-width"
        >
          <div class="text-h5 q-mb-md">⛏️ Primeros Pasos</div>

          <div class="text-subtitle2 q-mb-md">
            Estos son los comandos principales que tienes disponibles desde que
            entras al servidor. ¡Explóralos y empieza tu aventura!
          </div>

          <q-list bordered separator class="rounded-borders">
            <!-- Kit de inicio -->
            <q-item>
              <q-item-section avatar
                ><q-icon name="construction"
              /></q-item-section>
              <q-item-section>
                <strong>/kit inicio</strong> – Recibe tus primeras herramientas
                y equipo.
              </q-item-section>
            </q-item>

            <!-- Ubicación y hogar -->
            <q-item>
              <q-item-section avatar><q-icon name="place" /></q-item-section>
              <q-item-section>
                <strong>/spawn</strong> – Regresa al punto de inicio seguro del
                servidor.<br />
                <strong>/sethome</strong> – Guarda tu casa actual.<br />
                <strong>/home</strong> – Vuelve a tu casa cuando quieras.<br />
                <strong>/back</strong> – Vuelve al último lugar donde estuviste
                (útil después de morir o teletransportarte).
              </q-item-section>
            </q-item>

            <!-- Comunicación y comandos sociales -->
            <q-item>
              <q-item-section avatar><q-icon name="chat" /></q-item-section>
              <q-item-section>
                <strong>/msg jugador mensaje</strong> – Enviar mensaje
                privado.<br />
                <strong>/r</strong> – Responder al último mensaje recibido.<br />
                <strong>/ignore jugador</strong> – Ignorar mensajes de otro
                jugador.<br />
                <strong>/seen jugador</strong> – Ver cuándo se conectó por
                última vez un jugador.
              </q-item-section>
            </q-item>

            <!-- Teletransportes -->
            <q-item>
              <q-item-section avatar
                ><q-icon name="swap_horiz"
              /></q-item-section>
              <q-item-section>
                <strong>/tpa jugador</strong> – Solicita teletransporte a otro
                jugador.<br />
                <strong>/tpaccept</strong> – Acepta una solicitud de
                teleport.<br />
                <strong>/tpdeny</strong> – Rechaza una solicitud.<br />
                <strong>/warp</strong> – Ver los warps públicos disponibles (si
                están habilitados).
              </q-item-section>
            </q-item>

            <!-- Economía -->
            <q-item>
              <q-item-section avatar
                ><q-icon name="attach_money"
              /></q-item-section>
              <q-item-section>
                <strong>/balance</strong> – Consulta cuánto dinero tienes.<br />
                <strong>/pay jugador cantidad</strong> – Envía dinero a otro
                jugador.<br />
                <strong>/shop</strong> – Compra y vende ítems al servidor.<br />
                <strong>/ah</strong> – Subasta tus ítems y compra de otros
                jugadores.
              </q-item-section>
            </q-item>

            <!-- Sistemas del servidor -->
            <q-item>
              <q-item-section avatar
                ><q-icon name="location_city"
              /></q-item-section>
              <q-item-section>
                <strong>/town</strong> – Crea o únete a una ciudad.<br />
                <strong>/plot</strong> – Administra tu parcela y permisos.
              </q-item-section>
            </q-item>

            <!-- Menús -->
            <q-item>
              <q-item-section avatar><q-icon name="apps" /></q-item-section>
              <q-item-section>
                <strong>/menu</strong> – Abre el menú principal con accesos
                útiles.<br />
                <strong>/ranks</strong> – Consulta los rangos y beneficios.<br />
                <strong>/jobs</strong> – Ve los trabajos disponibles y gana
                dinero haciendo tareas.<br />
                <strong>/minigames</strong> – Entra a los minijuegos: TNT Run y
                Quake.
              </q-item-section>
            </q-item>

            <!-- Ayuda y reglas -->
            <q-item>
              <q-item-section avatar><q-icon name="help" /></q-item-section>
              <q-item-section>
                <strong>/help</strong> – Lista completa de comandos
                disponibles.<br />
                <strong>/rules</strong> – Consulta las reglas del servidor.
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Slimefun -->
        <div
          class="q-pa-md bg-blue-1 text-dark rounded-borders shadow-2 full-width"
        >
          <div class="text-h5 q-mb-md">🔮 Slimefun y Tecnología</div>

          <div class="text-subtitle2 q-mb-md">
            Slimefun convierte Minecraft en un mundo industrial, lleno de
            ciencia, máquinas y automatización avanzada... ¡sin necesidad de
            mods externos!
          </div>

          <div class="q-mb-md">
            <strong>Extensiones disponibles en nuestro servidor:</strong>
            <q-list bordered class="rounded-borders q-mt-sm">
              <q-expansion-item icon="bolt" label="⚡ FastMachines">
                <div class="q-ml-md q-mt-sm">
                  Acelera el funcionamiento de las máquinas de Slimefun,
                  haciendo que procesen más rápido los materiales y tareas.
                </div>
              </q-expansion-item>

              <q-expansion-item icon="toys" label="🧸 FluffyMachines">
                <div class="q-ml-md q-mt-sm">
                  Agrega nuevas máquinas con funciones visuales únicas y
                  mecánicas diferentes a las del Slimefun base.
                </div>
              </q-expansion-item>

              <q-expansion-item
                icon="settings_input_component"
                label="🔌 FNAmplifications"
              >
                <div class="q-ml-md q-mt-sm">
                  Permite usar amplificadores para mejorar el rendimiento de
                  ciertas máquinas, haciéndolas más potentes o eficientes.
                </div>
              </q-expansion-item>

              <q-expansion-item
                icon="all_inclusive"
                label="♾️ InfinityExpansion2"
              >
                <div class="q-ml-md q-mt-sm">
                  Una de las expansiones más completas de Slimefun: agrega
                  materiales nuevos, armas, energía avanzada, generadores y
                  automatización masiva.
                </div>
              </q-expansion-item>
            </q-list>
          </div>

          <q-btn color="primary" label="Ver Guía de Slimefun" icon="science" />
        </div>

        <!-- Towny -->
        <div
          class="q-pa-md bg-green-1 text-dark rounded-borders shadow-2 full-width"
        >
          <div class="text-h5 q-mb-md">
            🏡 Crea y Administra tu Ciudad con Towny
          </div>
          <div class="text-subtitle2 q-mb-md">
            Con Towny puedes fundar tu propia ciudad, invitar jugadores,
            proteger territorios, configurar permisos y más.
          </div>

          <q-list bordered separator class="rounded-borders">
            <!-- Crear ciudad -->
            <q-item>
              <q-item-section avatar><q-icon name="flag" /></q-item-section>
              <q-item-section>
                <strong>/town new "nombre"</strong> – Crea tu propia ciudad con
                el nombre que elijas.
              </q-item-section>
            </q-item>

            <!-- Invitar jugadores -->
            <q-item>
              <q-item-section avatar
                ><q-icon name="person_add"
              /></q-item-section>
              <q-item-section>
                <strong>/town invite "jugador"</strong> – Invita a un jugador a
                tu ciudad.<br />
                <strong>/town accept</strong> – Aceptar una invitación.<br />
                <strong>/town kick "jugador"</strong> – Expulsa a un jugador.
              </q-item-section>
            </q-item>

            <!-- Claimear y expandir -->
            <q-item>
              <q-item-section avatar><q-icon name="map" /></q-item-section>
              <q-item-section>
                <strong>/town claim</strong> – Claimea (protege) el terreno
                donde estás.<br />
                <strong>/town unclaim</strong> – Libera el terreno actual.<br />
                <strong>/town claim outpost</strong> – Claimea una zona lejana
                como puesto avanzado.
              </q-item-section>
            </q-item>

            <!-- Spawn y warps -->
            <q-item>
              <q-item-section avatar><q-icon name="place" /></q-item-section>
              <q-item-section>
                <strong>/town spawn</strong> – Teletranspórtate al centro de tu
                ciudad.<br />
                <strong>/town set spawn</strong> – Cambia la ubicación del spawn
                de la ciudad.
              </q-item-section>
            </q-item>

            <!-- Flags y permisos -->
            <q-item>
              <q-item-section avatar><q-icon name="security" /></q-item-section>
              <q-item-section>
                <strong>/plot set perm</strong> – Configura permisos para
                parcelas.<br />
                <strong>/town set perm</strong> – Configura permisos generales
                de la ciudad.<br />
                <strong>/plot set for sale</strong> – Pone una parcela a la
                venta.<br />
                <strong>/plot set not for sale</strong> – Quita una parcela de
                la venta.
              </q-item-section>
            </q-item>

            <!-- Economía -->
            <q-item>
              <q-item-section avatar
                ><q-icon name="attach_money"
              /></q-item-section>
              <q-item-section>
                <strong>/town deposit "cantidad"</strong> – Deposita dinero en
                el banco de tu ciudad.<br />
                <strong>/town withdraw "cantidad"</strong> – Retira dinero si
                eres alcalde.
              </q-item-section>
            </q-item>

            <!-- Información y ayuda -->
            <q-item>
              <q-item-section avatar><q-icon name="info" /></q-item-section>
              <q-item-section>
                <strong>/town</strong> – Muestra información general de tu
                ciudad.<br />
                <strong>/towny</strong> – Muestra el menú general de comandos de
                Towny.<br />
                <strong>/res</strong> – Información de tu residencia y ciudades
                disponibles.
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Menús del Servidor -->
        <div
          class="q-pa-md bg-grey-1 text-dark rounded-borders shadow-2 full-width"
        >
          <div class="text-h5 q-mb-md">📋 Menús y Funciones del Servidor</div>
          <div class="text-subtitle2 q-mb-md">
            Usa estos menús para acceder rápidamente a funciones importantes del
            servidor:
          </div>

          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section avatar><q-icon name="menu" /></q-item-section>
              <q-item-section>
                <strong>/menu</strong> – Abre el menú principal con acceso a
                utilidades y funciones clave.
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar
                ><q-icon name="emoji_events"
              /></q-item-section>
              <q-item-section>
                <strong>/ranks</strong> – Consulta los rangos disponibles y sus
                beneficios. ¡Mejora y desbloquea ventajas!
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar><q-icon name="map" /></q-item-section>
              <q-item-section>
                <strong>/warps</strong> – Accede a lugares importantes como
                tiendas, arenas y zonas de eventos.
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar
                ><q-icon name="sports_esports"
              /></q-item-section>
              <q-item-section>
                <strong>/minigames</strong> – Entra a los minijuegos
                disponibles.<br />
                🎯 <strong>Quake:</strong> Dispara rayos láser y derrota a tus
                enemigos.<br />
                🧨 <strong>TNT Run:</strong> Corre sin caer mientras el suelo
                desaparece.
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Cómo ganar dinero -->
        <!-- Cómo ganar dinero -->
        <div
          class="q-pa-md bg-blue-1 text-dark rounded-borders shadow-2 full-width"
        >
          <div class="text-h5 q-mb-md">💰 ¿Cómo ganar dinero en AvC?</div>
          <div class="text-subtitle2 q-mb-md">
            ¡Hay muchas formas de generar ingresos dentro del servidor!
          </div>

          <q-list bordered separator class="rounded-borders">
            <!-- Shop -->
            <q-item>
              <q-item-section avatar
                ><q-icon name="shopping_cart"
              /></q-item-section>
              <q-item-section>
                <strong>/shop</strong> – Compra y vende ítems directamente al
                servidor. Ideal para comerciar tus recursos y obtener dinero
                base.
              </q-item-section>
            </q-item>

            <!-- Jobs -->
            <q-item>
              <q-item-section avatar><q-icon name="work" /></q-item-section>
              <q-item-section>
                <strong>/jobs</strong> – Únete a uno o varios trabajos y gana
                dinero haciendo tareas comunes:<br />
                – 🪓 Leñador, ⚒️ Minero, 🌾 Granjero, 🐟 Pescador, 🔨
                Constructor y más.<br />
                Usa <strong>/jobs browse</strong> para ver los trabajos
                disponibles.<br />
                <strong>/jobs join "nombre"</strong> – Únete a un trabajo.<br />
                <strong>/jobs leave "nombre"</strong> – Sal del trabajo.<br />
                🔓 Algunos rangos permiten más de un trabajo a la vez.
              </q-item-section>
            </q-item>

            <!-- Auction House -->
            <q-item>
              <q-item-section avatar><q-icon name="gavel" /></q-item-section>
              <q-item-section>
                <strong>/ah</strong> – Abre la Casa de Subastas del servidor
                (Auction House).<br /><br />

                🛒 Puedes vender ítems a otros jugadores y establecer tu propio
                precio.<br />
                💸 También puedes comprar objetos listados por otros jugadores
                en tiempo real.<br /><br />

                🔧 <u>¿Cómo vender un ítem?</u><br />
                – Coloca el ítem que deseas vender en tu mano<br />
                – Usa <strong>/ah sell precio</strong><br />
                – Establece el precio y confírmalo para publicarlo

                <br /><br />
                Todos los ítems listados estarán visibles para el resto de
                jugadores en el mercado.
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Reglas del Servidor -->
        <div
          class="q-pa-md bg-red-1 text-dark rounded-borders shadow-2 full-width"
        >
          <div class="text-h5 q-mb-md">⚠️ Reglas del Servidor</div>

          <q-expansion-item icon="block" class="text-dark" label="❌ No robar">
            <div class="q-ml-md q-mt-sm">
              Robar a otros jugadores, en cualquier forma, está prohibido. Esto
              incluye cofres, cultivos, mobs, etc.
            </div>
          </q-expansion-item>

          <q-expansion-item
            icon="bug_report"
            label="🚫 No usar hacks o mods no permitidos"
          >
            <div class="q-ml-md q-mt-sm">
              Cualquier modificación que otorgue ventaja injusta (x-ray,
              auto-clickers, fly, etc.) resultará en sanción inmediata.
            </div>
          </q-expansion-item>

          <q-expansion-item icon="favorite" label="🤝 Respeto entre jugadores">
            <div class="q-ml-md q-mt-sm">
              No se tolera el acoso, insultos, racismo, homofobia ni actitudes
              tóxicas. Sé amable con los demás.
            </div>
          </q-expansion-item>

          <q-expansion-item icon="chat" label="📝 No hacer spam ni publicidad">
            <div class="q-ml-md q-mt-sm">
              Está prohibido hacer spam en el chat o promocionar otros
              servidores sin autorización.
            </div>
          </q-expansion-item>

          <q-expansion-item
            icon="public"
            label="📜 Respeta las construcciones y zonas públicas"
          >
            <div class="q-ml-md q-mt-sm">
              No destruyas construcciones ajenas ni construyas pegado a otros
              jugadores sin su consentimiento.
            </div>
          </q-expansion-item>

          <q-expansion-item
            icon="security"
            label="🔒 Prohibido el abuso de bugs o exploits"
          >
            <div class="q-ml-md q-mt-sm">
              Si encuentras un bug o exploit, repórtalo. El uso intencional será
              sancionado.
            </div>
          </q-expansion-item>

          <q-expansion-item
            icon="money"
            label="💰 No hacer trampa con la economía"
          >
            <div class="q-ml-md q-mt-sm">
              Queda prohibido duplicar dinero, abusar de mecánicas de tradeos o
              aprovecharse del sistema económico.
            </div>
          </q-expansion-item>
        </div>
      </div>
    </q-scroll-area>

    <!-- Botón flotante de acceso -->
    <q-btn
      fab
      icon="login"
      color="accent"
      class="q-fab-bottom-right q-mr-md q-mb-md"
      label="Entrar"
      @click="$router.push('/')"
    />
  </q-page>
</template>

<script>
import AsideLayout from "layouts/AsideLayout.vue";

export default {
  components: {
    AsideLayout,
  },
};
</script>

<style>
.guide-container {
  height: calc(100vh - 64px);
  max-width: 100%;
  overflow-y: auto;
  padding: 1rem;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

.bg-page {
  background: linear-gradient(to bottom, #002f4b, #005582);
  color: #ffffff;
}

.full-width {
  width: 100%;
  max-width: 750px;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Estilos por bloque para forzar visibilidad de texto */
.bg-grey-1,
.bg-blue-1,
.bg-green-1,
.bg-grey-3,
.bg-red-1 {
  color: #111111 !important; /* Texto oscuro legible */
}

/* Corrección para banners azules con texto blanco */
.q-banner {
  border-radius: 12px;
  background: linear-gradient(135deg, #2196f3, #1e88e5);
  color: #ffffff;
}

.shadow-2 {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}

.q-page {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
}

.q-btn {
  font-weight: bold;
  color: #fff !important;
}

.q-btn:hover {
  filter: brightness(1.1);
}

.q-expansion-item__container {
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  color: #000000;
}

/* Hover de secciones */
.full-width:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

/* Responsive */
@media (max-width: 600px) {
  .full-width {
    padding: 1rem;
    font-size: 0.95rem;
  }

  .guide-container {
    padding: 0.5rem;
  }
}

.q-item {
  color: rgb(77, 77, 77);
}

.q-item__label {
  color: rgb(77, 77, 77) !important;
}

/* Eliminar scroll horizontal globalmente */
body,
html,
.q-page,
.guide-container {
  overflow-x: hidden !important;
}

/* Prevenir expansión de elementos como botones o textos largos */
.q-page,
.guide-container,
.full-width {
  box-sizing: border-box;
  word-break: break-word;
}

/* Evitar que etiquetas <code> desborden horizontalmente */
code {
  white-space: pre-wrap;
  word-break: break-word;
}

/* Forzar ancho total en móviles */
@media (max-width: 600px) {
  .q-btn,
  .q-banner,
  .full-width {
    width: 100%;
  }
}

.sticky-banner {
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 1; /* opcional: se ve mejor pegado arriba */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
</style>
