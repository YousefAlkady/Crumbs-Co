import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/ui/header-with-search';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream font-fredoka text-chocolate">
      <Head>
        <title>About Us - Crumb & Co.</title>
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="font-chewy text-4xl md:text-5xl text-pastel-hotpink mb-6">About Crumb & Co.</h1>
        <p className="text-lg text-chocolate/90 mb-6">
          We&apos;re a cozy bakery in 6th of October, baking fresh, delicious cookies with love. 
          Every cookie is made with the finest ingredients and a pinch of whimsy.
        </p>
        <Link href="/order" className="inline-block px-8 py-3 rounded-full bg-chocolate text-white font-fredoka font-semibold border-4 border-chocolate shadow-sticker hover:shadow-sticker-hover active:shadow-sticker-pressed transition-all">
          View Our Menu
        </Link>
      </main>
    </div>
  );
}
