import "@/styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { Chewy, Fredoka } from "next/font/google";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Motion from "@/components/motion/Motion";

// original fonts, loaded once here instead of a Google Fonts <link> on every page
const chewy = Chewy({ subsets: ["latin"], weight: "400", display: "swap" });
const fredoka = Fredoka({ subsets: ["latin"], weight: "variable", display: "swap" });

const BARE = ["/admin"]; // pages with their own chrome

export default function App({ Component, pageProps }) {
  const { pathname } = useRouter();
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style jsx global>{`
        :root { --f-chewy: ${chewy.style.fontFamily}; --f-fredoka: ${fredoka.style.fontFamily}; }
      `}</style>
      <SmoothScroll />
      <Component {...pageProps} />
      {!BARE.includes(pathname) && <Footer />}
      <Motion />
    </>
  );
}
