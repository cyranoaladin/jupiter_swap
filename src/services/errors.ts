/**
 * Système d'erreurs simplifié pour Jupiter Swap DApp
 * 
 * @author Manus AI
 * @version 1.0.0
 */

export class BaseAppError extends Error {
  public readonly type: string;
  public readonly code: string;
  public readonly timestamp: number;

  constructor(type: string, code: string, message: string) {
    super(message);
    this.name = 'BaseAppError';
    this.type = type;
    this.code = code;
    this.timestamp = Date.now();
  }
}

export class NetworkError extends BaseAppError {
  constructor(message: string) {
    super('network', 'NETWORK_ERROR', message);
    this.name = 'NetworkError';
  }
}

export class RpcError extends BaseAppError {
  public readonly endpoint: string;

  constructor(endpoint: string, message: string) {
    super('network', 'RPC_ERROR', message);
    this.name = 'RpcError';
    this.endpoint = endpoint;
  }
}

export class RateLimitError extends BaseAppError {
  constructor(message: string) {
    super('api', 'RATE_LIMIT', message);
    this.name = 'RateLimitError';
  }
}

export class ServerError extends BaseAppError {
  public readonly statusCode: number;
  public readonly url: string;

  constructor(statusCode: number, url: string, message: string) {
    super('api', 'SERVER_ERROR', message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
    this.url = url;
  }
}

export class ApiTimeoutError extends BaseAppError {
  public readonly timeout: number;
  public readonly url: string;

  constructor(url: string, timeout: number) {
    super('api', 'API_TIMEOUT', `Timeout après ${timeout}ms`);
    this.name = 'ApiTimeoutError';
    this.url = url;
    this.timeout = timeout;
  }
}

export class WalletNotConnectedError extends BaseAppError {
  constructor() {
    super('wallet', 'WALLET_NOT_CONNECTED', 'Wallet non connecté');
    this.name = 'WalletNotConnectedError';
  }
}

export class InsufficientBalanceError extends BaseAppError {
  constructor(required: string, available: string, token: string) {
    super('wallet', 'INSUFFICIENT_BALANCE', `Solde insuffisant: ${available} ${token} disponible, ${required} ${token} requis`);
    this.name = 'InsufficientBalanceError';
  }
}

export class TransactionError extends BaseAppError {
  public readonly signature?: string | undefined;

  constructor(message: string, signature?: string) {
    super('transaction', 'TRANSACTION_FAILED', message);
    this.name = 'TransactionError';
    this.signature = signature;
  }
}

export class TransactionTimeoutError extends BaseAppError {
  public readonly signature: string;

  constructor(signature: string) {
    super('transaction', 'TRANSACTION_TIMEOUT', 'Délai de transaction dépassé');
    this.name = 'TransactionTimeoutError';
    this.signature = signature;
  }
}

export class QuoteError extends BaseAppError {
  constructor(_inputMint: string, _outputMint: string, _amount: string, message: string) {
    super('api', 'QUOTE_FAILED', message);
    this.name = 'QuoteError';
  }
}

export class NoRouteFoundError extends BaseAppError {
  constructor(_inputMint: string, _outputMint: string) {
    super('api', 'NO_ROUTE_FOUND', 'Aucune route trouvée');
    this.name = 'NoRouteFoundError';
  }
}

export function logError(error: unknown, context?: Record<string, any>): void {
  console.error('🚨 Erreur:', error, context);
}

export class RetryHandler {
  static async withRetry<T>(
    fn: () => Promise<T>,
    config: { maxAttempts: number } = { maxAttempts: 3 }
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt === config.maxAttempts) {
          throw lastError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    throw lastError!;
  }
}

export function normalizeError(error: unknown): BaseAppError {
  if (error instanceof BaseAppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new BaseAppError('unknown', 'UNKNOWN_ERROR', error.message);
  }
  
  return new BaseAppError('unknown', 'UNKNOWN_ERROR', String(error));
} 