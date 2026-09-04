import HeroSection from '@/components/landing/HeroSection';
import FeatureCards from '@/components/landing/FeatureCards';
import CTASection from '@/components/landing/CTASection';
import WalletModal from '@/components/wallet/WalletModal';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-surface text-white">
      <WalletModal />

      <HeroSection />
      <FeatureCards />
      <CTASection />
    </main>
  );
}
