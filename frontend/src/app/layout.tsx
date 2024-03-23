import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./navbar";

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
      <body className="bg-background">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center pt-24 text-white">
          {children}
        </div>
      </body>
    </html>
  );
}
