/**
 * Configuration de l'environnement de test Jest
 * 
 * Ce fichier configure l'environnement de test avec les extensions
 * nécessaires comme @testing-library/jest-dom
 */

import '@testing-library/jest-dom';

// Polyfills pour TextEncoder/TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// Mocks complets pour les modules Solana et Jupiter
jest.mock('@solana/web3.js', () => {
  // Création d'une classe PublicKey mockée
  class MockPublicKey {
    constructor(value) {
      this._value = value || 'default-public-key';
    }
    equals(other) {
      return other && this._value === (other._value || other.toString());
    }
    toString() {
      return this._value;
    }
    toBase58() {
      return this._value;
    }
    toBuffer() {
      return Buffer.from(this._value);
    }
    static isPublicKey(obj) {
      return obj instanceof MockPublicKey;
    }
    static default = new MockPublicKey('11111111111111111111111111111111');
  }

  // Création d'une classe Transaction mockée
  class MockTransaction {
    constructor() {
      this.signatures = [];
      this.instructions = [];
      this.recentBlockhash = 'mock-blockhash';
      this.feePayer = new MockPublicKey('mock-fee-payer');
    }
    add(...instructions) {
      this.instructions.push(...instructions);
      return this;
    }
    sign() {
      this.signatures.push('mock-signature');
      return this;
    }
    serialize() {
      return Buffer.from('mock-serialized-transaction');
    }
    static from(buffer) {
      return new MockTransaction();
    }
  }

  // Création d'une classe VersionedTransaction mockée
  class MockVersionedTransaction {
    constructor(message) {
      this.message = message || { instructions: [] };
      this.signatures = [];
    }
    sign(signers) {
      this.signatures.push('mock-signature');
      return this;
    }
    serialize() {
      return Buffer.from('mock-serialized-versioned-transaction');
    }
    static deserialize(buffer) {
      return new MockVersionedTransaction();
    }
  }

  // Création d'une classe Connection mockée
  class MockConnection {
    constructor(endpoint, commitmentOrConfig) {
      this.endpoint = endpoint;
      this.commitment = typeof commitmentOrConfig === 'string' ? commitmentOrConfig : 'confirmed';
    }
    getBalance() {
      return Promise.resolve(1000000000);
    }
    getTokenAccountBalance() {
      return Promise.resolve({ value: { amount: '1000000', decimals: 6, uiAmount: 1 } });
    }
    getLatestBlockhash() {
      return Promise.resolve({ blockhash: 'mock-blockhash', lastValidBlockHeight: 1000 });
    }
    getVersion() {
      return Promise.resolve({ 'solana-core': '1.10.0' });
    }
    getSlot() {
      return Promise.resolve(123456789);
    }
    getMinimumBalanceForRentExemption() {
      return Promise.resolve(2039280);
    }
    getPrioritizationFees() {
      return Promise.resolve([{ prioritizationFee: 10000, slot: 123456789 }]);
    }
    simulateTransaction() {
      return Promise.resolve({ value: { err: null, logs: [] } });
    }
    sendTransaction() {
      return Promise.resolve('mock-signature');
    }
    confirmTransaction() {
      return Promise.resolve({ value: { err: null } });
    }
    getSignatureStatus() {
      return Promise.resolve({ value: { confirmationStatus: 'confirmed' } });
    }
  }

  // Création d'une classe Keypair mockée
  class MockKeypair {
    constructor() {
      this.publicKey = new MockPublicKey('mock-public-key');
      this.secretKey = Buffer.from('mock-secret-key');
    }
    static generate() {
      return new MockKeypair();
    }
    static fromSecretKey(secretKey) {
      return new MockKeypair();
    }
    static fromSeed(seed) {
      return new MockKeypair();
    }
  }

  // Création d'une classe TransactionInstruction mockée
  class MockTransactionInstruction {
    constructor(params) {
      this.programId = params.programId || new MockPublicKey('mock-program-id');
      this.keys = params.keys || [];
      this.data = params.data || Buffer.from('mock-instruction-data');
    }
  }

  // Création d'une classe TransactionMessage mockée
  class MockTransactionMessage {
    constructor() {
      this.instructions = [];
      this.recentBlockhash = 'mock-blockhash';
      this.feePayer = new MockPublicKey('mock-fee-payer');
    }
    static compile(params) {
      return { 
        serialize: () => Buffer.from('mock-message'),
        staticAccountKeys: [new MockPublicKey('mock-account-key')],
        compiledInstructions: []
      };
    }
  }

  // Export du module mocké
  return {
    __esModule: true,
    PublicKey: MockPublicKey,
    Transaction: MockTransaction,
    VersionedTransaction: MockVersionedTransaction,
    TransactionMessage: MockTransactionMessage,
    TransactionInstruction: MockTransactionInstruction,
    SystemProgram: {
      transfer: jest.fn().mockReturnValue({
        programId: new MockPublicKey('11111111111111111111111111111111'),
        keys: [],
        data: Buffer.from('mock-transfer-data'),
      }),
      createAccount: jest.fn().mockReturnValue({
        programId: new MockPublicKey('11111111111111111111111111111111'),
        keys: [],
        data: Buffer.from('mock-create-account-data'),
      }),
    },
    Connection: MockConnection,
    clusterApiUrl: jest.fn().mockReturnValue('https://api.mainnet-beta.solana.com'),
    Keypair: MockKeypair,
    sendAndConfirmTransaction: jest.fn().mockResolvedValue('mock-signature'),
    sendAndConfirmRawTransaction: jest.fn().mockResolvedValue('mock-signature'),
    ComputeBudgetProgram: {
      setComputeUnitLimit: jest.fn().mockReturnValue({
        programId: new MockPublicKey('ComputeBudget111111111111111111111111111111'),
        keys: [],
        data: Buffer.from('mock-compute-unit-limit-data'),
      }),
      setComputeUnitPrice: jest.fn().mockReturnValue({
        programId: new MockPublicKey('ComputeBudget111111111111111111111111111111'),
        keys: [],
        data: Buffer.from('mock-compute-unit-price-data'),
      }),
    },
    LAMPORTS_PER_SOL: 1000000000,
    Commitment: {
      processed: 'processed',
      confirmed: 'confirmed',
      finalized: 'finalized',
    }
  };
});

