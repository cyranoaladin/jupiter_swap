# Guide de Déploiement - Jupiter Swap DApp

Ce document détaille les étapes nécessaires pour déployer l'application Jupiter Swap DApp en production.

## Prérequis

- Un compte [Vercel](https://vercel.com/) ou [Netlify](https://www.netlify.com/) pour l'hébergement
- Une clé API [Helius](https://helius.xyz/) pour des RPC Solana fiables (recommandé)
- Un wallet Solana dédié pour la récupération des économies d'optimisation

## Variables d'Environnement Requises

Configurez ces variables dans votre plateforme d'hébergement :

```
# Configuration Solana
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Configuration Helius (fortement recommandé pour la production)
NEXT_PUBLIC_HELIUS_API_KEY=votre_clé_api_helius_ici

# Configuration du wallet de service pour la récupération des économies
NEXT_PUBLIC_SERVICE_WALLET=adresse_de_votre_wallet_de_service

# Configuration des optimisations
NEXT_PUBLIC_ENABLE_DYNAMIC_SLIPPAGE=true
NEXT_PUBLIC_ENABLE_SMART_PRIORITY_FEES=true
NEXT_PUBLIC_DEFAULT_SLIPPAGE_BPS=50
NEXT_PUBLIC_MAX_SLIPPAGE_BPS=500
NEXT_PUBLIC_DEFAULT_PRIORITY_FEE=10000
NEXT_PUBLIC_MAX_PRIORITY_FEE=1000000
NEXT_PUBLIC_SERVICE_FEE_PERCENTAGE=0.25
NEXT_PUBLIC_MIN_SAVINGS_THRESHOLD=0.01

# Configuration des fonctionnalités
NEXT_PUBLIC_ENABLE_FEE_RECOVERY=true
NEXT_PUBLIC_ENABLE_TRANSACTION_HISTORY=true
NEXT_PUBLIC_ENABLE_ADVANCED_ANALYTICS=true

# Configuration API
NEXT_PUBLIC_API_TIMEOUT=30000

# Monitoring (optionnel mais recommandé)
NEXT_PUBLIC_SENTRY_DSN=votre_dsn_sentry
```

## Étapes de Déploiement avec Vercel

1. **Préparation du projet**

```bash
# Vérifiez que tout fonctionne localement
npm run lint
npm run build
npm run test
```

2. **Déploiement avec Vercel CLI**

```bash
# Installation de Vercel CLI
npm install -g vercel

# Connexion à votre compte
vercel login

# Déploiement en production
vercel --prod
```

3. **Déploiement via l'interface Vercel**

- Connectez-vous à [Vercel](https://vercel.com/)
- Importez votre projet depuis GitHub/GitLab/Bitbucket
- Configurez les variables d'environnement
- Déployez

## Étapes de Déploiement avec Netlify

1. **Préparation du projet**

Créez un fichier `netlify.toml` à la racine du projet :

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. **Déploiement avec Netlify CLI**

```bash
# Installation de Netlify CLI
npm install -g netlify-cli

# Connexion à votre compte
netlify login

# Déploiement en production
netlify deploy --prod
```

3. **Déploiement via l'interface Netlify**

- Connectez-vous à [Netlify](https://app.netlify.com/)
- Importez votre projet depuis GitHub/GitLab/Bitbucket
- Configurez les variables d'environnement
- Déployez

## Vérifications Post-Déploiement

- [ ] Vérifiez que la connexion wallet fonctionne correctement
- [ ] Testez un swap SOL vers USDC
- [ ] Testez un swap USDC vers SOL
- [ ] Vérifiez que les optimisations de slippage fonctionnent
- [ ] Vérifiez que les priority fees sont correctement calculés
- [ ] Confirmez que la récupération des économies fonctionne
- [ ] Vérifiez que l'interface est responsive sur mobile
- [ ] Testez les messages d'erreur et la gestion des erreurs

## Monitoring et Maintenance

- Configurez des alertes Sentry pour les erreurs
- Mettez en place un monitoring des performances
- Planifiez des mises à jour régulières des dépendances
- Surveillez les coûts RPC et optimisez si nécessaire

## Sécurité

- Effectuez des audits de sécurité réguliers
- Surveillez les transactions suspectes
- Mettez à jour régulièrement les dépendances pour corriger les vulnérabilités
- Limitez l'accès aux variables d'environnement sensibles

## Support

En cas de problème lors du déploiement, consultez :
- La [documentation Next.js](https://nextjs.org/docs/deployment)
- La [documentation Vercel](https://vercel.com/docs)
- La [documentation Netlify](https://docs.netlify.com/)
- Le [Discord Jupiter](https://discord.gg/jup)
