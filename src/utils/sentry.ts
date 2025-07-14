/**
 * Utilitaires Sentry pour Jupiter Swap DApp
 * 
 * Ce fichier fournit des utilitaires pour faciliter l'utilisation de Sentry
 * dans l'application, notamment pour le tracing personnalisé et la gestion d'erreurs.
 * 
 * @author Manus AI
 * @version 2.0.0
 */

import * as Sentry from '@sentry/nextjs';
import type { SeverityLevel } from '@sentry/types';

/**
 * Interface pour les options de span
 */
export interface SpanOptions {
  op: string;
  name: string;
  description?: string;
  data?: Record<string, any>;
  tags?: Record<string, string>;
}

/**
 * Type pour les données supplémentaires
 */
type Extras = Record<string, any>;

/**
 * Crée un span de performance et exécute la fonction donnée à l'intérieur
 * 
 * @param options - Options du span
 * @param callback - Fonction à exécuter à l'intérieur du span
 * @returns Le résultat de la fonction callback
 */
export function withSpan<T>(options: SpanOptions, callback: () => T): T {
  // Ajouter un breadcrumb pour le début de l'opération
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `Début: ${options.name}`,
    level: 'info',
    data: options.data ? { ...options.data } : {},
  });

  // Créer une transaction pour cette opération
  const startTime = Date.now();
  
  try {
    return callback();
  } catch (error) {
    // Capturer l'erreur avec le contexte
    const tags = options.tags ? { ...options.tags } : {};
    const extra = options.data ? { ...options.data } : {};
    
    if (options.description) {
      extra.description = options.description;
    }
    
    tags.operation = options.name;
    tags.operationType = options.op;
    
    Sentry.captureException(error, {
      tags,
      extra,
    });
    throw error;
  } finally {
    // Ajouter un breadcrumb pour la fin de l'opération
    const duration = Date.now() - startTime;
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `Fin: ${options.name} (${duration}ms)`,
      level: 'info',
      data: {
        duration,
        operation: options.name,
        operationType: options.op,
      },
    });
  }
}

/**
 * Crée un span de performance asynchrone et exécute la fonction donnée à l'intérieur
 * 
 * @param options - Options du span
 * @param callback - Fonction asynchrone à exécuter à l'intérieur du span
 * @returns Une promesse avec le résultat de la fonction callback
 */
export async function withAsyncSpan<T>(options: SpanOptions, callback: () => Promise<T>): Promise<T> {
  // Ajouter un breadcrumb pour le début de l'opération asynchrone
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `Début async: ${options.name}`,
    level: 'info',
    data: options.data ? { ...options.data } : {},
  });

  // Créer une transaction pour cette opération
  const startTime = Date.now();
  
  try {
    return await callback();
  } catch (error) {
    // Capturer l'erreur avec le contexte
    const tags = options.tags ? { ...options.tags } : {};
    const extra = options.data ? { ...options.data } : {};
    
    if (options.description) {
      extra.description = options.description;
    }
    
    tags.operation = options.name;
    tags.operationType = options.op;
    tags.async = 'true';
    
    Sentry.captureException(error, {
      tags,
      extra,
    });
    throw error;
  } finally {
    // Ajouter un breadcrumb pour la fin de l'opération
    const duration = Date.now() - startTime;
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `Fin async: ${options.name} (${duration}ms)`,
      level: 'info',
      data: {
        duration,
        operation: options.name,
        operationType: options.op,
        async: true,
      },
    });
  }
}

/**
 * Crée un span pour une requête API
 * 
 * @param endpoint - Endpoint de l'API
 * @param method - Méthode HTTP
 * @param callback - Fonction à exécuter à l'intérieur du span
 * @returns Le résultat de la fonction callback
 */
export async function withApiSpan<T>(
  endpoint: string,
  method: string,
  callback: () => Promise<T>
): Promise<T> {
  return withAsyncSpan(
    {
      op: 'http.client',
      name: `API Request: ${method} ${endpoint}`,
      description: `Requête API ${method} vers ${endpoint}`,
      tags: {
        'http.method': method,
        'http.url': endpoint,
      },
    },
    callback
  );
}

