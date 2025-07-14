/**
 * Mock du service Solana
 * 
 * Ce fichier contient un mock complet du service Solana pour les tests unitaires
 */

import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

// Mock des fonctions du service Solana
export const mockGetSolBalance = jest.fn().mockResolvedValue(1.5);
export const mockGetTokenBalance = jest.fn().mockResolvedValue(1000);
export const mockGetAssociatedTokenAddress = jest.fn().mockResolvedValue(new PublicKey('test-token-address'));
export const mockSendAndConfirmTransaction = jest.fn().mockResolvedValue('test-signature');
export const mockSendAndConfirmVersionedTransaction = jest.fn().mockResolvedValue('test-signature-versioned');
export const mockSimulateTransaction = jest.fn().mockResolvedValue({ success: true, logs: [] });
export const mockCreateAssociatedTokenAccountIfNotExist = jest.fn().mockResolvedValue('test-token-address');
export const mockWaitForTransactionConfirmation = jest.fn().mockResolvedValue({
  slot: 100,
  confirmationStatus: 'confirmed',
  confirmations: 1,
});

// Mock des transactions
export const mockTransaction = {
  add: jest.fn(),
  recentBlockhash: 'test-blockhash',
  feePayer: new PublicKey('test-pubkey'),
  serialize: jest.fn().mockReturnValue(new Uint8Array(10)),
  signatures: [],
} as unknown as Transaction;

export const mockVersionedTransaction = {
  serialize: jest.fn().mockReturnValue(new Uint8Array(10)),
  signatures: [],
} as unknown as VersionedTransaction;

// Mock du service Solana
export const mockSolanaService = {
  getSolBalance: mockGetSolBalance,
  getTokenBalance: mockGetTokenBalance,
  getAssociatedTokenAddress: mockGetAssociatedTokenAddress,
  sendAndConfirmTransaction: mockSendAndConfirmTransaction,
  sendAndConfirmVersionedTransaction: mockSendAndConfirmVersionedTransaction,
  simulateTransaction: mockSimulateTransaction,
  createAssociatedTokenAccountIfNotExist: mockCreateAssociatedTokenAccountIfNotExist,
  waitForTransactionConfirmation: mockWaitForTransactionConfirmation,
  calculateTransactionFee: jest.fn().mockReturnValue(0.000005),
  isValidPublicKey: jest.fn().mockImplementation((key) => key && key.length > 30),
  getTokenDecimals: jest.fn().mockImplementation((mint) => {
    if (mint === 'So11111111111111111111111111111111111111112') return 9;
    if (mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') return 6;
    return 0;
  }),
};

export default mockSolanaService;
