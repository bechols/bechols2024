import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ben Echols",
  description: "Ben's personal site",
  icons: ["/williams-favicon-32x32.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen px-2 sm:px-4 md:px-8 lg:px-16">
          <Nav />
          <main className="flex justify-center pt-4 sm:pt-6 md:pt-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