/**
 * Crée un span pour une opération UI
 * 
 * @param componentName - Nom du composant
 * @param actionName - Nom de l'action
 * @param callback - Fonction à exécuter à l'intérieur du span
 * @returns Le résultat de la fonction callback
 */
export function withUiSpan<T>(
  componentName: string,
  actionName: string,
  callback: () => T
): T {
  return withSpan(
    {
      op: 'ui.interaction',
      name: `UI: ${componentName} - ${actionName}`,
      description: `Interaction UI dans ${componentName}: ${actionName}`,
      tags: {
        'ui.component': componentName,
        'ui.action': actionName,
      },
    },
    callback
  );
}

/**
 * Crée un span pour une opération blockchain
 * 
 * @param operation - Type d'opération blockchain
 * @param details - Détails de l'opération
 * @param callback - Fonction asynchrone à exécuter à l'intérieur du span
 * @returns Une promesse avec le résultat de la fonction callback
 */
export async function withBlockchainSpan<T>(
  operation: string,
  details: string,
  callback: () => Promise<T>
): Promise<T> {
  return withAsyncSpan(
    {
      op: 'blockchain',
      name: `Blockchain: ${operation}`,
      description: details,
      tags: {
        'blockchain.operation': operation,
        'blockchain.network': process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
      },
    },
    callback
  );
}

/**
 * Fonctions de logging structuré
 */

/**
 * Log un message de niveau trace
 * 
 * @param message - Message à logger
 * @param extra - Données supplémentaires
 */
export function logTrace(message: string, extra?: Extras): void {
  Sentry.addBreadcrumb({
    category: 'log',
    message,
    level: 'debug', // Sentry n'a pas de niveau trace, on utilise debug
    data: extra ? { ...extra } : {},
  });
}

/**
 * Log un message de niveau debug
 * 
 * @param message - Message à logger
 * @param extra - Données supplémentaires
 */
export function logDebug(message: string, extra?: Extras): void {
  Sentry.addBreadcrumb({
    category: 'log',
    message,
    level: 'debug',
    data: extra ? { ...extra } : {},
  });
}

/**
 * Log un message de niveau info
 * 
 * @param message - Message à logger
 * @param extra - Données supplémentaires
 */
export function logInfo(message: string, extra?: Extras): void {
  Sentry.addBreadcrumb({
    category: 'log',
    message,
    level: 'info',
    data: extra ? { ...extra } : {},
  });
}

/**
 * Log un message de niveau warning
 * 
 * @param message - Message à logger
 * @param extra - Données supplémentaires
 */
export function logWarning(message: string, extra?: Extras): void {
  Sentry.addBreadcrumb({
    category: 'log',
    message,
    level: 'warning',
    data: extra ? { ...extra } : {},
  });
}

/**
 * Log un message de niveau error
 * 
 * @param message - Message à logger
 * @param extra - Données supplémentaires
 */
export function logError(message: string, extra?: Extras): void {
  Sentry.addBreadcrumb({
    category: 'log',
    message,
    level: 'error',
    data: extra ? { ...extra } : {},
  });
  
  // Capturer également le message comme un événement
  Sentry.captureMessage(message, {
    level: 'error',
    extra: extra ? { ...extra } : {},
  });
}

/**
 * Log un message de niveau fatal
 * 
 * @param message - Message à logger
 * @param extra - Données supplémentaires
 */
export function logFatal(message: string, extra?: Extras): void {
  Sentry.addBreadcrumb({
    category: 'log',
    message,
    level: 'fatal',
    data: extra ? { ...extra } : {},
  });
  
  // Capturer également le message comme un événement
  Sentry.captureMessage(message, {
    level: 'fatal',
    extra: extra ? { ...extra } : {},
  });
}


/**
 * Capture une exception avec Sentry
 * 
 * @param error - Erreur à capturer
 * @param context - Contexte additionnel
 */
export function captureException(error: Error, context?: Extras): string {
  return Sentry.captureException(error, {
    extra: context ? { ...context } : {},
  });
}

/**
 * Capture un message avec Sentry
 * 
 * @param message - Message à capturer
 * @param level - Niveau de sévérité
 * @param context - Contexte additionnel
 */
