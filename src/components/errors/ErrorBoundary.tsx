"use client";

/**
 * Composant ErrorBoundary pour Jupiter Swap DApp
 * 
 * Ce composant capture les erreurs React et les envoie à Sentry
 * tout en affichant une interface utilisateur de repli.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { sentryLogger } from '@/utils/logger';

/**
 * Interface pour les propriétés du composant ErrorBoundary
 */
interface ErrorBoundaryProps {
  /** Composants enfants à rendre */
  children: ReactNode;
  /** Titre personnalisé pour l'erreur */
  errorTitle?: string;
  /** Description personnalisée pour l'erreur */
  errorDescription?: string;
  /** Fonction de rappel appelée lorsqu'une erreur est capturée */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Composant de repli à afficher en cas d'erreur */
  fallback?: ReactNode;
}

/**
 * Interface pour l'état du composant ErrorBoundary
 */
interface ErrorBoundaryState {
  /** Indique si une erreur a été capturée */
  hasError: boolean;
  /** L'erreur capturée */
  error: Error | null;
}

/**
 * Composant ErrorBoundary
 * Capture les erreurs React et les envoie à Sentry
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Méthode statique getDerivedStateFromError
   * Met à jour l'état pour indiquer qu'une erreur a été capturée
   * 
   * @param error - L'erreur capturée
   * @returns Le nouvel état
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Méthode componentDidCatch
   * Capture l'erreur et l'envoie à Sentry
   * 
   * @param error - L'erreur capturée
   * @param errorInfo - Informations sur l'erreur
   */
  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Envoyer l'erreur à Sentry
    Sentry.withScope((scope) => {
      scope.setExtras({
        componentStack: errorInfo.componentStack,
      });
      Sentry.captureException(error);
    });

    // Logger l'erreur
    sentryLogger.error('Erreur React non gérée', error, {
      componentStack: errorInfo.componentStack,
    });

    // Appeler la fonction de rappel onError si elle existe
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Méthode pour réinitialiser l'état d'erreur
   */
  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  /**
   * Méthode render
   * Affiche le composant de repli si une erreur a été capturée
   * ou les composants enfants si aucune erreur n'a été capturée
   * 
   * @returns Le composant à rendre
   */
  override render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, errorTitle, errorDescription, fallback } = this.props;

    if (hasError) {
      // Si un composant de repli personnalisé est fourni, l'utiliser
      if (fallback) {
        return fallback;
      }

      // Sinon, afficher le composant de repli par défaut
      return (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle>{errorTitle || "Quelque chose s'est mal passé"}</CardTitle>
            <CardDescription>
              {errorDescription || "Une erreur s'est produite lors du chargement de cette section."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Message d&apos;erreur: {error?.message || "Erreur inconnue"}</p>
              <p className="mt-2">
                Cette erreur a été automatiquement signalée à notre équipe technique.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={this.resetErrorBoundary} className="w-full">
              Réessayer
            </Button>
          </CardFooter>
        </Card>
      );
    }

    // Si aucune erreur n'a été capturée, rendre les composants enfants
    return children;
  }
}

/**
 * Composant ErrorBoundaryGroup
 * Groupe plusieurs ErrorBoundary pour isoler les erreurs par section
 * 
 * @param props - Les propriétés du composant
 * @returns Le composant à rendre
 */
export function ErrorBoundaryGroup({
  children,
  name,
}: {
  children: ReactNode;
  name: string;
}): JSX.Element {
  return (
    <ErrorBoundary
      errorTitle={`Erreur dans ${name}`}
      errorDescription={`Une erreur s'est produite dans la section ${name}.`}
      onError={(error) => {
        sentryLogger.error(`Erreur dans la section ${name}`, error, {
          section: name,
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
