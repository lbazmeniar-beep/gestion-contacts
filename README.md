# Gestion des contacts — Vue.js 3 + Vue Router

Application web de gestion de contacts : liste avec photos, fiche de consultation / modification,
ajout, suppression, appel (`tel:`), e-mail (`mailto:`), photo depuis la galerie ou la caméra.

## Installation et exécution
Prérequis : Node.js 18 ou plus.

```bash
npm install
npm run dev
```
Ouvrir http://localhost:5173

Pour tester sur un téléphone connecté au même Wi-Fi : `npm run dev:reseau`, puis ouvrir l'adresse « Network » affichée.

Autres commandes : `npm run build` (production) et `npm run preview`.

## Structure du projet
```
src/
├── main.js                  point d'entrée (Vue + Router)
├── App.vue                  barre de titre + <router-view>
├── router/index.js          routes : /  ·  /contact/nouveau  ·  /contact/:id
├── store/contacts.js        état partagé des contacts (composable + localStorage)
├── pages/
│   ├── ListeContacts.vue    page 1 : liste (photo, nom, prénom, téléphone, Modifier, Ajouter)
│   └── DetailContact.vue    page 2 : fiche (modification / création)
├── components/
│   ├── ContactAvatar.vue    photo ronde (initiales si pas de photo)
│   ├── ContactItem.vue      une ligne de la liste
│   └── CameraModal.vue      prise de photo avec la caméra (getUserMedia)
└── utils/
    ├── avatar.js            photos de démonstration (SVG)
    └── image.js             redimensionnement des photos (canvas)
```

## Choix techniques
- **Vue Router** en mode hash (`#/contact/1`) : fonctionne sans configuration serveur.
- **État partagé** : composable `useContacts()` avec un état au niveau du module ; la liste se met à jour sans recharger la page.
- **Persistance (bonus)** : sauvegarde automatique dans le `localStorage`.
- **Formulaire sur copie** : « Retour » sans « Enregistrer » n'enregistre rien.
- **Photos** : redimensionnées en JPEG (480 px max) avant stockage ; aperçu immédiat.
- **Caméra** : `getUserMedia` (https ou localhost) ; sinon repli sur `<input type="file" capture>` ; message si indisponible.
- **Validation** : nom, prénom, téléphone (8 chiffres min.) et e-mail obligatoires, e-mail au format valide.

## Plan de tests
| # | Test | Résultat attendu |
|---|------|------------------|
| 1 | Ouvrir la liste | 5 contacts, chacun avec photo, nom, prénom, téléphone |
| 2 | Modifier → changer un champ → Enregistrer | Modification visible dans la liste, message de confirmation |
| 3 | Appeler / E-mail (sur appareil adapté) | Ouvre le composeur téléphonique / le logiciel de messagerie |
| 4 | Galerie → choisir une image | Aperçu immédiat, photo visible dans la liste après enregistrement |
| 5 | Caméra (téléphone) | Prise de photo possible ; sans caméra : message + repli |
| 6 | Champs vides, e-mail invalide | Messages d'erreur, rien n'est enregistré |
| 7 | Retour sans enregistrer | La liste reste inchangée |
| 8 | Recharger la page (F5) | Les contacts sont conservés (bonus) |

## Captures d'écran
À placer dans le dossier `screenshots/` (liste, fiche, modification, sélection de photo, caméra).
