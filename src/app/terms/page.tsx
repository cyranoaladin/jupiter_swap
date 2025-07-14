/**
 * Page des conditions d'utilisation
 * 
 * @author Manus AI
 */

import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation | Jupiter Swap DApp',
  description: 'Conditions d\'utilisation de Jupiter Swap DApp pour les swaps SOL/USDC sur Solana',
};

export default function TermsPage() {
  return (
    <Container className="py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Conditions d&apos;utilisation</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Acceptation des conditions</h2>
          <p>
            En utilisant Jupiter Swap DApp, vous acceptez d&apos;être lié par ces conditions d&apos;utilisation. 
            Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser cette application.
          </p>
          
          <h2>2. Description du service</h2>
          <p>
            Jupiter Swap DApp est une interface décentralisée permettant d&apos;effectuer des swaps entre SOL et USDC 
            sur la blockchain Solana. L&apos;application utilise l&apos;API Jupiter v6 pour trouver les meilleurs 
            itinéraires de swap et exécuter les transactions.
          </p>
          
          <h2>3. Risques et responsabilités</h2>
          <p>
            L&apos;utilisation de cette application comporte des risques inhérents aux technologies blockchain et DeFi. 
            Les utilisateurs reconnaissent et acceptent ces risques, notamment :
          </p>
          <ul>
            <li>La volatilité des prix des crypto-monnaies</li>
            <li>Les risques de slippage lors des swaps</li>
            <li>Les frais de réseau (gas fees) variables</li>
            <li>Les risques de smart contracts</li>
            <li>Les risques liés à la garde de crypto-monnaies</li>
          </ul>
          
          <h2>4. Optimisations et frais</h2>
          <p>
            L&apos;application implémente des optimisations de slippage et de priority fees pour améliorer l&apos;expérience 
            utilisateur. Une partie des économies réalisées grâce à ces optimisations peut être récupérée par le service.
            Ces mécanismes sont transparents et visibles dans l&apos;interface.
          </p>
          
          <h2>5. Limitation de responsabilité</h2>
          <p>
            Dans toute la mesure permise par la loi applicable, nous déclinons toute responsabilité pour les dommages 
            directs, indirects, accessoires, consécutifs ou punitifs résultant de l&apos;utilisation ou de l&apos;impossibilité 
            d&apos;utiliser notre service.
          </p>
          
          <h2>6. Modifications des conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés 
            des changements importants via l&apos;interface de l&apos;application.
          </p>
          
          <h2>7. Loi applicable</h2>
          <p>
            Ces conditions sont régies par les lois applicables sans égard aux principes de conflits de lois.
          </p>
          
          <p className="mt-8 text-sm text-gray-500">
            Dernière mise à jour : 13 juillet 2025
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
