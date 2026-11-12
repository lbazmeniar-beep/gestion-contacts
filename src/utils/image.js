// Outils pour transformer une photo (fichier ou caméra) en image légère (JPEG, 480 px max)
// afin de pouvoir la stocker dans le localStorage sans le saturer.
const TAILLE_MAX = 480

// Dessine une image/vidéo dans un canvas redimensionné et renvoie un data URL JPEG
export function versDataUrl(source, largeur, hauteur) {
  const echelle = Math.min(1, TAILLE_MAX / Math.max(largeur, hauteur))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(largeur * echelle))
  canvas.height = Math.max(1, Math.round(hauteur * echelle))
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.85)
}

// Lit un fichier image choisi par l'utilisateur et renvoie une promesse de data URL
export function fichierVersDataUrl(fichier) {
  return new Promise((resolve, reject) => {
    const adresse = URL.createObjectURL(fichier)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(adresse)
      if (!image.naturalWidth || !image.naturalHeight) {
        reject(new Error('Image illisible'))
        return
      }
      resolve(versDataUrl(image, image.naturalWidth, image.naturalHeight))
    }
    image.onerror = () => {
      URL.revokeObjectURL(adresse)
      reject(new Error('Image illisible'))
    }
    image.src = adresse
  })
}
