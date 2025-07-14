/**
 * Composant ErrorBoundary pour capturer les erreurs React
 * 
 * Ce composant permet de capturer les erreurs qui se produisent
 * dans l'arbre des composants enfants et d'afficher un fallback
 * au lieu de faire planter toute l'application.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Ici, vous pourriez envoyer l'erreur à un service de monitoring comme Sentry
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
