/**
 * Mock du service Jupiter
 * 
 * Ce fichier contient un mock complet du service Jupiter pour les tests unitaires
 */

export const mockGetTokens = jest.fn().mockResolvedValue({
  data: {
    SOL: {
      address: 'So11111111111111111111111111111111111111112',
      chainId: 101,
      decimals: 9,
      name: 'Wrapped SOL',
      symbol: 'SOL',
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      tags: ['wrapped-solana', 'wormhole'],
    },
    USDC: {
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      chainId: 101,
      decimals: 6,
      name: 'USD Coin',
      symbol: 'USDC',
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
      tags: ['stablecoin'],
    },
  }
});

export const mockGetQuote = jest.fn().mockResolvedValue({
  data: {
    inputMint: 'So11111111111111111111111111111111111111112',
    outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    inAmount: 1000000000,
    outAmount: 10000000,
    otherAmountThreshold: 9950000,
    swapMode: 'ExactIn',
    slippageBps: 50,
    platformFee: null,
    priceImpactPct: 0.1,
    routePlan: [
      {
        swapInfo: {
          ammKey: 'test-amm-key',
          label: 'Jupiter',
          inputMint: 'So11111111111111111111111111111111111111112',
          outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          inAmount: 1000000000,
          outAmount: 10000000,
          feeAmount: 10000,
          feeMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        },
        percent: 100,
      },
    ],
    contextSlot: 123456789,
    timeTaken: 0.12,
  }
});

export const mockGetSwapTransaction = jest.fn().mockResolvedValue({
  data: {
    swapTransaction: 'base64-encoded-transaction',
    lastValidBlockHeight: 123456789,
    prioritizationFee: 10000,
  }
});

export const mockGetMarketDepth = jest.fn().mockResolvedValue({
  data: {
    bids: [
      { price: 10.05, size: 100 },
      { price: 10.00, size: 200 },
      { price: 9.95, size: 300 },
    ],
    asks: [
      { price: 10.10, size: 150 },
      { price: 10.15, size: 250 },
      { price: 10.20, size: 350 },
    ],
    marketAddress: 'test-market-address',
    slot: 123456789,
  }
});

export const mockGetPriceHistory = jest.fn().mockResolvedValue({
  data: {
    prices: [
      { time: Date.now() - 3600000, price: 9.90 },
      { time: Date.now() - 2400000, price: 9.95 },
      { time: Date.now() - 1200000, price: 10.00 },
      { time: Date.now(), price: 10.05 },
    ],
    marketAddress: 'test-market-address',
  }
});

export const mockJupiterService = {
  getTokens: mockGetTokens,
  getQuote: mockGetQuote,
  getSwapTransaction: mockGetSwapTransaction,
  getMarketDepth: mockGetMarketDepth,
  getPriceHistory: mockGetPriceHistory,
  analyzeMarketConditions: jest.fn().mockResolvedValue({
    volatility: 'LOW',
    liquidity: 'HIGH',
    spread: 0.5,
    recommendation: 'NORMAL',
  }),
  retryWithExponentialBackoff: jest.fn().mockImplementation((fn) => fn()),
};

export default mockJupiterService;
