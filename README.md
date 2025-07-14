# 🚀 Jupiter Swap DApp - Trading DeFi Optimisé

<div align="center">

![Jupiter Swap Logo](./public/logo.png)

**Plateforme de trading DeFi avancée avec optimisations automatiques de slippage et priority fees**

[![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-purple?style=for-the-badge&logo=solana)](https://solana.com/)
[![Jupiter](https://img.shields.io/badge/Jupiter-API%20v6-green?style=for-the-badge)](https://jup.ag/)

[🌐 Demo Live](https://jupiter-swap.vercel.app) • [📖 Documentation](./docs) • [🐛 Signaler un Bug](./issues) • [💡 Demander une Fonctionnalité](./issues)

</div>

---

## 📋 Table des Matières

- [🎯 Aperçu](#-aperçu)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🔧 Développement](#-développement)
- [🚢 Déploiement](#-déploiement)
- [📊 Monitoring](#-monitoring)
- [🧪 Tests](#-tests)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

---

## 🎯 Aperçu

Jupiter Swap est une DApp (Application Décentralisée) de trading avancée construite sur Solana qui révolutionne l'expérience de swap avec des **optimisations automatiques transparentes**. 

### 🌟 Innovation Clé

Notre plateforme utilise des algorithmes propriétaires pour :
- **Optimiser automatiquement le slippage** basé sur les conditions de marché en temps réel
- **Calculer les priority fees optimaux** pour une confirmation rapide
- **Récupérer les économies réalisées** de manière transparente
- **Offrir une expérience utilisateur fluide** avec des métriques détaillées

### 💡 Proposition de Valeur

```
🎯 Problème Résolu : Les traders perdent de l'argent avec des slippages et fees non optimisés
💰 Solution Apportée : Optimisations automatiques avec récupération transparente des économies
🚀 Résultat : Économies moyennes de 15-30% sur les coûts de trading
```

---

## ✨ Fonctionnalités

### 🔄 Trading Avancé

- **Swap SOL/USDC bidirectionnel** avec Jupiter API v6
- **Dynamic Slippage** : Optimisation automatique basée sur volatilité et liquidité
- **Priority Fees intelligents** : Calcul optimal pour confirmation rapide
- **Simulation de transaction** avant envoi pour éviter les échecs
- **Retry automatique** avec backoff exponentiel

### 💰 Optimisations Économiques

- **Récupération transparente des économies** (configurable)
- **Métriques en temps réel** des économies réalisées
- **Comparaison avant/après** pour chaque transaction
- **Historique détaillé** des optimisations

### 🛡️ Sécurité et Fiabilité

- **Validation stricte** des montants et adresses
- **Gestion d'erreurs robuste** avec messages utilisateur clairs
- **Fallback RPC automatique** pour haute disponibilité
- **Monitoring complet** avec Sentry et analytics

### 🎨 Interface Utilisateur

- **Design moderne** avec thème sombre/clair
- **Responsive** : Optimisé mobile, tablette, desktop
- **Animations fluides** et feedback visuel
- **Accessibilité** : Support clavier et lecteurs d'écran

### 🔌 Intégrations

- **Wallets Solana** : Phantom, Solflare, Backpack, Ledger, etc.
- **Jupiter API v6** : Dernière version avec toutes les optimisations
- **RPC Premium** : Helius, QuickNode, Ankr avec fallback
- **Analytics** : Google Analytics, métriques personnalisées

---

## 🏗️ Architecture

### 📁 Structure du Projet

```
jupiter-swap-nextjs/
├── 📂 src/
│   ├── 📂 app/                    # App Router Next.js 13+
│   │   ├── layout.tsx             # Layout principal avec providers
│   │   ├── page.tsx               # Page d'accueil
│   │   └── globals.css            # Styles globaux
│   ├── 📂 components/             # Composants React
│   │   ├── 📂 ui/                 # Composants UI de base (shadcn/ui)
│   │   ├── 📂 swap/               # Composants de trading
│   │   ├── 📂 wallet/             # Composants wallet
│   │   ├── 📂 analytics/          # Composants analytics
│   │   └── 📂 layout/             # Composants de layout
│   ├── 📂 services/               # Services métier
│   │   ├── jupiter.ts             # Service Jupiter API
│   │   ├── optimization.ts        # Service d'optimisation
│   │   ├── solana.ts              # Service Solana
│   │   ├── swap.ts                # Service de swap principal
│   │   └── rpc-manager.ts         # Gestionnaire RPC
│   ├── 📂 hooks/                  # Hooks React personnalisés
│   ├── 📂 store/                  # État global (Zustand)
│   ├── 📂 types/                  # Types TypeScript
│   ├── 📂 utils/                  # Utilitaires et helpers
│   ├── 📂 constants/              # Constantes de l'application
│   └── 📂 lib/                    # Bibliothèques et configuration
├── 📂 public/                     # Assets statiques
├── 📂 docs/                       # Documentation
├── 📂 tests/                      # Tests automatisés
├── 📄 package.json                # Dépendances et scripts
├── 📄 tsconfig.json               # Configuration TypeScript
├── 📄 tailwind.config.js          # Configuration Tailwind CSS
├── 📄 next.config.js              # Configuration Next.js
└── 📄 README.md                   # Ce fichier
```

### 🔧 Stack Technologique

#### Frontend
- **Next.js 13+** : Framework React avec App Router
- **TypeScript 5+** : Typage statique strict
- **Tailwind CSS** : Framework CSS utilitaire
- **shadcn/ui** : Composants UI modernes
- **Framer Motion** : Animations fluides

#### Blockchain
- **Solana Web3.js** : Interactions blockchain
- **Wallet Adapter** : Connexion multi-wallets
- **Jupiter API v6** : Agrégation de liquidité
- **SPL Token** : Gestion des tokens Solana

#### État et Données
- **Zustand** : Gestion d'état global
- **React Query** : Cache et synchronisation des données
- **React Hook Form** : Gestion des formulaires

#### Outils et Qualité
- **ESLint + Prettier** : Linting et formatage
- **Husky + lint-staged** : Git hooks
- **Jest + Testing Library** : Tests unitaires
- **Playwright** : Tests end-to-end

---

## 🚀 Installation

### 📋 Prérequis

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **npm** ou **yarn** ou **pnpm**
- **Git** ([Télécharger](https://git-scm.com/))

### 🔽 Cloner le Projet

```bash
# Cloner le repository
git clone https://github.com/votre-username/jupiter-swap-nextjs.git

# Naviguer dans le dossier
cd jupiter-swap-nextjs

# Installer les dépendances
npm install
# ou
yarn install
# ou
pnpm install
```

### 🔑 Configuration des Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Éditer le fichier avec vos clés API
nano .env.local
```

**Variables essentielles à configurer :**

```env
# RPC Endpoints (au moins un requis)
NEXT_PUBLIC_RPC_ENDPOINTS="https://mainnet.helius-rpc.com/?api-key=YOUR_KEY"
HELIUS_API_KEY=your_helius_api_key

# Wallet de récupération des fees
NEXT_PUBLIC_FEE_RECOVERY_WALLET=your_wallet_address

# Monitoring (optionnel)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
```

### 🏃‍♂️ Lancer en Développement

```bash
# Démarrer le serveur de développement
npm run dev

# L'application sera disponible sur http://localhost:3000
```

---

## ⚙️ Configuration

### 🔧 Configuration Avancée

#### RPC Endpoints

Configurez plusieurs endpoints pour la haute disponibilité :

```env
NEXT_PUBLIC_RPC_ENDPOINTS="
https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY,
https://rpc.ankr.com/solana,
https://api.mainnet-beta.solana.com
"
```

#### Optimisations

Personnalisez les paramètres d'optimisation :

```env
# Slippage par défaut (50 = 0.5%)
NEXT_PUBLIC_DEFAULT_SLIPPAGE_BPS=50

# Pourcentage de récupération (2000 = 20%)
NEXT_PUBLIC_FEE_RECOVERY_PERCENTAGE_BPS=2000

# Montant minimum pour récupération
NEXT_PUBLIC_MIN_RECOVERY_AMOUNT_USD=0.01
```

#### Monitoring

Configurez le monitoring pour la production :

```env
# Sentry pour les erreurs
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 🎨 Personnalisation du Thème

Modifiez les couleurs dans `tailwind.config.js` :

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(258 90% 66%)', // Solana Purple
          foreground: 'hsl(210 40% 98%)',
        },
        accent: {
          DEFAULT: 'hsl(142 76% 36%)', // Jupiter Green
          foreground: 'hsl(210 40% 98%)',
        },
      },
    },
  },
};
```

---

## 🔧 Développement

### 📝 Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linting ESLint
npm run lint:fix     # Correction automatique
npm run type-check   # Vérification TypeScript

# Tests
npm run test         # Tests unitaires
npm run test:watch   # Tests en mode watch
npm run test:e2e     # Tests end-to-end
npm run test:coverage # Coverage des tests

# Qualité
npm run format       # Formatage Prettier
npm run analyze      # Analyse des bundles
npm run audit        # Audit de sécurité
```

### 🧪 Développement Local

#### 1. Configuration du Wallet de Test

```typescript
// Utilisez un wallet de test pour le développement
const TEST_WALLET = new PublicKey('YOUR_TEST_WALLET_ADDRESS');
```

#### 2. Mode Développement

```env
# Activez les logs détaillés
NEXT_PUBLIC_ENABLE_DEBUG_LOGS=true

# Utilisez le devnet pour les tests
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

#### 3. Hot Reload

Le projet utilise Next.js Fast Refresh pour un rechargement instantané des modifications.

### 🔍 Debugging

#### Logs Structurés

```typescript
import { logError, logInfo } from '@/services/errors';

// Log d'information
logInfo('Swap initiated', { 
  inputToken: 'SOL', 
  outputToken: 'USDC', 
  amount: 1.5 
});

// Log d'erreur avec contexte
logError(error, { 
  context: 'Swap execution',
  userPublicKey: wallet.publicKey?.toString(),
  transactionSignature: signature 
});
```

#### React Query Devtools

```env
# Activez les devtools en développement
NEXT_PUBLIC_ENABLE_RQ_DEVTOOLS=true
```

---

## 🚢 Déploiement

### 🌐 Déploiement Vercel (Recommandé)

#### 1. Préparation

```bash
# Build et test local
npm run build
npm run start

# Vérification des types
npm run type-check

# Tests complets
npm run test
npm run test:e2e
```

#### 2. Déploiement

```bash
# Installation de Vercel CLI
npm i -g vercel

# Déploiement
vercel

# Configuration des variables d'environnement
vercel env add NEXT_PUBLIC_RPC_ENDPOINTS
vercel env add HELIUS_API_KEY
vercel env add NEXT_PUBLIC_FEE_RECOVERY_WALLET
```

#### 3. Configuration Vercel

Créez `vercel.json` :

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/**/*.tsx": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 🐳 Déploiement Docker

#### Dockerfile

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  jupiter-swap:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_RPC_ENDPOINTS=${RPC_ENDPOINTS}
      - HELIUS_API_KEY=${HELIUS_API_KEY}
    restart: unless-stopped
```

### ☁️ Autres Plateformes

#### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Railway

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## 📊 Monitoring

### 🔍 Métriques Clés

#### Performance
- **Temps de chargement** : < 2s pour First Contentful Paint
- **Temps de swap** : < 5s en moyenne
- **Taux de succès** : > 99%
- **Disponibilité** : > 99.9%

#### Business
- **Volume de trading** quotidien/mensuel
- **Économies générées** pour les utilisateurs
- **Nombre de swaps** réussis
- **Wallets actifs** uniques

### 📈 Dashboards

#### Sentry (Erreurs)

```typescript
// Configuration Sentry
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filtrer les erreurs sensibles
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.value?.includes('private key')) {
        return null; // Ne pas envoyer
      }
    }
    return event;
  },
});
```

#### Google Analytics (Usage)

```typescript
// Tracking des événements métier
gtag('event', 'swap_completed', {
  event_category: 'trading',
  event_label: `${inputToken}-${outputToken}`,
  value: Math.round(amountUSD),
  custom_parameters: {
    slippage_optimized: optimizationEnabled,
    savings_usd: savingsAmount,
  },
});
```

#### Métriques Personnalisées

```typescript
// Service de métriques
export class MetricsService {
  static trackSwap(data: SwapMetrics) {
    // Envoyer vers votre backend analytics
    fetch('/api/metrics/swap', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  static trackOptimization(savings: OptimizationSavings) {
    // Tracker les économies réalisées
    this.trackEvent('optimization_applied', {
      slippage_savings: savings.slippageSavingsUsd,
      fee_savings: savings.feeSavingsUsd,
      total_savings: savings.totalSavingsUsd,
    });
  }
}
```

---

## 🧪 Tests

### 🔬 Tests Unitaires

```bash
# Lancer tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Coverage complet
npm run test:coverage
```

#### Exemple de Test

```typescript
// tests/services/jupiter.test.ts
import { JupiterService } from '@/services/jupiter';

describe('JupiterService', () => {
  let service: JupiterService;
  
  beforeEach(() => {
    service = new JupiterService();
  });
  
  it('should get quote for SOL to USDC', async () => {
    const quote = await service.getQuote({
      inputMint: SOL_MINT,
      outputMint: USDC_MINT,
      amount: '1000000000', // 1 SOL
      slippageBps: 50,
    });
    
    expect(quote).toBeDefined();
    expect(quote.outAmount).toBeTruthy();
    expect(parseFloat(quote.priceImpactPct)).toBeLessThan(5);
  });
});
```

### 🎭 Tests End-to-End

```bash
# Installation Playwright
npx playwright install

# Lancer les tests E2E
npm run test:e2e

# Mode interactif
npm run test:e2e:ui
```

#### Exemple de Test E2E

```typescript
// tests/e2e/swap.spec.ts
import { test, expect } from '@playwright/test';

test('complete swap flow', async ({ page }) => {
  await page.goto('/');
  
  // Connecter le wallet
  await page.click('[data-testid="connect-wallet"]');
  await page.click('[data-testid="phantom-wallet"]');
  
  // Configurer le swap
  await page.fill('[data-testid="input-amount"]', '0.1');
  await page.click('[data-testid="token-selector-output"]');
  await page.click('[data-testid="token-usdc"]');
  
  // Vérifier le quote
  await expect(page.locator('[data-testid="output-amount"]')).toBeVisible();
  
  // Exécuter le swap
  await page.click('[data-testid="swap-button"]');
  await page.click('[data-testid="confirm-swap"]');
  
  // Vérifier le succès
  await expect(page.locator('[data-testid="swap-success"]')).toBeVisible();
});
```

### 🔄 Tests d'Intégration

```typescript
// tests/integration/optimization.test.ts
describe('Optimization Integration', () => {
  it('should apply dynamic slippage optimization', async () => {
    const mockMarketData = {
      volatility: 0.15,
      liquidity: 1000000,
      spread: 0.002,
    };
    
    const optimizedQuote = await optimizationService.optimizeQuote(
      baseQuote,
      mockMarketData
    );
    
    expect(optimizedQuote.slippageBps).toBeLessThan(baseQuote.slippageBps);
    expect(optimizedQuote.savings).toBeGreaterThan(0);
  });
});
```

---

## 🤝 Contribution

### 🌟 Comment Contribuer

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### 📋 Guidelines

#### Code Style

```bash
# Formatage automatique
npm run format

# Vérification du linting
npm run lint

# Vérification des types
npm run type-check
```

#### Commits

Utilisez [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: add dynamic slippage optimization
fix: resolve wallet connection issue
docs: update installation guide
style: improve button hover effects
refactor: optimize quote caching logic
test: add swap integration tests
```

#### Pull Requests

- **Titre clair** décrivant le changement
- **Description détaillée** avec contexte et motivation
- **Tests** couvrant les nouvelles fonctionnalités
- **Screenshots** pour les changements UI
- **Breaking changes** clairement documentés

### 🐛 Signaler des Bugs

Utilisez le [template d'issue](.github/ISSUE_TEMPLATE/bug_report.md) :

```markdown
**Describe the bug**
Description claire et concise du bug.

**To Reproduce**
1. Aller à '...'
2. Cliquer sur '....'
3. Faire défiler jusqu'à '....'
4. Voir l'erreur

**Expected behavior**
Description de ce qui devrait se passer.

**Screenshots**
Si applicable, ajoutez des captures d'écran.

**Environment:**
- OS: [e.g. macOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
- Wallet: [e.g. Phantom]
```

---

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2024 Jupiter Swap Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Remerciements

- **[Jupiter](https://jup.ag/)** pour l'excellente API d'agrégation
- **[Solana](https://solana.com/)** pour la blockchain haute performance
- **[Next.js](https://nextjs.org/)** pour le framework React
- **[shadcn/ui](https://ui.shadcn.com/)** pour les composants UI
- **[Vercel](https://vercel.com/)** pour l'hébergement et le déploiement

---

## 📞 Support

- **Documentation** : [docs.jupiter-swap.com](https://docs.jupiter-swap.com)
- **Discord** : [Rejoindre notre serveur](https://discord.gg/jupiter-swap)
- **Twitter** : [@JupiterSwap](https://twitter.com/JupiterSwap)
- **Email** : support@jupiter-swap.com

---

<div align="center">

**Fait avec ❤️ par l'équipe Jupiter Swap**

[⭐ Star ce projet](https://github.com/votre-username/jupiter-swap-nextjs) si vous l'aimez !

</div>

