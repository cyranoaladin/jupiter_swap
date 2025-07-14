/**
 * Page de politique de confidentialité
 * 
 * @author Manus AI
 */

import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Jupiter Swap DApp',
  description: 'Politique de confidentialité de Jupiter Swap DApp pour les swaps SOL/USDC sur Solana',
};

export default function PrivacyPage() {
  return (
    <Container className="py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Politique de confidentialité</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Collecte des données</h2>
          <p>
            Jupiter Swap DApp est conçu pour minimiser la collecte de données personnelles. 
            Nous ne collectons que les données nécessaires au fonctionnement de l&apos;application :
          </p>
          <ul>
            <li>Adresses de portefeuille Solana (publiques par nature)</li>
            <li>Données de transaction (publiques sur la blockchain)</li>
            <li>Métriques d&apos;utilisation anonymisées</li>
            <li>Journaux d&apos;erreurs pour le dépannage</li>
          </ul>
          
          <h2>2. Utilisation des données</h2>
          <p>
            Les données collectées sont utilisées uniquement pour :
          </p>
          <ul>
            <li>Faciliter les transactions de swap</li>
            <li>Améliorer l&apos;expérience utilisateur</li>
            <li>Résoudre les problèmes techniques</li>
            <li>Analyser les performances de l&apos;application</li>
          </ul>
          
          <h2>3. Données stockées localement</h2>
          <p>
            Certaines données peuvent être stockées localement dans votre navigateur :
          </p>
          <ul>
            <li>Préférences utilisateur</li>
            <li>Historique récent des transactions</li>
            <li>Connexion au portefeuille</li>
          </ul>
          <p>
            Ces données ne quittent pas votre appareil et peuvent être effacées en vidant le cache de votre navigateur.
          </p>
          
          <h2>4. Partage des données</h2>
          <p>
            Nous ne vendons ni ne partageons vos données personnelles avec des tiers, à l&apos;exception de :
          </p>
          <ul>
            <li>Services nécessaires au fonctionnement de l&apos;application (RPC Helius, Jupiter API)</li>
            <li>Services de monitoring des erreurs (Sentry)</li>
          </ul>
          
          <h2>5. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre tout accès, 
            altération, divulgation ou destruction non autorisés.
          </p>
          
          <h2>6. Vos droits</h2>
          <p>
            Vous avez le droit d&apos;accéder, de corriger ou de supprimer vos données personnelles. 
            Pour exercer ces droits, veuillez nous contacter.
          </p>
          
          <h2>7. Modifications de la politique</h2>
          <p>
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. 
            Les modifications seront publiées sur cette page.
          </p>
          
          <p className="mt-8 text-sm text-gray-500">
            Dernière mise à jour : 13 juillet 2025
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
