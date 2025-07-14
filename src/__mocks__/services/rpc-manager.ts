/**
 * Mock du service RPC Manager
 * 
 * Ce fichier contient un mock complet du service RPC Manager pour les tests unitaires
 */

// Pas besoin d'importer Connection car nous créons notre propre mock

// Mock des endpoints RPC
export const mockEndpoints = [
  {
    url: 'https://mainnet.helius-rpc.com/?api-key=d94d81dd-f2a1-40f7-920d-0dfaf3aaf032',
    name: 'Helius Primary',
    weight: 3,
    isActive: true,
    metrics: {
      successRate: 0.99,
      responseTime: 120,
      lastUsed: Date.now(),
      errorCount: 0,
      successCount: 100,
      totalRequests: 100,
    }
  },
  {
    url: 'https://solana-mainnet.g.alchemy.com/v2/UvOk23LRlqGz1m58VCEd3PJ2ZOX2h9KM',
    name: 'Solana Public',
    weight: 1,
    isActive: true,
    metrics: {
      successRate: 0.95,
      responseTime: 200,
      lastUsed: Date.now() - 60000,
      errorCount: 5,
      successCount: 95,
      totalRequests: 100,
    }
  },
  {
    url: 'https://eclipse.helius-rpc.com/',
    name: 'Helius Eclipse',
    weight: 2,
    isActive: true,
    metrics: {
      successRate: 0.97,
      responseTime: 150,
      lastUsed: Date.now() - 30000,
      errorCount: 3,
      successCount: 97,
      totalRequests: 100,
    }
  }
];

// Mock de la classe Connection
class MockConnection {
  getBalance = jest.fn().mockResolvedValue(1000000000);
  getTokenAccountBalance = jest.fn().mockResolvedValue({ value: { amount: '1000000', decimals: 6, uiAmount: 1 } });
  getLatestBlockhash = jest.fn().mockResolvedValue({ blockhash: 'test-blockhash', lastValidBlockHeight: 100 });
  getVersion = jest.fn().mockResolvedValue({ 'solana-core': '1.10.0' });
  getSlot = jest.fn().mockResolvedValue(100);
  getMinimumBalanceForRentExemption = jest.fn().mockResolvedValue(2039280);
  getPrioritizationFees = jest.fn().mockResolvedValue([{ prioritizationFee: 10000, slot: 100 }]);
  simulateTransaction = jest.fn().mockResolvedValue({ value: { err: null } });
  sendTransaction = jest.fn().mockResolvedValue('test-signature');
  confirmTransaction = jest.fn().mockResolvedValue({ value: { err: null } });
  getSignatureStatus = jest.fn().mockResolvedValue({ value: { confirmationStatus: 'confirmed' } });
}

// Instance de la connexion mock
export const mockConnection = new MockConnection();

// Mock de la classe RpcManager
class MockRpcManager {
  endpoints = mockEndpoints;
  activeEndpoint = mockEndpoints[0];
  connection = mockConnection;
  
  initialize = jest.fn().mockResolvedValue(true);
  executeWithFallback = jest.fn().mockImplementation((operation) => operation(mockConnection));
  getPrimaryConnection = jest.fn().mockReturnValue(mockConnection);
  getAllConnections = jest.fn().mockReturnValue([mockConnection, mockConnection, mockConnection]);
  selectBestEndpoint = jest.fn().mockReturnValue(mockEndpoints[0]);
  updateEndpointMetrics = jest.fn();
  handleEndpointError = jest.fn();
  resetEndpointErrorCount = jest.fn();
  checkEndpointHealth = jest.fn().mockResolvedValue(true);
  monitorEndpointHealth = jest.fn();
  getHealthMetrics = jest.fn().mockReturnValue(mockEndpoints.map(e => ({
    name: e.name,
    url: e.url,
    isHealthy: true,
    responseTime: e.metrics.responseTime,
    successRate: e.metrics.successRate,
    lastChecked: Date.now()
  })));
  forceHealthCheck = jest.fn().mockResolvedValue(true);
  destroy = jest.fn();
  getEndpointStatus = jest.fn().mockReturnValue({
    healthy: 3,
    degraded: 0,
    down: 0,
    total: 3,
    bestEndpoint: mockEndpoints[0]!.name,
  });
}

// Instance du RPC Manager mock
export const mockRpcManager = new MockRpcManager();

// Fonction pour récupérer l'instance du RPC Manager
export function getRpcManager() {
  return mockRpcManager;
}

export default mockRpcManager;
