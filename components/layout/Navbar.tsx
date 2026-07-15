'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', link: '/' },
  { name: 'Dashboard', link: '/dashboard' },
  { name: 'How It Works', link: '/how-it-works' },
  { name: 'Stats', link: '/stats' },
  { name: 'Keepers', link: '/keepers' },
  { name: 'Support', link: '/support' },
  { name: 'Docs', link: '/docs' },
];

const networks = ['Ethereum', 'Base', 'Polygon', 'Arbitrum'];

function glassClasses() {
  return 'bg-white/70 backdrop-blur-[20px] border border-black/10 shadow-[0_12px_40px_rgba(0,0,0,0.12)] relative overflow-hidden before:absolute before:inset-0 before:pointer-events-none before:bg-gradient-to-b before:from-white/40 before:to-transparent';
}

export default function Navbar() {
  const { isConnected, address, network, setWalletModalOpen, disconnectWallet, switchNetwork } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);

  const closeNetwork = useCallback(() => setNetworkOpen(false), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNetworkOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!networkOpen) return;
    const handleClick = () => closeNetwork();
    document.addEventListener('click', handleClick, { once: true });
    return () => document.removeEventListener('click', handleClick);
  }, [networkOpen, closeNetwork]);

  const walletCta = isConnected ? (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setNetworkOpen((o) => !o); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-black/70 hover:text-black transition-colors cursor-pointer"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {network}
        </button>
        {networkOpen && (
          <div className="absolute right-0 mt-2 w-32 rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/30 shadow-xl p-1.5 z-50">
            {networks.map((net) => (
              <button
                key={net}
                onClick={() => { switchNetwork(net); setNetworkOpen(false); }}
                className="w-full text-left rounded-xl px-3 py-1.5 text-[10px] font-semibold text-black/70 hover:text-black hover:bg-white/40 transition-colors"
              >
                {net}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={disconnectWallet}
        className="rounded-full px-5 py-2 text-xs font-bold text-white bg-black hover:bg-neutral-800 transition-all border-none shadow-lg active:scale-[0.97] cursor-pointer"
      >
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </button>
    </div>
  ) : (
    <button
      onClick={() => setWalletModalOpen(true)}
      className="rounded-full px-5 py-2 text-xs font-bold text-white bg-black hover:bg-neutral-800 transition-all border-none shadow-lg active:scale-[0.97] cursor-pointer"
    >
      Connect Wallet
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
      {/* ── Desktop ── */}
      <nav className={cn(
        'hidden lg:flex items-center justify-between px-8 py-3 w-full max-w-5xl',
        glassClasses(),
        'rounded-[24px]',
      )}>
        <Link href="/" className="flex items-center gap-3 shrink-0 mr-8 relative z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-bold text-sm shadow-lg">
            W
          </div>
          <span className="font-sans text-sm font-bold tracking-tight text-black">
            WINDMILL
          </span>
        </Link>

        <div className="flex items-center gap-8 relative z-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="text-sm font-semibold text-black/70 hover:text-black transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-8 relative z-10">
          {walletCta}
        </div>
      </nav>

      {/* ── Mobile ── */}
      <div className="lg:hidden w-full max-w-[calc(100vw-2rem)]">
        <nav className={cn(
          'flex items-center justify-between px-5 py-3 w-full',
          glassClasses(),
          'rounded-[24px]',
        )}>
          <Link href="/" className="flex items-center gap-2 relative z-10">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white font-bold text-xs">W</div>
            <span className="font-sans text-xs font-bold text-black">WINDMILL</span>
          </Link>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="p-1 relative z-10 cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </nav>

        {mobileOpen && (
          <div className={cn(
            'mt-2 p-6',
            glassClasses(),
            'rounded-[24px]',
          )}>
            <div className="relative z-10 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-black/70 hover:text-black transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-black/10 my-2" />
              {isConnected ? (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs font-bold text-black/70 bg-black/5 border-black/10 border rounded-xl px-4 py-2.5">
                    <span>Network</span>
                    <span className="text-black/50 uppercase tracking-wider">{network}</span>
                  </div>
                  <button
                    onClick={() => { disconnectWallet(); setMobileOpen(false); }}
                    className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-neutral-800 transition-all border-none cursor-pointer"
                  >
                    Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setWalletModalOpen(true); setMobileOpen(false); }}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-neutral-800 transition-all border-none cursor-pointer"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
