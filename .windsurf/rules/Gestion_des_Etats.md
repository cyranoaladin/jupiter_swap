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