<script setup>
// Page 2 : fiche d'un contact (modification) ou création d'un nouveau contact.
// On travaille sur une COPIE (formulaire) : « Retour » sans « Enregistrer » ne change rien.
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import ContactAvatar from '../components/ContactAvatar.vue'
import CameraModal from '../components/CameraModal.vue'
import { useContacts } from '../store/contacts.js'
import { fichierVersDataUrl } from '../utils/image.js'

// id vient de l'URL (/contact/:id) ; absent pour /contact/nouveau
const props = defineProps({
  id: { type: String, default: null }
})

const router = useRouter()
const { trouver, ajouter, modifier, supprimer, notifier } = useContacts()

const estNouveau = computed(() => props.id === null)
const contactExistant = estNouveau.value ? null : trouver(props.id)
const introuvable = !estNouveau.value && !contactExistant

// Copie de travail du contact
const formulaire = reactive({
  nom: contactExistant?.nom ?? '',
  prenom: contactExistant?.prenom ?? '',
  telephone: contactExistant?.telephone ?? '',
  email: contactExistant?.email ?? '',
  photo: contactExistant?.photo ?? ''
})

// Messages d'erreur de validation
const erreurs = reactive({ nom: '', prenom: '', telephone: '', email: '' })
const erreurPhoto = ref('')
const infoCamera = ref('')

// ---------- Validation ----------
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const REGEX_TELEPHONE = /^\+?[0-9 ()-]{8,}$/

function valider() {
  erreurs.nom = formulaire.nom.trim() ? '' : 'Le nom est obligatoire.'
  erreurs.prenom = formulaire.prenom.trim() ? '' : 'Le prénom est obligatoire.'

  const tel = formulaire.telephone.trim()
  if (!tel) erreurs.telephone = 'Le téléphone est obligatoire.'
  else if (!REGEX_TELEPHONE.test(tel)) erreurs.telephone = 'Numéro invalide (8 chiffres minimum).'
  else erreurs.telephone = ''

  const mail = formulaire.email.trim()
  if (!mail) erreurs.email = "L'e-mail est obligatoire."
  else if (!REGEX_EMAIL.test(mail)) erreurs.email = "L'adresse e-mail n'est pas valide."
  else erreurs.email = ''

  return Object.values(erreurs).every((e) => !e)
}

// ---------- Enregistrer / Retour / Supprimer ----------
function enregistrer() {
  if (!valider()) return

  const donnees = {
    nom: formulaire.nom.trim(),
    prenom: formulaire.prenom.trim(),
    telephone: formulaire.telephone.trim(),
    email: formulaire.email.trim(),
    photo: formulaire.photo
  }

  if (estNouveau.value) {
    ajouter(donnees)
    notifier('Contact ajouté.')
  } else {
    modifier(props.id, donnees)
    notifier('Modifications enregistrées.')
  }
  router.push({ name: 'liste' })
}

function retour() {
  router.push({ name: 'liste' })
}

function supprimerContact() {
  if (confirm('Supprimer ce contact ?')) {
    supprimer(props.id)
    notifier('Contact supprimé.')
    router.push({ name: 'liste' })
  }
}

// ---------- Appeler / E-mail (liens tel: et mailto:) ----------
const lienTel = computed(() => {
  const numero = formulaire.telephone.replace(/[^\d+]/g, '')
  return numero ? 'tel:' + numero : null
})
const lienMail = computed(() => {
  const mail = formulaire.email.trim()
  return mail ? 'mailto:' + mail : null
})

// ---------- Photo : galerie, caméra ----------
const inputGalerie = ref(null)
const inputCamera = ref(null)
const cameraOuverte = ref(false)

// Appelée quand un fichier est choisi (galerie ou appareil photo du téléphone)
async function surFichierChoisi(event) {
  const fichier = event.target.files && event.target.files[0]
  event.target.value = '' // permet de re-choisir le même fichier ensuite
  if (!fichier) return

  if (!fichier.type.startsWith('image/')) {
    erreurPhoto.value = "Le fichier choisi n'est pas une image."
    return
  }
  try {
    formulaire.photo = await fichierVersDataUrl(fichier) // aperçu immédiat
    erreurPhoto.value = ''
    infoCamera.value = ''
  } catch (e) {
    erreurPhoto.value = "Impossible de lire cette image."
  }
}

function ouvrirGalerie() {
  inputGalerie.value.click()
}

function ouvrirCamera() {
  infoCamera.value = ''
  // La caméra directe (getUserMedia) demande un contexte sécurisé (https ou localhost)
  const cameraDirecte = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && window.isSecureContext
  if (cameraDirecte) {
    cameraOuverte.value = true
  } else {
    // Solution de repli : input file avec capture (ouvre l'appareil photo sur téléphone)
    infoCamera.value = "Caméra directe indisponible : utilisation de l'appareil photo ou des fichiers de l'appareil."
    inputCamera.value.click()
  }
}