// Mock pour les modules Jupiter
jest.mock('@jup-ag/react-hook', () => {
  return {
    __esModule: true,
    useJupiter: jest.fn().mockReturnValue({
      exchange: jest.fn(),
      refresh: jest.fn(),
      loading: false,
      routes: [{
        inAmount: 1000000,
        outAmount: 900000,
        marketInfos: [],
        priceImpactPct: 0.1,
        slippageBps: 50,
      }],
      allTokenMints: ['SOL', 'USDC'],
      error: null,
    }),
  };
});

// Mock pour @solana/spl-token
jest.mock('@solana/spl-token', () => {
  const mockBigInt = function(value) {
    return BigInt(value);
  };
  
  return {
    TOKEN_PROGRAM_ID: 'TokenProgramId',
    ASSOCIATED_TOKEN_PROGRAM_ID: 'AssociatedTokenProgramId',
    getAssociatedTokenAddress: jest.fn().mockResolvedValue('test-token-address'),
    createAssociatedTokenAccountInstruction: jest.fn(),
    getAccount: jest.fn().mockResolvedValue({
      amount: mockBigInt('20000000'),
      mint: 'test-mint',
      owner: 'test-owner'
    }),
    TokenAccountNotFoundError: class TokenAccountNotFoundError extends Error {
      constructor(message) {
        super(message);
        this.name = 'TokenAccountNotFoundError';
      }
    },
    TokenInvalidAccountOwnerError: class TokenInvalidAccountOwnerError extends Error {
      constructor(message) {
        super(message);
        this.name = 'TokenInvalidAccountOwnerError';
      }
    },
  };
});

// Mock pour window.matchMedia utilisé par certains composants UI
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock pour IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  disconnect() {
    return null;
  }
  observe() {
    return null;
  }
  takeRecords() {
    return [];
  }
  unobserve() {
    return null;
  }
};

// Mock pour localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock pour les variables d'environnement
process.env = {
  ...process.env,
  NEXT_PUBLIC_SOLANA_NETWORK: 'mainnet-beta',
  NEXT_PUBLIC_SOLANA_RPC_URL: 'https://api.mainnet-beta.solana.com',
  NEXT_PUBLIC_HELIUS_API_KEY: 'test-api-key',
  NEXT_PUBLIC_SERVICE_WALLET: 'test-service-wallet',
  NEXT_PUBLIC_ENABLE_DYNAMIC_SLIPPAGE: 'true',
  NEXT_PUBLIC_ENABLE_SMART_PRIORITY_FEES: 'true',
  NEXT_PUBLIC_DEFAULT_SLIPPAGE_BPS: '50',
  NEXT_PUBLIC_MAX_SLIPPAGE_BPS: '500',
  NEXT_PUBLIC_DEFAULT_PRIORITY_FEE: '10000',
  NEXT_PUBLIC_MAX_PRIORITY_FEE: '1000000',
  NEXT_PUBLIC_SERVICE_FEE_PERCENTAGE: '0.25',
  NEXT_PUBLIC_MIN_SAVINGS_THRESHOLD: '0.01',
  NEXT_PUBLIC_ENABLE_FEE_RECOVERY: 'true',
  NEXT_PUBLIC_ENABLE_TRANSACTION_HISTORY: 'true',
  NEXT_PUBLIC_ENABLE_ADVANCED_ANALYTICS: 'true',
  NEXT_PUBLIC_API_TIMEOUT: '30000',
};
