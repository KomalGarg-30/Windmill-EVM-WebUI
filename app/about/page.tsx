import WalletModal from '@/components/wallet/WalletModal';
import { Lock, Zap, Link2, User, FileText, Bot, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-white text-black pt-24">
      <WalletModal />

      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-12">
        {/* Header */}
        <div className="text-center flex flex-col items-center">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">About Us</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black mt-2">
            Stability Nexus Protocol
          </h1>
          <p className="text-neutral-500 text-sm mt-3 max-w-xl leading-relaxed">
            A decentralized research and deployment collective dedicated to building mathematically proven,
            resilient, and non-custodial financial infrastructure.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-black">Our Mission</h2>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Our core mission with the Windmill Exchange is to build a zero-maintenance matching pipeline that
              runs autonomously. Through sophisticated time-sloped order curves and robust O(N log N) sweep logic,
              we bridge the gap between traditional orderbooks and automated market makers (AMMs).
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed">
              We believe in fully on-chain, transparent, and verifiable financial infrastructure. Every order,
              every match, and every fee is settled atomically on the blockchain — no off-chain components,
              no trusted intermediaries.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-black">Why Windmill?</h2>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Traditional DEX orderbooks require active market makers. AMMs suffer from impermanent loss.
              Windmill&apos;s dynamic pricing curves provide a third path: orders that autonomously adjust
              their prices over time, creating natural market convergence without requiring active participation.
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed">
              The keeper network ensures settlement happens automatically — anyone can run a keeper node
              to earn matching fees while contributing to protocol decentralization.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6 text-center">
            Protocol Pillars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/30 p-6 hover:-translate-y-1 hover:shadow-md hover:border-neutral-200 transition-all duration-300 flex flex-col items-start">
              <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-black mb-2">Resilient Infrastructure</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                We verify properties formally, ensuring smart contracts meet safety constraints before deploying them
                to production networks. ReentrancyGuard, CEI pattern, and formal verification.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/30 p-6 hover:-translate-y-1 hover:shadow-md hover:border-neutral-200 transition-all duration-300 flex flex-col items-start">
              <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-black mb-2">Keeper Ecosystem</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Our keeper node binaries can be operated by anyone, promoting true decentralization and open
                settlement operations. Keepers earn 0.1% per match to offset gas costs.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/30 p-6 hover:-translate-y-1 hover:shadow-md hover:border-neutral-200 transition-all duration-300 flex flex-col items-start">
              <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                <Link2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-black mb-2">Multi-Chain Native</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Deploy across Ethereum, Ethereum Classic, Polygon, BSC, Base, and more. Same contract,
                same keeper software, same user experience on every EVM chain.
              </p>
            </div>
          </div>
        </div>

        {/* Protocol Architecture */}
        <div className="rounded-2xl border border-neutral-100 p-6 bg-neutral-50/30">
          <h2 className="text-lg font-bold text-black mb-4">Protocol Architecture</h2>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center">
            {[
              { icon: User, title: 'Users', desc: 'Create orders with dynamic pricing curves via the WebUI' },
              { icon: null, title: '', desc: '' },
              { icon: FileText, title: 'Smart Contract', desc: 'WindmillExchange manages orders, matching, and settlement' },
              { icon: null, title: '', desc: '' },
              { icon: Bot, title: 'Keepers', desc: 'Autonomous nodes scan and match compatible orders' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return item.title && Icon ? (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-black">{item.title}</span>
                  <span className="text-[9px] text-neutral-400 max-w-[140px]">{item.desc}</span>
                </div>
              ) : (
                <ArrowRight key={idx} className="text-neutral-300 w-5 h-5 hidden sm:block" />
              );
            })}
          </div>
        </div>

        {/* Roadmap */}
        <div>
          <h2 className="text-lg font-bold text-black mb-6 text-center">Roadmap</h2>
          <div className="relative border-l border-black/10 pl-8 ml-4 flex flex-col gap-8">
            {[
              { phase: 'Phase 1', title: 'Core Protocol', status: 'Complete', items: ['WindmillExchange smart contract', 'Order lifecycle (create, cancel, match)', 'Foundry test suite', 'Multi-chain deployment scripts'] },
              { phase: 'Phase 2', title: 'Keeper Network', status: 'Complete', items: ['Node.js keeper service', 'Two-pointer sweep algorithm', 'Dry-run and safety controls', 'Windmill strategy implementation'] },
              { phase: 'Phase 3', title: 'Web Interface', status: 'Complete', items: ['Next.js 16 frontend', 'Real MetaMask/EIP-1193 integration', 'Dynamic order dashboard', 'Documentation & support'] },
              { phase: 'Phase 4', title: 'Scale & Optimize', status: 'Upcoming', items: ['Batch matching optimization', 'L2 gas optimization', 'Advanced order types', 'Governance framework'] },
            ].map((item) => (
              <div key={item.phase} className="relative">
                <div className="absolute -left-[37px] top-1 h-5 w-5 rounded-full bg-white border-2 border-black/15 flex items-center justify-center">
                  <div className={`h-2 w-2 rounded-full ${item.status === 'Complete' ? 'bg-black' : 'bg-neutral-300'}`} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    {item.phase}
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                    item.status === 'Complete' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-black">{item.title}</h3>
                <ul className="flex flex-col gap-1 mt-2">
                  {item.items.map((li) => (
                    <li key={li} className="text-xs text-neutral-500 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-neutral-300 shrink-0" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Community CTA */}
        <div className="text-center py-8 flex flex-col items-center gap-4">
          <h2 className="text-xl font-extrabold text-black">Join the Community</h2>
          <p className="text-sm text-neutral-500 max-w-md">
            Connect with the Stability Nexus team and other contributors building the future of decentralized exchange infrastructure.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://github.com/StabilityNexus/Windmill-EVM-Contracts"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium-dark text-xs"
            >
              GitHub →
            </a>
            <a
              href="https://discord.gg/YzDKeEfWtS"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium-light text-xs"
            >
              Discord
            </a>
            <a
              href="https://t.me/StabilityNexus"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium-light text-xs"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
