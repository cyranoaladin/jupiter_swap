/**
 * Composant Header pour l'interface utilisateur
 * 
 * Ce composant affiche l'en-tête de l'application avec le logo,
 * les liens de navigation et le bouton de connexion du wallet.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function Header() {

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.svg" 
              alt="Jupiter Swap" 
              width={32} 
              height={32} 
              className="h-8 w-8" 
            />
            <span className="font-bold">Jupiter Swap</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <WalletMultiButton className="wallet-adapter-button" />
        </div>
      </div>
    </header>
  );
}
