// Store partagé des contacts (composable avec état au niveau du module).
// Toutes les pages importent le même état : la liste se met à jour sans rechargement.
// Bonus : les données sont sauvegardées dans le localStorage (persistance après rechargement).
import { ref, watch } from 'vue'
import { genererAvatar } from '../utils/avatar.js'

const CLE_STOCKAGE = 'contacts-vue-v1'

// Liste initiale : 5 contacts distincts, chacun avec sa photo
function contactsInitiaux() {
  return [
    { id: 1, nom: 'Ben Ali', prenom: 'Ahmed', telephone: '22 345 678', email: 'ahmed.benali@example.com', photo: genererAvatar(0) },
    { id: 2, nom: 'Trabelsi', prenom: 'Sarra', telephone: '98 765 432', email: 'sarra.trabelsi@example.com', photo: genererAvatar(1) },
    { id: 3, nom: 'Gharbi', prenom: 'Mohamed', telephone: '55 234 567', email: 'mohamed.gharbi@example.com', photo: genererAvatar(2) },
    { id: 4, nom: 'Jaziri', prenom: 'Ines', telephone: '29 456 123', email: 'ines.jaziri@example.com', photo: genererAvatar(3) },
    { id: 5, nom: 'Mansouri', prenom: 'Karim', telephone: '50 111 222', email: 'karim.mansouri@example.com', photo: genererAvatar(4) }
  ]
}

// Charge les contacts sauvegardés, sinon la liste initiale
function charger() {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE)
    if (brut) {
      const donnees = JSON.parse(brut)
      if (Array.isArray(donnees) && donnees.length) return donnees
    }
  } catch (erreur) {
    console.warn('Lecture du localStorage impossible :', erreur.message)
  }
  return contactsInitiaux()
}

const contacts = ref(charger())
const message = ref('') // petit message de confirmation affiché dans la liste
let minuterie = null

// Sauvegarde automatique à chaque modification
watch(
  contacts,
  (valeur) => {
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(valeur))
    } catch (erreur) {
      console.warn('Sauvegarde impossible (stockage plein ?) :', erreur.message)
    }
  },
  { deep: true }
)

export function useContacts() {
  // Retrouve un contact à partir de son identifiant (l'id de l'URL est une chaîne)
  function trouver(id) {
    return contacts.value.find((c) => String(c.id) === String(id)) || null
  }

  function ajouter(donnees) {
    const nouvelId = contacts.value.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) + 1
    const contact = { id: nouvelId, ...donnees }
    contacts.value.push(contact)
    return contact
  }

  function modifier(id, donnees) {
    const contact = trouver(id)
    if (contact) Object.assign(contact, donnees)
    return contact
  }

  function supprimer(id) {
    contacts.value = contacts.value.filter((c) => String(c.id) !== String(id))
  }

  function reinitialiser() {
    contacts.value = contactsInitiaux()
  }

  // Affiche un message de confirmation pendant 3 secondes
  function notifier(texte) {
    message.value = texte
    clearTimeout(minuterie)
    minuterie = setTimeout(() => (message.value = ''), 3000)
  }

  return { contacts, message, trouver, ajouter, modifier, supprimer, reinitialiser, notifier }
}
