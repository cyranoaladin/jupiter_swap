# 🧠 Mémoires Windsurf Cascade - Jupiter Swap DApp

## 📋 Vue d'Ensemble des Mémoires

Les mémoires Windsurf permettent de persister le contexte et les connaissances spécifiques au projet Jupiter Swap. Ces mémoires guident Cascade dans ses décisions et améliorent la qualité des corrections et optimisations.

---

## 🎯 Mémoires Fondamentales du Projet

### Mémoire 1 : Architecture du Projet Jupiter Swap

```markdown
**Titre** : Architecture et Structure Jupiter Swap DApp
**Type** : Mémoire Technique
**Contexte** : Projet Next.js 13+ avec TypeScript pour trading DeFi sur Solana

**Contenu** :
Le projet Jupiter Swap est une DApp de trading avancée construite avec :
- Next.js 13+ avec App Router et TypeScript strict
- Architecture en services séparés (jupiter.ts, optimization.ts, solana.ts, swap.ts, rpc-manager.ts)
- Composants UI basés sur shadcn/ui avec Tailwind CSS
- Gestion d'état avec Zustand et React Query
- Intégration Jupiter API v6 pour les swaps
- Optimisations automatiques de slippage et priority fees
- Récupération transparente des économies réalisées
- Monitoring avec Sentry et analytics personnalisées

**Points Critiques** :
- Respecter la séparation des responsabilités entre services
- Maintenir le typage TypeScript strict
- Préserver la logique d'optimisation dans optimization.ts
- Utiliser le RPC manager pour la résilience blockchain
- Implémenter la gestion d'erreurs robuste partout
```

### Mémoire 2 : Cahier des Charges et Exigences

```markdown
**Titre** : Exigences Fonctionnelles Jupiter Swap
**Type** : Mémoire Métier
**Contexte** : Spécifications client pour l'interface de swap SOL/USDC

**Contenu** :
Fonctionnalités OBLIGATOIRES à implémenter :
1. Interface SOL/USDC bidirectionnelle (sol vers usdc ET usdc vers sol)
2. Transactions sur Solana mainnet exclusivement
3. Utilisation Jupiter API v6 pour tous les swaps
4. Affichage des soldes SOL et USDC à la connexion wallet
5. Optimisation automatique des slippages et fees
6. Récupération transparente des économies dans un wallet défini
7. Affichage des slippages et fees standards à l'utilisateur
8. Réduction invisible des coûts avec récupération de la différence

**Critères de Succès** :
- Application 100% fonctionnelle sans erreurs
- Conformité totale aux spécifications
- Performance optimisée pour la production
- Interface utilisateur intuitive et responsive
- Sécurité blockchain validée
```

### Mémoire 3 : Optimisations Spécifiques Jupiter

```markdown
**Titre** : Algorithmes d'Optimisation Jupiter Swap
**Type** : Mémoire Technique
**Contexte** : Logique métier pour les optimisations de trading

**Contenu** :
Implémentation des optimisations avancées :

**Dynamic Slippage** :
- Analyse des conditions de marché en temps réel
- Calcul basé sur volatilité, liquidité, et spread
- Réduction intelligente du slippage sans impact utilisateur
- Formule : optimizedSlippage = baseSlippage * (1 - optimizationFactor)

**Priority Fees Intelligents** :
- Analyse du réseau Solana en temps réel
- Calcul optimal pour confirmation rapide
- Équilibrage coût/vitesse automatique
- Monitoring des performances de confirmation

**Récupération des Économies** :
- Calcul transparent des économies réalisées
- Transfert automatique vers wallet de récupération
- Affichage des métriques à l'utilisateur
- Historique détaillé des optimisations

**Points d'Attention** :
- Ne jamais compromettre la sécurité pour l'optimisation
- Maintenir la transparence totale avec l'utilisateur
- Valider toutes les transactions avant envoi
- Implémenter des fallbacks en cas d'échec d'optimisation
```

---

## 🔧 Mémoires Techniques Spécialisées

### Mémoire 4 : Configuration Solana et RPC

