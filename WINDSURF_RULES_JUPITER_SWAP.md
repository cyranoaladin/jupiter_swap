# 📋 Règles Windsurf Cascade - Jupiter Swap DApp

## 🎯 Configuration des Règles

Ces règles doivent être configurées dans Windsurf via :
- **Global Rules** : `global_rules.md` pour les règles générales
- **Workspace Rules** : `.windsurf/rules` pour les règles spécifiques au projet

---

## 🔧 Règles Globales (global_rules.md)

### Règle 1 : Standards de Développement
**Mode d'activation** : Always On

```markdown
<development_standards>
- Utiliser TypeScript strict avec typage complet
- Respecter les conventions ESLint et Prettier configurées
- Documenter toutes les fonctions et classes avec JSDoc
- Utiliser des noms de variables et fonctions explicites en anglais
- Implémenter une gestion d'erreurs robuste avec try-catch
- Préférer les fonctions pures et l'immutabilité
- Utiliser des imports/exports explicites et organisés
</development_standards>
```

### Règle 2 : Architecture Next.js
**Mode d'activation** : Always On

```markdown
<nextjs_architecture>
- Utiliser Next.js 13+ avec App Router exclusivement
- Placer les pages dans src/app/ avec la nouvelle structure
- Utiliser les Server Components par défaut, Client Components quand nécessaire
- Implémenter le loading.tsx et error.tsx pour chaque route
- Optimiser les images avec next/image
- Utiliser les métadonnées SEO appropriées
- Configurer correctement next.config.js pour Solana
</nextjs_architecture>
```

### Règle 3 : Gestion d'Erreurs
**Mode d'activation** : Always On

```markdown
<error_handling>
- Implémenter des Error Boundaries pour tous les composants critiques
- Utiliser des classes d'erreur typées et spécialisées
- Logger toutes les erreurs avec contexte approprié
- Afficher des messages d'erreur utilisateur-friendly
- Implémenter un système de retry intelligent
- Ne jamais exposer d'informations sensibles dans les erreurs
- Utiliser Sentry pour le monitoring des erreurs en production
</error_handling>
```

---

## 🚀 Règles Spécifiques au Projet (.windsurf/rules)

### Règle 4 : Architecture Solana/DeFi
**Mode d'activation** : Always On

```markdown
<solana_defi_architecture>
- Utiliser @solana/web3.js pour toutes les interactions blockchain
- Implémenter un système de fallback RPC robuste
- Valider toutes les adresses de wallet et montants
- Utiliser des types stricts pour les tokens et montants
- Implémenter la simulation de transaction avant envoi
- Gérer les timeouts et retry pour les opérations blockchain
- Sécuriser toutes les interactions avec les clés privées
- Utiliser Jupiter API v6 exclusivement pour les swaps
</solana_defi_architecture>
```

### Règle 5 : Services et Logique Métier
**Mode d'activation** : Glob Pattern: `src/services/**/*.ts`

```markdown
<services_business_logic>
- Séparer clairement les services par responsabilité
- Implémenter des interfaces TypeScript pour tous les services
- Utiliser des classes avec méthodes statiques pour les services
- Implémenter un cache intelligent avec TTL approprié
- Gérer les états de loading, success, error pour chaque service
- Utiliser React Query pour la gestion des données asynchrones
- Implémenter des métriques et monitoring pour chaque service
- Valider tous les inputs et outputs des services
</services_business_logic>
```

### Règle 6 : Composants UI et UX
**Mode d'activation** : Glob Pattern: `src/components/**/*.tsx`

```markdown
<ui_ux_components>
- Utiliser shadcn/ui comme base pour tous les composants
- Implémenter des variants avec class-variance-authority
- Assurer l'accessibilité (ARIA, keyboard navigation)
- Utiliser Tailwind CSS exclusivement pour le styling
- Implémenter des animations fluides avec Framer Motion
- Créer des composants réutilisables et composables
- Utiliser forwardRef pour tous les composants UI
- Implémenter des états de loading et error pour chaque composant
- Respecter la charte graphique DeAura.io et Solana
</ui_ux_components>
```

### Règle 7 : Optimisations Jupiter Swap
**Mode d'activation** : Always On

