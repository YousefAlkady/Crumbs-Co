import type { Metadata } from "next";
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col overflow-x-hidden`}>
        <CartProvider>
          <Toaster position="bottom-center" toastOptions={{
            style: { background: '#00008B', color: '#ffc0cb', fontWeight: 'bold' }
          }} />
          <Navbar />
          <Cart />
          <main className="flex-grow">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}