```markdown
**Titre** : Configuration Blockchain Solana
**Type** : Mémoire Infrastructure
**Contexte** : Gestion des connexions RPC et interactions blockchain

**Contenu** :
Configuration RPC robuste avec fallback :
- Endpoint principal : Helius RPC avec clé API
- Fallbacks : Ankr, QuickNode, RPC public Solana
- Timeout : 30 secondes maximum par requête
- Retry : 3 tentatives avec backoff exponentiel
- Health check : Monitoring continu des endpoints

**Gestion des Transactions** :
- Simulation obligatoire avant envoi
- Validation des montants et adresses
- Gestion des timeouts (120 secondes max)
- Retry intelligent en cas d'échec
- Logging détaillé pour debugging

**Variables d'Environnement Critiques** :
- NEXT_PUBLIC_RPC_ENDPOINTS : Liste des endpoints RPC
- HELIUS_API_KEY : Clé API Helius pour RPC premium
- NEXT_PUBLIC_SOLANA_NETWORK : mainnet-beta obligatoire
- NEXT_PUBLIC_FEE_RECOVERY_WALLET : Wallet de récupération

**Sécurité** :
- Validation stricte de toutes les adresses
- Vérification des montants avant transaction
- Protection contre les attaques de replay
- Chiffrement des données sensibles
```

### Mémoire 5 : Patterns de Gestion d'Erreurs

```markdown
**Titre** : Stratégies de Gestion d'Erreurs
**Type** : Mémoire Technique
**Contexte** : Approche unifiée pour la gestion des erreurs

**Contenu** :
Hiérarchie des erreurs implémentée :
- BaseError : Classe de base avec contexte
- NetworkError : Erreurs de connectivité
- BlockchainError : Erreurs blockchain spécifiques
- ValidationError : Erreurs de validation des données
- OptimizationError : Erreurs d'optimisation

**Stratégies de Retry** :
- Erreurs réseau : 3 tentatives avec backoff
- Erreurs RPC : Fallback automatique vers autre endpoint
- Erreurs de transaction : Retry avec fees ajustés
- Erreurs d'optimisation : Fallback vers mode standard

**Messages Utilisateur** :
- Erreurs techniques → Messages utilisateur-friendly
- Contexte approprié sans détails techniques
- Actions suggérées pour résoudre le problème
- Logging détaillé côté développeur

**Error Boundaries** :
- Composant principal avec Error Boundary
- Fallback UI pour les erreurs critiques
- Reporting automatique vers Sentry
- Récupération gracieuse quand possible
```

### Mémoire 6 : Standards de Qualité Code

```markdown
**Titre** : Standards de Développement Jupiter Swap
**Type** : Mémoire Qualité
**Contexte** : Conventions et bonnes pratiques du projet

**Contenu** :
**TypeScript** :
- Mode strict activé obligatoirement
- Types explicites pour toutes les fonctions publiques
- Interfaces pour tous les objets métier
- Éviter 'any', utiliser 'unknown' si nécessaire
- Typage des props React avec interfaces

**Architecture des Composants** :
- Composants fonctionnels avec hooks
- forwardRef pour tous les composants UI
- Props typées avec interfaces
- Séparation logique/présentation
- Réutilisabilité maximale

**Services et Logique Métier** :
- Classes avec méthodes statiques
- Interfaces pour tous les services
- Gestion d'erreurs systématique
- Cache intelligent avec TTL
- Logging structuré

**Performance** :
- React.memo pour composants coûteux
- useMemo/useCallback pour optimisations
- Code splitting par route
- Lazy loading des composants lourds
- Optimisation des bundles

**Tests** :
- Coverage minimum 80%
- Tests unitaires pour tous les services
- Tests d'intégration pour workflows
- Mocking des dépendances externes
- Tests de performance pour opérations critiques
```

---

## 🎨 Mémoires UI/UX et Design

### Mémoire 7 : Charte Graphique et Design System