```markdown
<jupiter_optimizations>
- Implémenter le Dynamic Slippage basé sur les conditions de marché
- Calculer les Priority Fees optimaux en temps réel
- Analyser la volatilité, liquidité et spread pour les optimisations
- Récupérer transparentement les économies réalisées
- Afficher les métriques d'optimisation à l'utilisateur
- Comparer les quotes avant/après optimisation
- Implémenter un système de cache intelligent pour les quotes
- Monitorer et logger toutes les optimisations appliquées
</jupiter_optimizations>
```

### Règle 8 : Gestion des États
**Mode d'activation** : Glob Pattern: `src/store/**/*.ts`

```markdown
<state_management>
- Utiliser Zustand pour la gestion d'état global
- Séparer les stores par domaine métier (wallet, swap, settings)
- Implémenter la persistance avec localStorage quand approprié
- Utiliser des actions typées pour toutes les mutations
- Implémenter des selectors optimisés pour éviter les re-renders
- Gérer les états de synchronisation avec la blockchain
- Implémenter des middlewares pour le logging et debugging
</state_management>
```

### Règle 9 : Configuration et Environnement
**Mode d'activation** : Glob Pattern: `src/utils/config.ts`

```markdown
<configuration_environment>
- Valider toutes les variables d'environnement au démarrage
- Utiliser des types stricts pour la configuration
- Implémenter des valeurs par défaut sécurisées
- Séparer la configuration par environnement (dev, staging, prod)
- Chiffrer les variables sensibles
- Documenter toutes les variables d'environnement
- Implémenter un système de feature flags
</configuration_environment>
```

### Règle 10 : Tests et Qualité
**Mode d'activation** : Glob Pattern: `**/*.test.ts`, `**/*.spec.ts`

```markdown
<testing_quality>
- Écrire des tests unitaires pour tous les services critiques
- Implémenter des tests d'intégration pour les workflows complets
- Utiliser Jest et Testing Library pour les tests React
- Mocker toutes les dépendances externes (APIs, blockchain)
- Atteindre un coverage minimum de 80%
- Tester tous les edge cases et scénarios d'erreur
- Implémenter des tests de performance pour les opérations critiques
- Utiliser Playwright pour les tests end-to-end
</testing_quality>
```

### Règle 11 : Sécurité et Validation
**Mode d'activation** : Always On

```markdown
<security_validation>
- Valider et sanitiser tous les inputs utilisateur
- Ne jamais exposer de clés privées ou secrets
- Utiliser HTTPS exclusivement en production
- Implémenter des headers de sécurité appropriés
- Valider toutes les transactions avant envoi
- Implémenter une protection contre les attaques de replay
- Utiliser des timeouts appropriés pour éviter les blocages
- Auditer régulièrement les dépendances avec npm audit
</security_validation>
```

### Règle 12 : Performance et Optimisation
**Mode d'activation** : Always On

```markdown
<performance_optimization>
- Implémenter le code splitting et lazy loading
- Optimiser les images avec next/image et formats modernes
- Utiliser React.memo et useMemo pour éviter les re-renders
- Implémenter un cache intelligent pour les données fréquentes
- Minimiser les bundles JavaScript et CSS
- Utiliser des Web Workers pour les calculs intensifs
- Implémenter le preloading des ressources critiques
- Monitorer les Core Web Vitals en continu
</performance_optimization>
```

### Règle 13 : Documentation et Maintenance
**Mode d'activation** : Always On

```markdown
<documentation_maintenance>
- Maintenir le README.md à jour avec les dernières instructions
- Documenter toutes les APIs et interfaces avec JSDoc
- Créer des guides d'utilisation pour les fonctionnalités complexes
- Documenter les décisions d'architecture importantes
- Maintenir un changelog détaillé des modifications
- Créer des diagrammes d'architecture quand nécessaire
- Documenter les procédures de déploiement et maintenance
</documentation_maintenance>
```

---

## 🔄 Règles de Workflow et Processus

### Règle 14 : Cycle de Développement
**Mode d'activation** : Manual (via @workflow)

