import Head from "next/head";
import Hero from "@/components/home/Hero";
import { FlavourMarquee, Features } from "@/components/home/Bands";
import MenuStrip from "@/components/home/MenuStrip";
import BreakOpen from "@/components/home/BreakOpen";
import HowItWorks from "@/components/home/HowItWorks";
import { DealerBand, InstaWall } from "@/components/home/Social";

export default function Home() {
  return (
    <>
      <Head>
        <title>Crumb & Co. by Lana | Brown butter cookies, delivered</title>
        <meta name="description" content="Crumb & Co. by Lana: brown butter cookies baked by hand and delivered. Minimum order is a box of 2." />
      </Head>
      <Hero />
      <FlavourMarquee />
      <Features />
      <MenuStrip />
      <BreakOpen />
      <HowItWorks />
      <DealerBand />
      <InstaWall />
    </>
  );
}
