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