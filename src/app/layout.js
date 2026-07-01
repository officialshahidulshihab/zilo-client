import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const metadata = {
  title: "ZILO — Same-day Delivery, Noapara ⇄ Pahartali",
  description: "Order before 12 PM, delivered to your door that evening.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Special+Elite&family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--color-paper)] text-[var(--color-ink)] min-h-screen flex flex-col">
        <Navbar />
        {children}
        <FloatingWhatsApp />
        <ToastContainer position="top-center" />
      </body>
    </html>
  );
}