# Guide de Diagnostic pour Jupiter Swap DApp

Ce document explique comment utiliser les outils de diagnostic intégrés pour identifier et résoudre les problèmes dans l'application Jupiter Swap DApp.

## Scripts de Diagnostic

J'ai ajouté plusieurs scripts de diagnostic au fichier `package.json` pour faciliter le débogage et la détection des problèmes :

### Développement avec Diagnostic Complet

```bash
npm run dev:diag
```

Ce script active :
- Les logs internes de Next.js via `DEBUG=next:*`
- L'affichage détaillé des avertissements avec `--trace-warnings`
- L'affichage détaillé des dépréciations avec `--trace-deprecation`
- Le crash immédiat en cas de promesses non gérées avec `--unhandled-rejections=throw`

Utilisez ce script lorsque vous rencontrez des problèmes difficiles à diagnostiquer ou pour obtenir une vue complète de ce qui se passe sous le capot.

### Analyse du Bundle

```bash
npm run build:analyze
```

Ce script génère un rapport interactif sur la taille et la composition des bundles JavaScript de l'application. Utilisez-le pour identifier les dépendances lourdes et optimiser la taille du bundle.

### Linting en Continu

```bash
npm run lint:watch
```

Ce script exécute ESLint en mode watch, ce qui permet de détecter immédiatement les erreurs de linting pendant que vous codez.

### Vérification de Types en Continu

```bash
npm run type-check:watch
```

Ce script exécute TypeScript en mode watch, ce qui permet de détecter immédiatement les erreurs de typage pendant que vous codez.

## Résolution des Problèmes Courants

### Erreurs Sentry

Si vous rencontrez des avertissements liés à Sentry, vérifiez :
1. La configuration dans `next.config.js`
2. Les fichiers `sentry.*.config.ts`
3. Les fichiers d'instrumentation dans `src/instrumentation*.ts`

### Problèmes de Variables d'Environnement

Si certaines fonctionnalités ne fonctionnent pas correctement, vérifiez :
1. Le fichier `.env.local` pour les variables d'environnement de production
2. Le fichier `.env` pour les variables d'environnement par défaut
3. La validation des variables d'environnement dans `src/utils/config.ts`

### Problèmes de Performance

Si l'application est lente ou peu réactive :
1. Utilisez `npm run build:analyze` pour identifier les dépendances lourdes
2. Vérifiez les composants qui pourraient causer des re-rendus inutiles
3. Assurez-vous que les images sont correctement optimisées avec `next/image`
4. Vérifiez les endpoints RPC Solana pour vous assurer qu'ils répondent rapidement

### Erreurs de Build

Si le build échoue :
1. Vérifiez les erreurs de typage avec `npm run type-check`
2. Vérifiez les erreurs de linting avec `npm run lint`
3. Assurez-vous que toutes les dépendances sont correctement installées
4. Vérifiez les configurations spécifiques à l'environnement de build

## Bonnes Pratiques de Débogage

1. **Isolation** : Isolez le problème en désactivant temporairement certaines fonctionnalités
2. **Logging** : Ajoutez des logs stratégiques pour suivre le flux d'exécution
3. **Environnement** : Testez dans différents environnements pour identifier les problèmes spécifiques
4. **Reproductibilité** : Créez un cas de test minimal qui reproduit le problème
5. **Monitoring** : Utilisez Sentry pour capturer et analyser les erreurs en production

## Ressources Utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Sentry pour Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Documentation Jupiter API](https://station.jup.ag/docs/apis/swap-api)
- [Documentation Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
