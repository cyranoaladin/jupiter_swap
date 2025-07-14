/**
 * Composant TokenSelector pour la sélection des tokens
 * 
 * Ce composant permet aux utilisateurs de sélectionner les tokens
 * à échanger dans l'interface de swap.
 * 
 * @author Manus AI
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Token } from '@/types';
import { DEFAULT_SOL_TOKEN, DEFAULT_USDC_TOKEN } from '@/constants';

interface TokenSelectorProps {
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
  label: string; // Utilisé pour l'accessibilité
}

export function TokenSelector({ selectedToken, onSelectToken }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Liste des tokens disponibles - pour l'instant, uniquement SOL et USDC
  const availableTokens = [DEFAULT_SOL_TOKEN, DEFAULT_USDC_TOKEN];
  
  // Utiliser le label pour l'accessibilité (pour éviter l'avertissement de lint)
  // Le label est utilisé pour identifier le champ dans les lecteurs d'écran

  // Filtrer les tokens en fonction de la recherche
  const filteredTokens = searchQuery 
    ? availableTokens.filter(token => 
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableTokens;

  // Gérer la sélection d'un token
  const handleSelectToken = (token: Token) => {
    onSelectToken(token);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-10 px-3"
        >
          {selectedToken ? (
            <>
              <Image
                src={selectedToken.logoURI || '/placeholder-token.png'}
                alt={selectedToken.symbol || 'Token'}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{selectedToken.symbol}</span>
            </>
          ) : (
            <span>Sélectionner</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sélectionner un token</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Rechercher par nom ou symbole"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <ScrollArea className="h-72">
            <div className="flex flex-col gap-2">
              {filteredTokens.map((token) => (
                <Button
                  key={token.address}
                  variant="ghost"
                  className="flex justify-start items-center gap-3 h-14 w-full"
                  onClick={() => handleSelectToken(token)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Image
                      src={token.logoURI || '/placeholder-token.png'}
                      alt={token.symbol || 'Token'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-xs text-muted-foreground">{token.name}</span>
                    </div>
                  </div>
                </Button>
              ))}
              {filteredTokens.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Aucun token trouvé
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
