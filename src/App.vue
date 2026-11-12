<script setup>
// Squelette de l'application : barre de titre + zone où s'affichent les pages (Vue Router)
</script>

<template>
  <div class="app">
    <header class="barre">
      <router-link to="/">Contacts • Vue.js</router-link>
    </header>
    <main class="carte">
      <!-- :key force un nouveau composant à chaque changement d'adresse -->
      <router-view :key="$route.fullPath" />
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 16px;
}
.barre {
  background: var(--bleu);
  border-radius: 14px 14px 0 0;
  padding: 14px 20px;
}
.barre a {
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}
.carte {
  background: #fff;
  border: 1px solid var(--bord);
  border-top: none;
  border-radius: 0 0 14px 14px;
  padding: 20px;
}
</style>
