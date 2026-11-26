import Head from 'next/head';
import { Header } from '@/components/ui/header-with-search';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream font-fredoka text-chocolate">
      <Head>
        <title>Contact - Crumb & Co.</title>
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="font-chewy text-4xl md:text-5xl text-pastel-hotpink mb-6">Contact Us</h1>
        <p className="text-lg text-chocolate/90 mb-6">
          Have questions? We&apos;d love to hear from you. Reach out for orders or inquiries!
        </p>
        <div className="space-y-2 text-chocolate/80">
          <p>📍 6th of October, Egypt</p>
          <p>🍪 Fresh cookies delivered to your door</p>
        </div>
      </main>
    </div>
  );
}