function photoPriseParCamera(image) {
  formulaire.photo = image // aperçu immédiat
  erreurPhoto.value = ''
  cameraOuverte.value = false
}

function repliCamera() {
  cameraOuverte.value = false
  infoCamera.value = "Caméra indisponible : utilisation de l'appareil photo ou des fichiers de l'appareil."
  inputCamera.value.click()
}
</script>

<template>
  <section v-if="introuvable" class="introuvable">
    <h2>Contact introuvable</h2>
    <p>Ce contact n'existe pas (ou a été supprimé).</p>
    <button class="btn btn-gris" @click="retour">Retour à la liste</button>
  </section>

  <section v-else>
    <h2>{{ estNouveau ? 'Nouveau contact' : 'Fiche contact — Modification' }}</h2>

    <!-- Photo (aperçu immédiat) -->
    <div class="photo">
      <ContactAvatar :photo="formulaire.photo" :nom="formulaire.nom" :prenom="formulaire.prenom" :taille="120" />
    </div>
    <p v-if="erreurPhoto" class="erreur centre">{{ erreurPhoto }}</p>
    <p v-if="infoCamera" class="info centre">{{ infoCamera }}</p>

    <!-- Formulaire -->
    <form class="formulaire" novalidate @submit.prevent="enregistrer">
      <div class="champ">
        <label for="nom">Nom</label>
        <input id="nom" v-model="formulaire.nom" type="text" :class="{ invalide: erreurs.nom }" />
        <span v-if="erreurs.nom" class="erreur">{{ erreurs.nom }}</span>
      </div>

      <div class="champ">
        <label for="prenom">Prénom</label>
        <input id="prenom" v-model="formulaire.prenom" type="text" :class="{ invalide: erreurs.prenom }" />
        <span v-if="erreurs.prenom" class="erreur">{{ erreurs.prenom }}</span>
      </div>

      <div class="champ">
        <label for="telephone">Téléphone</label>
        <input id="telephone" v-model="formulaire.telephone" type="tel" :class="{ invalide: erreurs.telephone }" />
        <span v-if="erreurs.telephone" class="erreur">{{ erreurs.telephone }}</span>
      </div>

      <div class="champ">
        <label for="email">E-mail</label>
        <input id="email" v-model="formulaire.email" type="email" :class="{ invalide: erreurs.email }" />
        <span v-if="erreurs.email" class="erreur">{{ erreurs.email }}</span>
      </div>
    </form>

    <!-- Actions : appeler, e-mail, galerie, caméra -->
    <div class="actions">
      <a class="btn btn-vert" :href="lienTel">📞 Appeler</a>
      <a class="btn btn-azur" :href="lienMail">✉️ E-mail</a>
      <button type="button" class="btn btn-violet" @click="ouvrirGalerie">🖼️ Galerie</button>
      <button type="button" class="btn btn-violet" @click="ouvrirCamera">📷 Caméra</button>
    </div>

    <!-- Champs fichier cachés -->
    <input ref="inputGalerie" type="file" accept="image/*" hidden @change="surFichierChoisi" />
    <input ref="inputCamera" type="file" accept="image/*" capture="environment" hidden @change="surFichierChoisi" />

    <!-- Boutons du bas -->
    <div class="bas">
      <button type="button" class="btn btn-gris" @click="retour">← Retour</button>
      <button v-if="!estNouveau" type="button" class="btn btn-rouge" @click="supprimerContact">Supprimer</button>
      <button type="button" class="btn btn-vert" @click="enregistrer">Enregistrer</button>
    </div>

    <CameraModal
      v-if="cameraOuverte"
      @capture="photoPriseParCamera"
      @fermer="cameraOuverte = false"
      @repli="repliCamera"
    />
  </section>
</template>

<style scoped>
h2 { margin: 0 0 16px; font-size: 22px; }

.photo { display: flex; justify-content: center; margin-bottom: 16px; }

.formulaire {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 18px;
}
.champ { display: flex; flex-direction: column; gap: 4px; }
label { font-size: 12px; font-weight: 700; color: var(--gris); }
input[type='text'],
input[type='tel'],
input[type='email'] {
  padding: 10px 12px;
  border: 1px solid #c9d0e4;
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
}
input:focus { outline: 2px solid #b9c4f0; border-color: var(--bleu); }
input.invalide { border-color: var(--rouge); background: #fff7f6; }

.erreur { color: var(--rouge); font-size: 12px; }
.info { color: var(--gris); font-size: 12px; }
.centre { text-align: center; margin: 0 0 12px; }

.actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 20px;
}
.bas {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}
.bas .btn-gris { margin-right: auto; }

.introuvable { text-align: center; padding: 24px 0; }

@media (max-width: 560px) {
  .formulaire { grid-template-columns: 1fr; }
  .actions { grid-template-columns: 1fr 1fr; }
}
</style>