```markdown
**Titre** : Design System Jupiter Swap
**Type** : Mémoire Design
**Contexte** : Charte graphique DeAura.io + Solana

**Contenu** :
**Palette de Couleurs** :
- Vert DeAura (#4ade80) : Couleur principale d'accent
- Violet Solana (#9945ff) : Éléments blockchain
- Cyan DeAura (#22d3ee) : Accents secondaires
- Fonds sombres (#0a0f14, #1a202c) : Identité DeAura
- Dégradés harmonieux combinant les deux identités

**Typographie** :
- Font principale : Inter (identique DeAura.io)
- Hiérarchie claire : H1 (2.5rem), H2 (2rem), H3 (1.5rem)
- Corps de texte : 1rem avec line-height 1.6
- Code : JetBrains Mono pour les adresses et montants

**Composants UI** :
- Boutons avec variants (primary, secondary, ghost)
- Cards avec effets glow verts caractéristiques
- Inputs avec validation visuelle
- Animations fluides (200ms transitions)
- États hover sophistiqués

**Responsive Design** :
- Mobile-first approach
- Breakpoints : sm (640px), md (768px), lg (1024px), xl (1280px)
- Navigation adaptative sur mobile
- Touch-friendly sur tablettes

**Accessibilité** :
- Contraste WCAG AA minimum
- Support navigation clavier
- ARIA labels appropriés
- Focus visible sur tous les éléments interactifs
```

### Mémoire 8 : Patterns d'Interface Trading

```markdown
**Titre** : Patterns UX pour Interface de Trading
**Type** : Mémoire UX
**Contexte** : Expérience utilisateur optimisée pour le trading DeFi

**Contenu** :
**Interface de Swap** :
- Layout en deux colonnes (input/output)
- Bouton de swap central avec animation
- Affichage temps réel des quotes
- Métriques d'optimisation visibles
- Slippage et fees transparents

**Feedback Utilisateur** :
- Loading states pour toutes les opérations
- Progress indicators pour transactions
- Notifications toast pour succès/erreurs
- Confirmations avant actions critiques
- Historique des transactions accessible

**Optimisations Visuelles** :
- Highlight des économies réalisées
- Comparaison avant/après optimisation
- Métriques de performance en temps réel
- Graphiques de tendance des prix
- Indicateurs de santé du réseau

**États d'Erreur** :
- Messages d'erreur contextuels
- Actions de récupération suggérées
- Retry automatique avec feedback
- Fallback gracieux en cas de problème
- Support et aide facilement accessibles

**Mobile Experience** :
- Interface adaptée aux écrans tactiles
- Gestures intuitifs pour navigation
- Optimisation pour connexions lentes
- Offline mode pour consultation
- PWA avec installation possible
```

---

## 🔍 Mémoires de Debugging et Maintenance

### Mémoire 9 : Stratégies de Debugging

```markdown
**Titre** : Méthodologie de Debugging Jupiter Swap
**Type** : Mémoire Debug
**Contexte** : Approche systématique pour identifier et résoudre les problèmes

**Contenu** :
**Analyse des Logs** :
- Console navigateur : Erreurs JavaScript/TypeScript
- Network tab : Échecs d'API et timeouts
- Terminal dev : Erreurs de build et warnings
- Sentry : Erreurs production avec contexte
- RPC logs : Problèmes blockchain spécifiques

**Outils de Debug** :
- React DevTools pour composants
- Redux DevTools pour état global
- Network inspector pour APIs
- Performance profiler pour optimisations
- Lighthouse pour métriques web

**Problèmes Fréquents** :
- RPC timeout → Vérifier endpoints et fallbacks
- Transaction failed → Analyser fees et slippage
- Wallet connection → Vérifier permissions et réseau
- Quote errors → Valider tokens et montants
- UI freeze → Identifier re-renders excessifs

**Méthodologie** :
1. Reproduire le problème de manière consistante
2. Isoler la cause racine avec logs
3. Identifier l'impact et la criticité
4. Implémenter la correction minimale
5. Tester la correction et les régressions
6. Documenter la solution pour référence future

**Monitoring Proactif** :
- Alertes automatiques pour erreurs critiques
- Métriques de performance en temps réel
- Health checks des services externes
- Monitoring des taux de succès des transactions
```

