<script setup>
// Photo ronde d'un contact. Sans photo, affiche ses initiales.
import { computed } from 'vue'

const props = defineProps({
  photo: { type: String, default: '' },
  nom: { type: String, default: '' },
  prenom: { type: String, default: '' },
  taille: { type: Number, default: 48 } // diamètre en pixels
})

const initiales = computed(() => {
  const lettres = (props.prenom.trim()[0] || '') + (props.nom.trim()[0] || '')
  return lettres.toUpperCase() || '?'
})

const style = computed(() => ({
  width: props.taille + 'px',
  height: props.taille + 'px',
  fontSize: Math.round(props.taille * 0.38) + 'px'
}))
</script>

<template>
  <img
    v-if="photo"
    class="avatar"
    :src="photo"
    :alt="`Photo de ${prenom} ${nom}`"
    :style="style"
  />
  <div v-else class="avatar initiales" :style="style" aria-hidden="true">{{ initiales }}</div>
</template>

<style scoped>
.avatar {
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  display: block;
  background: #d6e2fa;
}
.initiales {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bleu);
  font-weight: 700;
}
</style>
