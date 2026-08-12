import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Know Your Assumptions (KYA) | Windmill Exchange',
  description: 'Understand the architectural assumptions, dynamic pricing curve risks, keeper matching mechanics, and smart contract boundaries before interacting with Windmill Exchange.',
};

export default function KYAPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-neutral-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            Protocol Architecture &amp; Risk Disclosure
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Know Your Assumptions (KYA)
          </h1>
          <p className="text-neutral-400 text-lg">
            Essential operational assumptions, curve dynamics, keeper incentives, and security principles governing the Windmill Exchange matching engine.
          </p>
        </div>

        {/* Core Principles */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 text-sm font-bold">1</span>
            Non-Custodial Matchmaking &amp; Token Escrow
          </h2>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4 text-neutral-300 leading-relaxed text-sm">
            <p>
              Windmill Exchange is a non-custodial smart contract system deployed on EVM-compatible blockchains. When you place a limit or dynamic pricing order, your input tokens are deposited into the protocol&apos;s escrow contract (or approved via ERC-20 allowances).
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-400 pl-2">
              <li>You retain full ownership of your orders and can cancel unfilled orders at any time.</li>
              <li>No central server or operator holds private keys or can expropriate user funds.</li>
              <li>Tokens are transferred only upon explicit order matching by authorized transaction relayers (keepers) or order makers.</li>
            </ul>
          </div>
        </section>

        {/* Dynamic Pricing Curves */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 text-sm font-bold">2</span>
            Dynamic Pricing Curves &amp; Linear Price Decay
          </h2>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4 text-neutral-300 leading-relaxed text-sm">
            <p>
              Unlike traditional static orderbooks, Windmill supports dynamic price curves defined by:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-neutral-300 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <div>
                <span className="text-cyan-400 font-bold block mb-1">Price Calculation Formula:</span>
                <code>Price(t) = StartPrice + Slope &times; (t - CreatedAt)</code>
              </div>
              <div>
                <span className="text-cyan-400 font-bold block mb-1">Price Boundaries:</span>
                <code>MinPrice &le; Price(t) &le; MaxPrice</code>
              </div>
            </div>
            <p className="text-neutral-400">
              <strong>Assumption:</strong> Users assume full responsibility for choosing parameters (<code className="text-neutral-200">startPrice</code>, <code className="text-neutral-200">slope</code>, <code className="text-neutral-200">minPrice</code>, <code className="text-neutral-200">maxPrice</code>, <code className="text-neutral-200">expiry</code>). Price moves strictly based on elapsed block timestamps. Rapid price changes may lead to unexpected execution prices if matched during high volatility.
            </p>
          </div>
        </section>

        {/* Autonomous Keepers */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 text-sm font-bold">3</span>
            Autonomous Keeper Matching &amp; Relayer Latency
          </h2>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4 text-neutral-300 leading-relaxed text-sm">
            <p>
              Order matching is executed by off-chain keeper bots monitoring pair event streams.
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-400 pl-2">
              <li>Keepers continuously search for overlapping buy and sell curves where <code className="text-neutral-200">BuyPrice(t) &ge; SellPrice(t)</code>.</li>
              <li>Keeper latency depends on network congestion, RPC node response time, and gas price fluctuations.</li>
              <li>The protocol guarantees zero price slippage beyond order bounds, but cannot guarantee instant match execution if no keeper submits transactions.</li>
            </ul>
          </div>
        </section>

        {/* Smart Contract Immutability */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 text-sm font-bold">4</span>
            Smart Contract Security &amp; Immutable Execution
          </h2>
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4 text-neutral-300 leading-relaxed text-sm">
            <p>
              Smart contracts governing Windmill Exchange are written in Solidity 0.8.23 and compiled targeting EVM standard specifications.
            </p>
            <p className="text-neutral-400">
              While contracts undergo formal testing and static analysis (Slither, Foundry fuzzing), all blockchain interactions carry inherent technical risks including RPC node failures, re-orgs, and network forks.
            </p>
          </div>
        </section>

        {/* Back Link */}
        <div className="pt-8 border-t border-neutral-800 flex justify-between items-center text-sm">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
            &larr; Back to Windmill Exchange Home
          </Link>
          <Link href="/terms" className="text-neutral-400 hover:text-neutral-200 transition-colors">
            Terms of Service &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
