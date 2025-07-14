# Analyse Documentation Windsurf Cascade

## Vue d'ensemble
- Windsurf Cascade : Collaboration avancée humain-IA
- Ouverture : `Cmd/Ctrl+L` ou icône Cascade
- Modes : Write (modifications code) et Chat (questions/conseils)
- Jusqu'à 20 appels d'outils par prompt

## Fonctionnalités Clés

### Tool Calling
- Search, Analyze, Web Search, MCP, Terminal
- Détection automatique des packages et outils
- Installation automatique des dépendances
- Bouton "continue" pour reprendre les trajectoires

### Gestion des Erreurs
- Intégration linter automatique (activée par défaut)
- Auto-fix des erreurs de lint (peut être gratuit)
- "Send to Cascade" depuis le panel Problems
- "Explain and Fix" pour les erreurs sélectionnées

### Contrôle de Version
- Revert vers étapes précédentes
- Revert depuis table des matières
- Attention : reverts irréversibles

### Configuration
- `.codeiumignore` pour ignorer des fichiers
- Awareness temps réel des actions utilisateur
- Sons de notification configurables
- Cascades simultanées possibles

## Points Importants pour le Workflow
1. Auto-fix linter intégré
2. Gestion automatique des dépendances
3. Awareness temps réel
4. Système de revert pour sécurité
5. Support MCP pour extensions



## Memories & Rules

### Memories
- Système de partage et persistance du contexte entre conversations
- Génération automatique par Cascade (contexte utile détecté)
- Création manuelle : "create a memory of..."
- Associées au workspace (pas de partage entre workspaces)
- Ne consomment PAS de crédits

### Rules
- Définies manuellement par l'utilisateur
- Niveaux : global (`global_rules.md`) et workspace (`.windsurf/rules`)
- Limite : 12000 caractères par fichier
- Templates disponibles : https://windsurf.com/editor/directory

### Modes d'Activation des Rules
1. **Manual** : Activation via @mention
2. **Always On** : Toujours appliquées
3. **Model Decision** : Décision basée sur description naturelle
4. **Glob** : Pattern de fichiers (*.js, src/**/*.ts)

### Bonnes Pratiques Rules
- Simples, concises, spécifiques
- Éviter les règles génériques
- Format : bullet points, listes numérotées, markdown
- Utiliser des balises XML pour grouper
- Exemple :
```markdown
<coding_guidelines>
- Programming language: TypeScript
- Use early returns
- Always add documentation
</coding_guidelines>
```

### Accès
- Icône "Customizations" dans Cascade (slider menu)
- "Windsurf - Settings" (coin bas-droite)


## Model Context Protocol (MCP)

### Définition
- Protocole permettant aux LLMs d'accéder à des outils et services personnalisés
- Client MCP (Cascade) fait des requêtes aux serveurs MCP
- Intégration native dans Windsurf

### Configuration
- **Plugin Store** : Icône "Plugins" dans Cascade ou Windsurf Settings > Cascade > Plugins
- **Configuration manuelle** : `~/.codeium/windsurf/mcp_config.json`
- **Limite** : 100 outils maximum accessibles simultanément

### Types de Transport
1. **stdio** : Processus local
2. **/sse** : Server-Sent Events (URL endpoint)

### Exemple Configuration stdio (GitHub)
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<TOKEN>"
      }
    }
  }
}
```

### Exemple Configuration SSE
```json
{
  "mcpServers": {
    "figma": {
      "serverUrl": "<your-server-url>/sse"
    }
  }
}
```

### Fonctionnalités Supportées
- ✅ Tools (outils)
- ✅ Resources (ressources)
- ❌ Prompts (non supporté)

### Gestion d'Équipe
- Admins peuvent activer/désactiver MCP
- Whitelist de serveurs approuvés
- Configuration centralisée possible

### Points Importants
- Enterprise : activation manuelle requise
- Plugins officiels : checkmark bleu
- Bouton refresh après ajout
- Gestion des outils par plugin

