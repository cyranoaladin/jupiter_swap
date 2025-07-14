/**
 * Configuration PostCSS pour Jupiter Swap DApp
 * 
 * Ce fichier configure les plugins PostCSS nécessaires pour:
 * - Traiter les directives Tailwind CSS (@tailwind, @apply)
 * - Ajouter les préfixes vendeurs automatiquement
 * - Optimiser le CSS final
 */

module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    ...(process.env.NODE_ENV === 'production' ? { 'cssnano': {} } : {})
  },
}
