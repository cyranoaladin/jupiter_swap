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