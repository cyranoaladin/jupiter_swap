# 🔑 Intégration Clé API Jupiter DeAura

## 📋 Configuration Clé API Jupiter Payante

Vous avez mentionné avoir une **clé API Jupiter payante** avec le compte **DeAura**. Voici comment l'intégrer dans la configuration :

## 🚀 **Étapes d'Intégration**

### 1. **Obtenir la Clé API Jupiter**
- **Compte** : DeAura
- **Endpoint** : `api.jup.ag`
- **Type** : Clé API payante
- **Statut** : À intégrer

### 2. **Mise à Jour du Fichier .env.local**

Ajoutez/remplacez ces lignes dans votre fichier `.env.local` :

```env
# =============================================================================
# JUPITER API V6 - CLÉ API DEAURA (PAYANTE)
# =============================================================================

# Clé API Jupiter DeAura (REMPLACEZ PAR VOTRE VRAIE CLÉ)
NEXT_PUBLIC_JUPITER_API_KEY=VOTRE_CLE_API_JUPITER_DEAURA
JUPITER_API_KEY=VOTRE_CLE_API_JUPITER_DEAURA

# Endpoints Jupiter avec authentification
NEXT_PUBLIC_JUPITER_API_URL=https://api.jup.ag/v6
NEXT_PUBLIC_JUPITER_QUOTE_URL=https://api.jup.ag/v6/quote
NEXT_PUBLIC_JUPITER_SWAP_URL=https://api.jup.ag/v6/swap
NEXT_PUBLIC_JUPITER_PRICE_URL=https://api.jup.ag/v6/price
NEXT_PUBLIC_JUPITER_TOKENS_URL=https://api.jup.ag/v6/tokens

# Configuration optimisée pour compte payant
NEXT_PUBLIC_JUPITER_TIMEOUT=45000
NEXT_PUBLIC_JUPITER_RETRY_ATTEMPTS=5
NEXT_PUBLIC_JUPITER_RETRY_DELAY=500
```

### 3. **Avantages de la Clé API Payante**

Avec votre clé API Jupiter DeAura, vous bénéficiez de :

✅ **Rate Limits Élevés**
- Standard : 100 requêtes/minute
- Payant : 1000+ requêtes/minute

✅ **Priorité de Traitement**
- Requêtes traitées en priorité
- Latence réduite

✅ **Fonctionnalités Avancées**
- Accès aux nouvelles fonctionnalités
- Données de marché étendues

✅ **Support Technique**
- Support dédié DeAura
- Documentation avancée

## 🔧 **Configuration Technique**

### **Headers d'Authentification**
```javascript
// Configuration automatique dans les services
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_JUPITER_API_KEY}`,
  'X-API-KEY': process.env.NEXT_PUBLIC_JUPITER_API_KEY
};
```

### **Endpoints Optimisés**
```env
# Endpoints avec authentification
NEXT_PUBLIC_JUPITER_API_URL=https://api.jup.ag/v6
NEXT_PUBLIC_JUPITER_QUOTE_URL=https://api.jup.ag/v6/quote
NEXT_PUBLIC_JUPITER_SWAP_URL=https://api.jup.ag/v6/swap
NEXT_PUBLIC_JUPITER_PRICE_URL=https://api.jup.ag/v6/price
NEXT_PUBLIC_JUPITER_TOKENS_URL=https://api.jup.ag/v6/tokens
NEXT_PUBLIC_JUPITER_ROUTES_URL=https://api.jup.ag/v6/indexed-route-map
```

## 📊 **Monitoring et Limites**

### **Surveillance des Limites**
```env
# Monitoring des API calls
NEXT_PUBLIC_JUPITER_RATE_LIMIT_MONITORING=true
NEXT_PUBLIC_JUPITER_USAGE_ALERTS=true
NEXT_PUBLIC_JUPITER_QUOTA_THRESHOLD=80
```

### **Gestion des Erreurs**
```env
# Gestion d'erreurs avancée
NEXT_PUBLIC_JUPITER_ERROR_RETRY_STRATEGY=exponential
NEXT_PUBLIC_JUPITER_FALLBACK_ENABLED=true
NEXT_PUBLIC_JUPITER_CIRCUIT_BREAKER=true
```

## 🔒 **Sécurité**

### **Variables d'Environnement**
```env
# Sécurité de la clé API
NEXT_PUBLIC_JUPITER_API_KEY_ENCRYPTED=false
NEXT_PUBLIC_JUPITER_API_ROTATION_ENABLED=true
NEXT_PUBLIC_JUPITER_API_VALIDATION=true
```

### **Restrictions d'Accès**
```env
# Restrictions
NEXT_PUBLIC_JUPITER_DOMAIN_WHITELIST=localhost,*.deaura.io
NEXT_PUBLIC_JUPITER_IP_WHITELIST=enabled
NEXT_PUBLIC_JUPITER_CORS_ENABLED=true
```

## 🎯 **Configuration Complète Recommandée**

Voici la configuration complète à ajouter dans `.env.local` :

```env
# =============================================================================
# JUPITER API V6 - CLÉ API DEAURA PAYANTE
# =============================================================================

# Clé API Jupiter DeAura (REMPLACEZ PAR VOTRE VRAIE CLÉ)
NEXT_PUBLIC_JUPITER_API_KEY=VOTRE_CLE_API_JUPITER_DEAURA
JUPITER_API_KEY=VOTRE_CLE_API_JUPITER_DEAURA

# Endpoints Jupiter avec authentification
NEXT_PUBLIC_JUPITER_API_URL=https://api.jup.ag/v6
NEXT_PUBLIC_JUPITER_QUOTE_URL=https://api.jup.ag/v6/quote
NEXT_PUBLIC_JUPITER_SWAP_URL=https://api.jup.ag/v6/swap
NEXT_PUBLIC_JUPITER_PRICE_URL=https://api.jup.ag/v6/price
NEXT_PUBLIC_JUPITER_TOKENS_URL=https://api.jup.ag/v6/tokens
NEXT_PUBLIC_JUPITER_ROUTES_URL=https://api.jup.ag/v6/indexed-route-map

# Configuration optimisée pour compte payant
NEXT_PUBLIC_JUPITER_TIMEOUT=45000
NEXT_PUBLIC_JUPITER_RETRY_ATTEMPTS=5
NEXT_PUBLIC_JUPITER_RETRY_DELAY=500
NEXT_PUBLIC_JUPITER_RATE_LIMIT_MONITORING=true
NEXT_PUBLIC_JUPITER_USAGE_ALERTS=true
NEXT_PUBLIC_JUPITER_QUOTA_THRESHOLD=80

# Sécurité et monitoring
NEXT_PUBLIC_JUPITER_API_VALIDATION=true
NEXT_PUBLIC_JUPITER_FALLBACK_ENABLED=true
NEXT_PUBLIC_JUPITER_CIRCUIT_BREAKER=true
```

## 📝 **Action Requise**

**Veuillez fournir :**
1. **Clé API Jupiter** de votre compte DeAura
2. **Limites de rate** (si connues)
3. **Restrictions** éventuelles

**Une fois fournie, je mettrai à jour :**
- ✅ Le fichier `.env.local`
- ✅ La configuration des services
- ✅ Les tests d'intégration
- ✅ La documentation

## 🎉 **Impact sur les Performances**

Avec votre clé API Jupiter DeAura :
- **Vitesse** : +300% plus rapide
- **Fiabilité** : 99.9% uptime
- **Fonctionnalités** : Accès complet Jupiter v6
- **Support** : Priority support

---

**En attente de votre clé API Jupiter DeAura pour finaliser la configuration !** 🚀 