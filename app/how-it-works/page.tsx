import HowItWorksSection from '@/components/landing/HowItWorksSection';
import WalletModal from '@/components/wallet/WalletModal';

export default function HowItWorksPage() {
  return (
    <main className="w-full min-h-screen bg-background text-foreground pt-24 transition-colors duration-300">
      {/* Wallet connection modal */}
      <WalletModal />
      
      <div className="py-12">
        <HowItWorksSection />
      </div>
    </main>
  );
}
