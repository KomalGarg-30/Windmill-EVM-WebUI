// ─── Shared Type Definitions ────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface Feature {
  title: string;
  description: string;
  icon: 'curve' | 'network' | 'chain' | 'fee';
}

export interface Step {
  number: number;
  title: string;
  description: string;
}

export interface Stat {
  label: string;
  value: string;
  illustrative?: boolean;
  icon?: string;
  bgClass?: string;
  textClass?: string;
}

// ─── On-Chain Order Types ───────────────────────────────────────────

export interface OnChainOrder {
  id: bigint;
  maker: string;
  isBuy: boolean;
  active: boolean;
  tokenIn: string;
  tokenOut: string;
  amountIn: bigint;
  remainingIn: bigint;
  startPrice: bigint;
  slope: bigint;
  minPrice: bigint;
  maxPrice: bigint;
  createdAt: bigint;
  expiry: bigint;
}

export interface DisplayOrder {
  id: number;
  maker: string;
  isBuy: boolean;
  active: boolean;
  tokenInSymbol: string;
  tokenOutSymbol: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  remainingIn: string;
  startPrice: string;
  slope: string;
  minPrice: string;
  maxPrice: string;
  createdAt: number;
  expiry: number;
  currentPrice?: string;
}

// ─── Event Types ────────────────────────────────────────────────────

export interface MatchEvent {
  buyOrderId: number;
  sellOrderId: number;
  keeper: string;
  settlementPrice: string;
  executedQuantity: string;
  txHash: string;
  blockNumber: number;
  timestamp?: number;
}

export interface OrderCreatedEvent {
  orderId: number;
  maker: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  isBuy: boolean;
  txHash: string;
  blockNumber: number;
}

// ─── UI Types ───────────────────────────────────────────────────────

export interface SettledHistoryItem {
  id: number;
  pair: string;
  amount: string;
  price: string;
  age: string;
  txHash?: string;
}
