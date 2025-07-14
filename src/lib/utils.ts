/**
 * Utilitaires et helpers pour Jupiter Swap DApp
 * 
 * Ce fichier contient des fonctions utilitaires réutilisables :
 * - Manipulation de classes CSS (cn)
 * - Formatage de nombres et montants
 * - Manipulation de dates
 * - Validation de données
 * - Helpers pour Solana
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PublicKey } from '@solana/web3.js';
import { LAMPORTS_PER_SOL, SOLANA_ADDRESS_REGEX } from '@/constants';

// =============================================================================
// UTILITAIRES CSS
// =============================================================================

/**
 * Combine et merge les classes CSS avec Tailwind
 * Utilise clsx pour la logique conditionnelle et tailwind-merge pour éviter les conflits
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =============================================================================
// UTILITAIRES DE FORMATAGE
// =============================================================================

/**
 * Formate un nombre avec séparateurs de milliers et décimales
 */
function formatNumber(
  value: number | string,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  } = {}
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 6,
    notation = 'standard',
  } = options;
  
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits,
    maximumFractionDigits,
    notation,
  }).format(num);
}

/**
 * Formate un montant de token avec le bon nombre de décimales
 */
function formatTokenAmount(
  amount: number | string,
  decimals: number = 6,
  options: {
    minDecimals?: number;
    maxDecimals?: number;
    compact?: boolean;
    roundingMode?: 'floor' | 'ceil' | 'round';
  } = {}
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '0';
  
  const {
    minDecimals = 0,
    maxDecimals = decimals,
    compact = false,
    roundingMode = 'round',
  } = options;
  
  // Arrondir selon le mode spécifié
  let rounded = num;
  if (roundingMode === 'floor') {
    const factor = Math.pow(10, maxDecimals);
    rounded = Math.floor(num * factor) / factor;
  } else if (roundingMode === 'ceil') {
    const factor = Math.pow(10, maxDecimals);
    rounded = Math.ceil(num * factor) / factor;
  }
  
  return formatNumber(rounded, {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
    notation: compact ? 'compact' : 'standard',
  });
}

/**
 * Formate un montant en USD
 */
function formatUSD(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '$0.00';
  
  // Utiliser des règles différentes selon la taille du montant
  if (Math.abs(num) >= 1000000) {
    return '$' + formatNumber(num / 1000000, { maximumFractionDigits: 2 }) + 'M';
  } else if (Math.abs(num) >= 1000) {
    return '$' + formatNumber(num / 1000, { maximumFractionDigits: 2 }) + 'K';
  } else if (Math.abs(num) >= 1) {
    return '$' + formatNumber(num, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    return '$' + formatNumber(num, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  }
}

/**
 * Formate un pourcentage
 */
function formatPercentage(
  value: number | string,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    includeSign?: boolean;
  } = {}
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0%';
  
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    includeSign = false,
  } = options;
  
  const sign = includeSign && num > 0 ? '+' : '';
  return sign + formatNumber(num, {
    minimumFractionDigits,
    maximumFractionDigits,
  }) + '%';
}

/**
 * Formate un nombre en notation compacte (K, M, B)
 */
function formatCompactNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  if (Math.abs(num) >= 1000000000) {
    return formatNumber(num / 1000000000, { maximumFractionDigits: 2 }) + 'B';
  } else if (Math.abs(num) >= 1000000) {
    return formatNumber(num / 1000000, { maximumFractionDigits: 2 }) + 'M';
  } else if (Math.abs(num) >= 1000) {
    return formatNumber(num / 1000, { maximumFractionDigits: 2 }) + 'K';
  } else {
    return formatNumber(num, { maximumFractionDigits: 2 });
  }
}

// =============================================================================
// UTILITAIRES SOLANA
// =============================================================================

/**
 * Convertit des lamports en SOL
 */
function lamportsToSol(lamports: number | string): number {
  const amount = typeof lamports === 'string' ? parseInt(lamports) : lamports;
  return amount / LAMPORTS_PER_SOL;
}

/**
 * Convertit des SOL en lamports
 */
function solToLamports(sol: number | string): number {
  const amount = typeof sol === 'string' ? parseFloat(sol) : sol;
  return Math.floor(amount * LAMPORTS_PER_SOL);
}

/**
 * Convertit un montant brut en décimal selon la précision du token
 */
function rawToDecimal(rawAmount: string | number, decimals: number): number {
  const amount = typeof rawAmount === 'string' ? parseInt(rawAmount) : rawAmount;
  return amount / Math.pow(10, decimals);
}

/**
 * Convertit un montant décimal en montant brut selon la précision du token
 */
function decimalToRaw(decimalAmount: number, decimals: number): string {
  return (decimalAmount * Math.pow(10, decimals)).toFixed(0);
}

/**
 * Vérifie si une adresse Solana est valide
 */
