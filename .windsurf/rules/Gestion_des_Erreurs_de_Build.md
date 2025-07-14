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