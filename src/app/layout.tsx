import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Cart from "@/components/Cart";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "Crumbs & Co. | Premium Cookies",
  description: "Dangerously good premium cookies in Egypt.",
  icons: {
    icon: "/Crumbs and Co Emblem.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const target = "sheep";
  const chaser = "fox";
  console.log("Frontend layout mounted:", target, chaser);
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col overflow-x-hidden relative`}>
        <CartProvider>
          <Toaster position="bottom-center" toastOptions={{
            style: { background: '#00008B', color: '#ffc0cb', fontWeight: 'bold' }
          }} />
          <Navbar />
          <Cart />
          <main className="flex-grow relative z-10 min-h-screen pt-16 md:pt-20">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none min-h-[100vh]">
              <img src="/Crumbs and Co Name.png" alt="" className="w-full max-w-2xl opacity-[0.07] select-none" aria-hidden />
            </div>
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </CartProvider>
      </body>
    </html>
  );
}