function isValidSolanaAddress(address: string): boolean {
  if (!address) return false;
  
  // Vérification basique du format
  if (!SOLANA_ADDRESS_REGEX.test(address)) return false;
  
  // Vérification avec PublicKey
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Raccourcit une adresse Solana pour l'affichage
 */
function shortenAddress(
  address: string,
  options: { prefixLength?: number; suffixLength?: number } = {}
): string {
  if (!address) return '';
  
  const { prefixLength = 4, suffixLength = 4 } = options;
  
  if (address.length <= prefixLength + suffixLength) {
    return address;
  }
  
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

// =============================================================================
// UTILITAIRES DE DATE
// =============================================================================

/**
 * Formate une date relative (il y a X minutes, etc.)
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  // Moins d'une minute
  if (diff < 60 * 1000) {
    return 'à l\'instant';
  }
  
  // Minutes
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  // Heures
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }
  
  // Jours
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  return `il y a ${days} jour${days > 1 ? 's' : ''}`;
}

/**
 * Formate une date selon le format spécifié
 */
function formatDate(
  date: Date | number | string,
  options: {
    format?: 'short' | 'medium' | 'long' | 'full';
    includeTime?: boolean;
  } = {}
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;
  
  const { format = 'medium', includeTime = false } = options;
  
  // Options pour Intl.DateTimeFormat
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? '2-digit' : format === 'medium' ? 'short' : 'long',
    day: '2-digit',
  };
  
  if (includeTime) {
    dateOptions.hour = '2-digit';
    dateOptions.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('fr-FR', dateOptions).format(dateObj);
}

/**
 * Formate une durée en secondes en format lisible
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return remainingMinutes > 0 || remainingSeconds > 0
    ? `${hours}h ${remainingMinutes}m ${remainingSeconds > 0 ? remainingSeconds + 's' : ''}`
    : `${hours}h`;
}

// =============================================================================
// UTILITAIRES DE VALIDATION
// =============================================================================

/**
 * Vérifie si un montant est valide
 */
function isValidAmount(value: string): boolean {
  if (!value || value === '0') return false;
  
  // Accepte uniquement les nombres avec un maximum de 9 décimales
  const regex = /^[0-9]+(\.[0-9]{1,9})?$/;
  return regex.test(value);
}

/**
 * Vérifie si un slippage est valide
 */
function isValidSlippage(value: number): boolean {
  return value > 0 && value <= 100;
}

/**
 * Nettoie une entrée numérique
 */
function sanitizeNumericInput(value: string): string {
  // Remplace les virgules par des points et supprime les caractères non numériques
  return value.replace(/,/g, '.').replace(/[^\d.]/g, '');
}

// =============================================================================
// UTILITAIRES DE PERFORMANCE
// =============================================================================

/**
 * Debounce une fonction
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle une fonction
 */
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// =============================================================================
// UTILITAIRES D'URL
// =============================================================================

/**
 * Construit une URL d'explorateur pour une transaction
 */
function getExplorerUrl(
  signature: string,
  type: 'tx' | 'address' = 'tx',
  cluster?: string
): string {
  const baseUrl = 'https://solscan.io';
  const clusterParam = cluster && cluster !== 'mainnet-beta' ? `?cluster=${cluster}` : '';
  return `${baseUrl}/${type}/${signature}${clusterParam}`;
}

// =============================================================================
// UTILITAIRES DE COULEUR
// =============================================================================

/**
 * Génère une couleur basée sur une chaîne de caractères
 */
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Détermine si une couleur est claire ou sombre
 */
function isLightColor(color: string): boolean {
  // Convertir hex en RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculer la luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

// =============================================================================
// UTILITAIRES DE STOCKAGE
// =============================================================================

/**
 * Sauvegarde sécurisée dans le localStorage
 */
function setLocalStorage(key: string, value: any): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.warn('Impossible de sauvegarder dans localStorage:', error);
  }
}

/**
 * Récupération sécurisée du localStorage
 */
function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.warn('Impossible de récupérer depuis localStorage:', error);
    return defaultValue;
  }
}

/**
 * Suppression sécurisée du localStorage
 */
function removeLocalStorage(key: string): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn('Impossible de supprimer depuis localStorage:', error);
  }
}

/**
 * Formate un montant pour l'affichage avec un nombre approprié de décimales
 * selon le contexte (SOL ou USDC)
 */
function formatAmount(amount: number | string, token?: 'SOL' | 'USDC'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '0';
  
  // Format spécifique selon le token
  if (token === 'USDC') {
    return formatNumber(num, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  } else if (token === 'SOL') {
    return formatNumber(num, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 9
    });
  }
  
  // Format par défaut
  const decimals = num < 0.01 ? 6 : num < 1 ? 4 : 2;
  return formatNumber(num, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  // CSS
  cn,
  
  // Formatage
  formatNumber,
  formatTokenAmount,
  formatUSD,
  formatPercentage,
  formatCompactNumber,
  formatAmount,
  
  // Solana
  lamportsToSol,
  solToLamports,
  rawToDecimal,
  decimalToRaw,
  isValidSolanaAddress,
  shortenAddress,
  
  // Date
  formatRelativeTime,
  formatDate,
  formatDuration,
  
  // Validation
  isValidAmount,
  isValidSlippage,
  sanitizeNumericInput,
  
  // Performance
  debounce,
  throttle,
  
  // URL
  getExplorerUrl,
  
  // Couleur
  stringToColor,
  isLightColor,
  
  // Stockage
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
};
