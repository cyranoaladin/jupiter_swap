/**
 * Utilitaires de formatage pour l'application
 * 
 * @author Manus AI
 * @version 1.0.0
 */

/**
 * Tronque une adresse pour l'affichage
 * @param address Adresse complète
 * @param startLength Nombre de caractères au début (défaut: 4)
 * @param endLength Nombre de caractères à la fin (défaut: 4)
 * @returns Adresse tronquée
 */
export function truncateAddress(
  address: string,
  startLength: number = 4,
  endLength: number = 4
): string {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  
  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);
  
  return `${start}...${end}`;
}

/**
 * Formate un montant pour l'affichage
 * @param amount Montant à formater (string ou number)
 * @param decimals Nombre de décimales à afficher (défaut: 6)
 * @returns Montant formaté
 */
export function formatAmount(
  amount: string | number,
  decimals: number = 6
): string {
  if (amount === undefined || amount === null) return '0';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Utiliser toLocaleString pour le formatage avec séparateurs de milliers
  return numAmount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

/**
 * Formate un prix pour l'affichage
 * @param price Prix à formater
 * @param currency Symbole de la devise (défaut: '$')
 * @returns Prix formaté avec symbole de devise
 */
export function formatPrice(
  price: string | number,
  currency: string = '$'
): string {
  if (price === undefined || price === null) return `${currency}0`;
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  return `${currency}${numPrice.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Formate un pourcentage pour l'affichage
 * @param percentage Pourcentage à formater
 * @param decimals Nombre de décimales (défaut: 2)
 * @returns Pourcentage formaté avec symbole %
 */
export function formatPercentage(
  percentage: string | number,
  decimals: number = 2
): string {
  if (percentage === undefined || percentage === null) return '0%';
  
  const numPercentage = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
  
  return `${numPercentage.toFixed(decimals)}%`;
}

/**
 * Formate une date pour l'affichage
 * @param timestamp Timestamp à formater
 * @returns Date formatée
 */
export function formatDate(timestamp: number): string {
  if (!timestamp) return '';
  
  return new Date(timestamp).toLocaleString();
}