### Mémoire 10 : Procédures de Maintenance

```markdown
**Titre** : Maintenance et Évolution Jupiter Swap
**Type** : Mémoire Maintenance
**Contexte** : Procédures pour maintenir et faire évoluer l'application

**Contenu** :
**Maintenance Préventive** :
- Mise à jour des dépendances (mensuelle)
- Audit de sécurité (npm audit + Snyk)
- Nettoyage du cache et optimisation
- Backup des configurations critiques
- Test des endpoints RPC et APIs

**Monitoring Continu** :
- Métriques de performance (Core Web Vitals)
- Taux d'erreur et disponibilité
- Volume de trading et économies générées
- Satisfaction utilisateur et feedback
- Évolution des coûts d'infrastructure

**Évolutions Planifiées** :
- Nouveaux tokens supportés
- Optimisations d'algorithmes
- Améliorations d'interface
- Intégrations d'APIs supplémentaires
- Fonctionnalités avancées de trading

**Procédures d'Urgence** :
- Plan de rollback en cas de problème critique
- Communication utilisateurs en cas d'incident
- Escalade vers les équipes techniques
- Activation des modes de maintenance
- Coordination avec les partenaires (Jupiter, RPC providers)

**Documentation** :
- Changelog détaillé des modifications
- Guide de troubleshooting mis à jour
- Documentation API pour intégrations
- Runbooks pour les opérations courantes
- Formation des équipes de support
```

---

## 📊 Utilisation des Mémoires dans Cascade

### Activation Automatique

Les mémoires sont automatiquement activées par Cascade quand :
- Le contexte correspond au domaine de la mémoire
- Des mots-clés spécifiques sont détectés
- Le type de problème correspond à une mémoire existante

### Création de Nouvelles Mémoires

```
# Demander à Cascade de créer une mémoire
"Cascade, crée une mémoire de cette solution d'optimisation pour les futures références"

# Mémoire automatique lors de résolution de problème
Cascade détecte automatiquement les solutions importantes et propose de les mémoriser
```

### Consultation des Mémoires

```
# Lister les mémoires disponibles
"Cascade, quelles mémoires as-tu sur l'architecture Jupiter Swap ?"

# Utiliser une mémoire spécifique
"Cascade, utilise la mémoire sur les patterns d'erreurs pour résoudre ce problème"
```

---

## 🎯 Mémoires de Validation et Qualité

### Mémoire 11 : Checklist de Production

```markdown
**Titre** : Critères de Validation Production
**Type** : Mémoire Qualité
**Contexte** : Standards à respecter avant mise en production

**Contenu** :
**Critères Techniques** :
✅ Lint : 0 erreur ESLint/Prettier
✅ Build : Compilation réussie sans warnings
✅ Tests : Coverage > 80%, tous les tests passent
✅ TypeScript : 0 erreur de typage
✅ Performance : Lighthouse score > 90
✅ Sécurité : npm audit clean, pas de secrets exposés
✅ Bundle : Taille < 500KB, code splitting optimal

**Critères Fonctionnels** :
✅ Connexion wallet : Tous les wallets supportés
✅ Affichage soldes : SOL et USDC en temps réel
✅ Swap bidirectionnel : SOL→USDC et USDC→SOL
✅ Optimisations : Slippage et fees optimisés
✅ Récupération : Économies transférées correctement
✅ Interface : Responsive et accessible
✅ Erreurs : Gestion robuste et messages clairs

**Critères de Production** :
✅ Variables d'environnement : Toutes configurées
✅ Monitoring : Sentry et analytics actifs
✅ Documentation : README et guides à jour
✅ Déploiement : Process validé et testé
✅ Rollback : Procédure de retour en arrière prête
✅ Support : Équipe formée et procédures définies
```

Ces mémoires constituent la base de connaissances de Windsurf pour le projet Jupiter Swap, garantissant une approche cohérente et professionnelle dans toutes les interventions.

