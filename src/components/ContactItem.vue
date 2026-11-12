<script setup>
// Une ligne de la liste : photo (miniature), nom, prénom, téléphone et bouton « Modifier »
import ContactAvatar from './ContactAvatar.vue'

defineProps({
  contact: { type: Object, required: true }
})
</script>

<template>
  <li class="ligne">
    <ContactAvatar :photo="contact.photo" :nom="contact.nom" :prenom="contact.prenom" :taille="52" />
    <div class="infos">
      <div class="nom">{{ contact.nom }} {{ contact.prenom }}</div>
      <div class="tel">{{ contact.telephone }}</div>
    </div>
    <router-link class="btn btn-leger" :to="{ name: 'detail', params: { id: contact.id } }">
      Modifier
    </router-link>
  </li>
</template>

<style scoped>
.ligne {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  background: #f7f8fc;
  border: 1px solid var(--bord);
  border-radius: 10px;
}
.infos { flex: 1; min-width: 0; }
.nom {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tel { color: var(--gris); font-size: 13px; margin-top: 2px; }
</style>
