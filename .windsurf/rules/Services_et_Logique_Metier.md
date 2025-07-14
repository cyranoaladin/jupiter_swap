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