export function captureMessage(
  message: string,
  level: SeverityLevel = 'info',
  context?: Extras
): string {
  return Sentry.captureMessage(message, {
    level,
    extra: context ? { ...context } : {},
  });
}

/**
 * Ajoute un breadcrumb à la trace Sentry
 * 
 * @param message - Message du breadcrumb
 * @param category - Catégorie du breadcrumb
 * @param level - Niveau de sévérité
 * @param data - Données additionnelles
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: SeverityLevel = 'info',
  data?: Extras
): void {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data: data ? { ...data } : {},
  });
}

/**
 * Définit le tag utilisateur pour la session courante
 * 
 * @param walletAddress - Adresse du wallet de l'utilisateur
 */
export function setUserTag(walletAddress: string | null): void {
  Sentry.setUser(
    walletAddress
      ? {
          id: walletAddress,
          username: `wallet:${walletAddress.slice(0, 8)}...`,
          wallet: walletAddress,
        }
      : null
  );
}

/**
 * Définit un tag pour la session courante
 * 
 * @param key - Clé du tag
 * @param value - Valeur du tag
 */
export function setTag(key: string, value: string): void {
  Sentry.setTag(key, value);
}

/**
 * Définit plusieurs tags pour la session courante
 * 
 * @param tags - Tags à définir
 */
export function setTags(tags: Record<string, string>): void {
  Sentry.setTags(tags);
}

/**
 * Définit des données contextuelles pour la session courante
 * 
 * @param name - Nom du contexte
 * @param context - Données contextuelles
 */
export function setContext(name: string, context: Extras): void {
  Sentry.setContext(name, context);
}

/**
 * Wrapper pour try-catch avec capture d'exception Sentry
 * 
 * @param fn - Fonction à exécuter
 * @param errorHandler - Gestionnaire d'erreur optionnel
 * @returns Le résultat de la fonction ou null en cas d'erreur
 */
export function tryCatch<T>(fn: () => T, errorHandler?: (error: Error) => void): T | null {
  try {
    return fn();
  } catch (error) {
    if (error instanceof Error) {
      logError('Une erreur est survenue', {
        function: fn.name || 'anonymous',
        errorMessage: error.message,
        errorStack: error.stack,
      });
      
      captureException(error, {
        function: fn.name || 'anonymous',
      });

      if (errorHandler) {
        errorHandler(error);
      }
    } else {
      logError('Une erreur non-Error est survenue', {
        function: fn.name || 'anonymous',
        error: String(error),
      });
    }

    return null;
  }
}

/**
 * Wrapper pour async try-catch avec capture d'exception Sentry
 * 
 * @param fn - Fonction asynchrone à exécuter
 * @param errorHandler - Gestionnaire d'erreur optionnel
 * @returns Une promesse avec le résultat de la fonction ou null en cas d'erreur
 */
export async function tryCatchAsync<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: Error) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Error) {
      logError('Une erreur asynchrone est survenue', {
        function: fn.name || 'anonymous',
        errorMessage: error.message,
        errorStack: error.stack,
        async: true,
      });
      
      captureException(error, {
        function: fn.name || 'anonymous',
        async: true,
      });

      if (errorHandler) {
        errorHandler(error);
      }
    } else {
      logError('Une erreur asynchrone non-Error est survenue', {
        function: fn.name || 'anonymous',
        error: String(error),
        async: true,
      });
    }

    return null;
  }
}

/**
 * Classe d'erreur personnalisée pour Jupiter Swap
 */
export class JupiterSwapError extends Error {
  public readonly code: string;
  public readonly context: Extras | null;
  public readonly originalError: Error | null;

  constructor(
    message: string,
    code: string,
    context?: Extras | null,
    originalError?: Error | null
  ) {
    super(message);
    this.name = 'JupiterSwapError';
    this.code = code;
    this.context = context || null;
    this.originalError = originalError || null;

    // Capture l'erreur dans Sentry automatiquement
    const extraData: Extras = {
      errorCode: code,
    };
    
    if (context) {
      Object.assign(extraData, context);
    }
    
    if (originalError) {
      extraData.originalError = originalError.message;
    }
    
    captureException(this, extraData);
  }
}
