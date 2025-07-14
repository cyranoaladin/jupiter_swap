/**
 * Composant Footer pour l'interface utilisateur
 * 
 * Ce composant affiche le pied de page de l'application avec les liens
 * vers les réseaux sociaux, les mentions légales et les informations de copyright.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Jupiter Swap. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Conditions d&apos;utilisation
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
