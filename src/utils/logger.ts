/**
 * Utilitaires de logging pour Jupiter Swap DApp
 * 
 * Ce fichier fournit des utilitaires pour le logging structuré
 * et la gestion d'erreurs dans l'application.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import * as Sentry from '@sentry/nextjs';
import type { SeverityLevel } from '@sentry/types';

/**
 * Interface pour les contextes de log structurés
 */
export interface LogContext {
  context?: Record<string, any>;
  [key: string]: any;
}

/**
 * Type pour les données supplémentaires
 */
type Extras = LogContext;

/**
 * Logger structuré pour l'application
 */
export const sentryLogger = {
  /**
   * Log un message de niveau trace
   * 
   * @param message - Message à logger
   * @param error - Erreur optionnelle
   * @param extras - Données supplémentaires
   */
  trace: (message: string, error?: Error | null, extras?: Extras): void => {
    Sentry.addBreadcrumb({
      category: 'log',
      message,
      level: 'debug',
      data: { ...extras },
    });
    console.debug(`[TRACE] ${message}`, error || '', extras || '');
  },

  /**
   * Log un message de niveau debug
   * 
   * @param message - Message à logger
   * @param error - Erreur optionnelle
   * @param extras - Données supplémentaires
   */
  debug: (message: string, error?: Error | null, extras?: Extras): void => {
    Sentry.addBreadcrumb({
      category: 'log',
      message,
      level: 'debug',
      data: { ...extras },
    });
    console.debug(`[DEBUG] ${message}`, error || '', extras || '');
  },

  /**
   * Log un message de niveau info
   * 
   * @param message - Message à logger
   * @param error - Erreur optionnelle
   * @param extras - Données supplémentaires
   */
  info: (message: string, error?: Error | null, extras?: Extras): void => {
    Sentry.addBreadcrumb({
      category: 'log',
      message,
      level: 'info',
      data: { ...extras },
    });
    console.info(`[INFO] ${message}`, error || '', extras || '');
  },

  /**
   * Log un message de niveau warning
   * 
   * @param message - Message à logger
   * @param error - Erreur optionnelle
   * @param extras - Données supplémentaires
   */
  warn: (message: string, error?: Error | null, extras?: Extras): void => {
    Sentry.addBreadcrumb({
      category: 'log',
      message,
      level: 'warning',
      data: { ...extras },
    });
    console.warn(`[WARN] ${message}`, error || '', extras || '');
  },

  /**
   * Log un message de niveau error
   * 
   * @param message - Message à logger
   * @param error - Erreur optionnelle
   * @param extras - Données supplémentaires
   */
  error: (message: string, error?: Error | null, extras?: Extras): void => {
    if (error) {
      Sentry.captureException(error, {
        extra: extras ? { message, ...extras } : { message },
      });
    } else {
      Sentry.captureMessage(message, 'error');
      if (extras) {
        const scope = new Sentry.Scope();
        scope.setExtras(extras);
        Sentry.captureMessage(message, scope);
      }
    }
    console.error(`[ERROR] ${message}`, error || '', extras || '');
  },

  /**
   * Log un message de niveau fatal
   * 
   * @param message - Message à logger
   * @param error - Erreur optionnelle
   * @param extras - Données supplémentaires
   */
  fatal: (message: string, error?: Error | null, extras?: Extras): void => {
    if (error) {
      Sentry.captureException(error, {
        extra: extras ? { message, ...extras } : { message },
      });
    } else {
      Sentry.captureMessage(message, 'fatal');
      if (extras) {
        const scope = new Sentry.Scope();
        scope.setExtras(extras);
        Sentry.captureMessage(message, scope);
      }
    }
    console.error(`[FATAL] ${message}`, error || '', extras || '');
  },

  /**
   * Capture une exception avec Sentry
   * 
   * @param error - Erreur à capturer
   * @param extras - Données supplémentaires
   * @returns L'identifiant de l'événement Sentry
   */
  captureException: (error: Error, extras?: Extras): string => {
    if (extras) {
      const scope = new Sentry.Scope();
      scope.setExtras(extras);
      return Sentry.captureException(error, scope);
    }
    return Sentry.captureException(error);
  },

  /**
   * Capture un message avec Sentry
   * 
   * @param message - Message à capturer
   * @param level - Niveau de sévérité
   * @param extras - Données supplémentaires
   * @returns L'identifiant de l'événement Sentry
   */
  captureMessage: (
    message: string,
    level: SeverityLevel = 'info',
    extras?: Extras
  ): string => {
    if (extras) {
      const scope = new Sentry.Scope();
      scope.setLevel(level);
      scope.setExtras(extras);
      return Sentry.captureMessage(message, scope);
    }
    return Sentry.captureMessage(message, level);
  },
};

/**
 * Fonctions utilitaires pour le tracing et le tagging
 */
export const withUiSpan = (componentName: string, actionName: string, callback: () => any): any => {
  try {
    return callback();
  } catch (error) {
    sentryLogger.error(`Erreur dans ${componentName}:${actionName}`, error as Error);
    throw error;
  }
};

export const withBlockchainSpan = async <T>(operation: string, details: string, callback: () => Promise<T>): Promise<T> => {
  try {
    return await callback();
  } catch (error) {
    sentryLogger.error(`Erreur blockchain dans ${operation}: ${details}`, error as Error);
    throw error;
  }
};

export const setUserTag = (walletAddress: string | null): void => {
  if (walletAddress) {
    Sentry.setUser({ id: walletAddress });
  } else {
    Sentry.setUser(null);
  }
};

export const setTags = (tags: Record<string, string>): void => {
  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value);
  });
};

export const tryCatchAsync = async <T>(fn: () => Promise<T>, errorHandler?: (error: Error) => void): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    const typedError = error as Error;
    sentryLogger.error('Erreur asynchrone', typedError);
    if (errorHandler) {
      errorHandler(typedError);
    }
    return null;
  }
};
