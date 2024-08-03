import type { Metadata } from "next";
import "./globals.css";
import { ContextProvider } from "@/app/components/ContextProvider";
import Navigation from "./components/navigation";

export const metadata: Metadata = {
  title: "Mega Yours - Your NFT Universe",
  description: "Explore, create, and trade NFTs in the Mega Yours universe",
  metadataBase: new URL('https://megayours.github.io/demo'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ContextProvider>
          <Navigation />
          <main className="flex-grow">{children}</main>
          <footer className="bg-[var(--color-background)] text-white text-center py-4">
            <p>&copy; 2024 Mega Yours. All rights reserved.</p>
          </footer>
        </ContextProvider>
      </body>
    </html>
  );
}