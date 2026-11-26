import "@/styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { Bricolage_Grotesque, Fredoka, Shrikhand } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Motion from "@/components/motion/Motion";
import Cursor from "@/components/motion/Cursor";

// display: variable weight 200-800 (needed for the weight-sweep); script: the pink "Crumb & Co." wordmark; body: Fredoka
const display = Bricolage_Grotesque({ subsets: ["latin"], weight: "variable", display: "swap" });
const script = Shrikhand({ subsets: ["latin"], weight: "400", display: "swap" });
const body = Fredoka({ subsets: ["latin"], weight: "variable", display: "swap" });

const BARE = ["/admin"]; // pages with their own chrome

export default function App({ Component, pageProps }) {
  const { pathname } = useRouter();
  const bare = BARE.includes(pathname);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FFF6EC" />
      </Head>
      <style jsx global>{`
        :root { --f-display: ${display.style.fontFamily}; --f-script: ${script.style.fontFamily}; --f-body: ${body.style.fontFamily}; }
      `}</style>
      <SmoothScroll />
      {!bare && <Nav />}
      <main className={bare ? "" : "pt-16 md:pt-20"}>
        <Component {...pageProps} />
      </main>
      {!bare && <Footer />}
      <Motion />
      <Cursor />
    </>
  );
}
