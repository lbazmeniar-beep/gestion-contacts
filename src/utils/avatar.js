// Génère des "photos" de démonstration (portraits stylisés en SVG, encodés en data URI).
// Elles servent de photos initiales pour les 5 contacts, sans fichier image externe.
const PALETTES = [
  { fond: '#cfe3ff', peau: '#f1c7a1', haut: '#3343a4', cheveux: '#3b2a20' },
  { fond: '#ffd9df', peau: '#e8b48a', haut: '#c2455d', cheveux: '#1f1a17' },
  { fond: '#d6f0e0', peau: '#d99b73', haut: '#17855a', cheveux: '#2a2420' },
  { fond: '#fff0c2', peau: '#f6d2b0', haut: '#d98a1a', cheveux: '#7a4a1f' },
  { fond: '#e6dcff', peau: '#c98f68', haut: '#6b4fb5', cheveux: '#14110f' }
]

export function genererAvatar(index = 0) {
  const p = PALETTES[index % PALETTES.length]
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
    `<rect width="200" height="200" fill="${p.fond}"/>` +
    `<path d="M30 200c0-44 31-72 70-72s70 28 70 72z" fill="${p.haut}"/>` +
    `<rect x="88" y="108" width="24" height="26" rx="8" fill="${p.peau}"/>` +
    `<circle cx="100" cy="82" r="36" fill="${p.peau}"/>` +
    `<path d="M64 78c0-26 16-40 38-40 20 0 34 14 34 38-10-14-24-20-42-20-12 0-22 6-30 22z" fill="${p.cheveux}"/>` +
    '</svg>'
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}
