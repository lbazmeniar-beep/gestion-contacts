<script setup>
// Fenêtre de prise de photo avec la caméra (getUserMedia).
// Si la caméra est absente ou refusée, un message s'affiche avec une solution de repli.
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { versDataUrl } from '../utils/image.js'

const emit = defineEmits(['capture', 'fermer', 'repli'])

const video = ref(null)
const erreur = ref('')
const pret = ref(false)
let flux = null
let demonte = false

function arreter() {
  if (flux) flux.getTracks().forEach((piste) => piste.stop())
  flux = null
}

onMounted(async () => {
  try {
    flux = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    if (demonte) {
      arreter()
      return
    }
    video.value.srcObject = flux
    await video.value.play().catch(() => {})
    pret.value = true
  } catch (e) {
    erreur.value =
      e && e.name === 'NotAllowedError'
        ? "L'accès à la caméra a été refusé."
        : "Aucune caméra n'est disponible sur cet appareil."
  }
})

onBeforeUnmount(() => {
  demonte = true
  arreter()
})

function prendrePhoto() {
  const v = video.value
  if (!v || !v.videoWidth) return
  const image = versDataUrl(v, v.videoWidth, v.videoHeight)
  arreter()
  emit('capture', image)
}
</script>

<template>
  <div class="fond" @click.self="emit('fermer')">
    <div class="fenetre" role="dialog" aria-label="Prise de photo">
      <h3>Prendre une photo</h3>

      <video v-show="!erreur" ref="video" autoplay playsinline muted></video>

      <p v-if="erreur" class="erreur">{{ erreur }}</p>

      <div class="actions">
        <button v-if="!erreur" class="btn btn-vert" :disabled="!pret" @click="prendrePhoto">
          📸 Capturer
        </button>
        <button v-else class="btn btn-violet" @click="emit('repli')">
          Utiliser l'appareil photo / les fichiers
        </button>
        <button class="btn btn-gris" @click="emit('fermer')">Annuler</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fond {
  position: fixed;
  inset: 0;
  background: rgba(20, 24, 45, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 10;
}
.fenetre {
  background: #fff;
  border-radius: 14px;
  padding: 18px;
  width: 100%;
  max-width: 420px;
}
h3 { margin: 0 0 12px; }
video {
  width: 100%;
  border-radius: 10px;
  background: #000;
  transform: scaleX(-1); /* effet miroir pour la caméra frontale */
}
.erreur {
  background: #fdecea;
  color: var(--rouge);
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
}
.actions { display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap; }
.btn:disabled { opacity: 0.5; cursor: wait; }
</style>
