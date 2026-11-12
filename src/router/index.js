import { createRouter, createWebHashHistory } from 'vue-router'
import ListeContacts from '../pages/ListeContacts.vue'
import DetailContact from '../pages/DetailContact.vue'

// Mode "hash" (#/contact/1) : fonctionne partout, même sans configuration serveur
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'liste', component: ListeContacts },
    // La route "nouveau" doit être placée avant ":id"
    { path: '/contact/nouveau', name: 'nouveau', component: DetailContact },
    { path: '/contact/:id', name: 'detail', component: DetailContact, props: true },
    // Toute autre adresse -> retour à la liste
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

export default router