```markdown
<development_cycle>
- Toujours commencer par analyser le code existant
- Exécuter npm run lint et corriger toutes les erreurs
- Exécuter npm run build et résoudre tous les problèmes
- Lancer npm run dev et tester l'application complète
- Analyser les logs d'erreur et corriger les problèmes runtime
- Répéter le cycle jusqu'à obtenir 0 erreur
- Effectuer les tests de performance et sécurité
- Valider la conformité au cahier des charges
- Documenter toutes les corrections apportées
</development_cycle>
```

### Règle 15 : Gestion des Erreurs de Build
**Mode d'activation** : Manual (via @build-fix)

```markdown
<build_error_handling>
- Analyser chaque erreur TypeScript individuellement
- Corriger les erreurs d'imports/exports en priorité
- Résoudre les problèmes de types avant les problèmes logiques
- Vérifier la compatibilité des dépendances
- Valider la configuration Next.js et Tailwind
- Tester chaque correction immédiatement
- Ne jamais ignorer les warnings TypeScript
- Documenter les corrections complexes
</build_error_handling>
```

### Règle 16 : Analyse des Logs Runtime
**Mode d'activation** : Manual (via @runtime-analysis)

```markdown
<runtime_log_analysis>
- Examiner attentivement la console du navigateur (F12)
- Analyser les erreurs réseau dans l'onglet Network
- Vérifier les erreurs de chargement des ressources
- Identifier les problèmes de performance
- Analyser les erreurs d'API et de blockchain
- Tester les interactions utilisateur complètes
- Valider le comportement sur différents navigateurs
- Documenter tous les problèmes identifiés avec leur contexte
</runtime_log_analysis>
```

---

## 🎯 Règles de Validation Finale

### Règle 17 : Checklist de Production
**Mode d'activation** : Manual (via @production-check)

```markdown
<production_checklist>
- ✅ Aucune erreur de lint (npm run lint)
- ✅ Build réussi (npm run build)
- ✅ Tests passants (npm run test)
- ✅ TypeScript valide (npm run type-check)
- ✅ Application fonctionnelle (npm run dev)
- ✅ Performance optimisée (Lighthouse > 90)
- ✅ Sécurité validée (npm audit)
- ✅ Variables d'environnement configurées
- ✅ Documentation complète et à jour
- ✅ Conformité au cahier des charges validée
</production_checklist>
```

### Règle 18 : Validation Cahier des Charges
**Mode d'activation** : Manual (via @specs-validation)

```markdown
<specifications_validation>
- ✅ Interface SOL/USDC bidirectionnelle fonctionnelle
- ✅ Transactions sur Solana mainnet opérationnelles
- ✅ Jupiter API v6 intégré avec optimisations
- ✅ Affichage des soldes en temps réel
- ✅ Optimisation slippage et priority fees implémentée
- ✅ Récupération transparente des économies active
- ✅ Monitoring et analytics configurés
- ✅ Interface responsive et accessible
- ✅ Gestion d'erreurs robuste
- ✅ Architecture professionnelle respectée
</specifications_validation>
```

---

## 📝 Instructions d'Utilisation des Règles

### Configuration dans Windsurf

1. **Règles Globales** :
   - Aller dans Windsurf Settings > Cascade > Rules
   - Cliquer sur "+ Global"
   - Copier les règles 1-3 dans `global_rules.md`

2. **Règles Workspace** :
   - Dans le projet, créer `.windsurf/rules/`
   - Créer un fichier pour chaque règle (4-18)
   - Configurer le mode d'activation approprié

3. **Activation des Règles** :
   - **Always On** : Appliquées automatiquement
   - **Glob Pattern** : Appliquées aux fichiers correspondants
   - **Manual** : Activées via @mention dans Cascade

### Exemples d'Utilisation

```
# Activer le workflow complet
@workflow Commence la finalisation du projet Jupiter Swap

# Corriger les erreurs de build
@build-fix Analyse et corrige toutes les erreurs de build

# Analyser les logs runtime
@runtime-analysis Examine les logs et identifie les problèmes

# Validation finale
@production-check Vérifie que tous les critères de production sont remplis

# Validation du cahier des charges
@specs-validation Valide la conformité aux spécifications
```

Ces règles garantissent une approche méthodique et professionnelle pour finaliser le projet Jupiter Swap DApp selon les plus hauts standards de qualité.

