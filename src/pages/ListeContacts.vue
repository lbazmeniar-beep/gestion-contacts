<script setup>
// Page 1 : liste des contacts (photo, nom, prénom, téléphone, bouton Modifier)
import ContactItem from '../components/ContactItem.vue'
import { useContacts } from '../store/contacts.js'

const { contacts, message, reinitialiser } = useContacts()

function reinitialiserListe() {
  if (confirm('Remplacer tous les contacts par la liste de démonstration ?')) {
    reinitialiser()
  }
}
</script>

<template>
  <section>
    <div class="entete">
      <h2>Liste des contacts</h2>
      <router-link class="btn btn-vert" :to="{ name: 'nouveau' }">+ Ajouter</router-link>
    </div>

    <p v-if="message" class="message" role="status">{{ message }}</p>

    <ul v-if="contacts.length" class="liste">
      <ContactItem v-for="contact in contacts" :key="contact.id" :contact="contact" />
    </ul>
    <p v-else class="vide">Aucun contact. Cliquez sur « + Ajouter » pour en créer un.</p>

    <button class="reinit" @click="reinitialiserListe">Réinitialiser les contacts de démonstration</button>
  </section>
</template>

<style scoped>
.entete {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
h2 { margin: 0; font-size: 22px; }
.liste {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.message {
  background: #e3f6ec;
  color: var(--vert);
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}
.vide { color: var(--gris); text-align: center; padding: 24px 0; }
.reinit {
  margin-top: 18px;
  background: none;
  border: none;
  color: var(--gris);
  text-decoration: underline;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
</style>
