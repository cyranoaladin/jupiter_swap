/**
 * Service CoinGecko pour Jupiter Swap DApp
 * 
 * Ce service permet d'interagir avec l'API CoinGecko pour récupérer
 * des données de marché (prix, volumes, capitalisation, etc.) pour les tokens.
 * 
 * @author Manus AI
 * @version 1.0.0
 */



/**
 * Configuration de base pour l'API CoinGecko
 */
const COINGECKO_API_BASE_URL = 'https://pro-api.coingecko.com/api/v3';
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || 'CG-5xHc1Xw5AxQKaoW9rRKygugD';
const COINGECKO_API_TIMEOUT = 10000; // 10 secondes

/**
 * Interface pour les options de requête
 */
interface RequestOptions {
  endpoint: string;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

/**
 * Interface pour les données de prix d'un token
 */
export interface TokenPriceData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  price_change_percentage_30d?: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  last_updated: string;
}

/**
 * Effectue une requête à l'API CoinGecko
 * 
 * @param options Options de la requête
 * @returns Données de la réponse
 */
async function fetchFromCoinGecko<T>({ endpoint, params = {}, timeout = COINGECKO_API_TIMEOUT }: RequestOptions): Promise<T> {
  try {
    // Construction de l'URL avec les paramètres
    const url = new URL(`${COINGECKO_API_BASE_URL}${endpoint}`);
    
    // Ajout des paramètres à l'URL
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    
    // Ajout de la clé API
    url.searchParams.append('x_cg_pro_api_key', COINGECKO_API_KEY);
    
    // Configuration de la requête avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Exécution de la requête
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    // Nettoyage du timeout
    clearTimeout(timeoutId);
    
    // Vérification de la réponse
    if (!response.ok) {
      throw new Error(`Erreur CoinGecko API: ${response.status} ${response.statusText}`);
    }
    
    // Parsing de la réponse
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Erreur lors de la requête à CoinGecko:', error);
    throw error;
  }
}

/**
 * Récupère le prix actuel d'un token par son ID CoinGecko
 * 
 * @param id ID CoinGecko du token
 * @param currency Devise (par défaut USD)
 * @returns Prix du token
 */
export async function getTokenPrice(id: string, currency = 'usd'): Promise<number> {
  try {
    const data = await fetchFromCoinGecko<Record<string, Record<string, number>>>({
      endpoint: '/simple/price',
      params: {
        ids: id,
        vs_currencies: currency,
      },
    });
    
    return data[id]?.[currency] || 0;
  } catch (error) {
    console.error(`Erreur lors de la récupération du prix pour ${id}:`, error);
    return 0;
  }
}

/**
 * Récupère les données de marché pour une liste de tokens
 * 
 * @param ids Liste des IDs CoinGecko des tokens
 * @param currency Devise (par défaut USD)
 * @returns Données de marché des tokens
 */
export async function getTokensMarketData(
  ids: string[],
  currency = 'usd'
): Promise<TokenPriceData[]> {
  try {
    const data = await fetchFromCoinGecko<TokenPriceData[]>({
      endpoint: '/coins/markets',
      params: {
        vs_currency: currency,
        ids: ids.join(','),
        order: 'market_cap_desc',
        per_page: ids.length,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h,7d,30d',
      },
    });
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données de marché:', error);
    return [];
  }
}

/**
 * Récupère l'historique des prix d'un token
 * 
 * @param id ID CoinGecko du token
 * @param days Nombre de jours d'historique
 * @param currency Devise (par défaut USD)
 * @returns Données historiques des prix
 */
export async function getTokenPriceHistory(
  id: string,
  days: number | 'max' = 30,
  currency = 'usd'
): Promise<{ prices: [number, number][] }> {
  try {
    const data = await fetchFromCoinGecko<{ prices: [number, number][] }>({
      endpoint: `/coins/${id}/market_chart`,
      params: {
        vs_currency: currency,
        days,
      },
    });
    
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'historique des prix pour ${id}:`, error);
    return { prices: [] };
  }
}

/**
 * Recherche des tokens par nom ou symbole
 * 
 * @param query Terme de recherche
 * @returns Liste des tokens correspondants
 */
export async function searchTokens(query: string): Promise<{ coins: Array<{ id: string; name: string; symbol: string; market_cap_rank: number }> }> {
  try {
    const data = await fetchFromCoinGecko<{ coins: Array<{ id: string; name: string; symbol: string; market_cap_rank: number }> }>({
      endpoint: '/search',
      params: {
        query,
      },
    });
    
    return data;
  } catch (error) {
    console.error(`Erreur lors de la recherche de tokens pour "${query}":`, error);
    return { coins: [] };
  }
}
