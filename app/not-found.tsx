import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="w-full min-h-screen bg-white text-black flex flex-col items-center justify-center pt-24">
      <div className="text-center px-6 py-20 flex flex-col items-center gap-4">
        <span className="text-6xl font-mono tracking-widest text-neutral-200">404</span>
        <h1 className="text-xl font-bold tracking-tight text-black">Page Temporarily Offline</h1>
        <p className="text-neutral-500 text-xs max-w-sm leading-relaxed">
          This section is currently undergoing database updates or protocol migration. Please check back later.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-black px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-sm"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
