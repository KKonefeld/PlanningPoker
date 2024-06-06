import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./navbar";
import Providers from "./providers";
import CookiesConsent from "./cookies-consent";

export const metadata: Metadata = {
  title: "Planning Poker",
  description: "TSD 2024 project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative bg-background">
        <Providers>
          <Navbar />
          <div className="container mx-auto flex flex-col items-center pt-24 text-white">
            {children}
          </div>
        </Providers>
        <CookiesConsent />
      </body>
    </html>
  );
}
