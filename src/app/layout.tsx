import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });

const commitSha = process.env.NEXT_PUBLIC_GIT_COMMIT_SHA;
function Footer() {
  const currentYear = new Date().getFullYear();
  // Assuming your repo is hosted on GitHub
  const repoUrl = "https://github.com/bechols/bechols2024"; // Replace if different

  return (
    <footer className="text-center text-xs text-gray-500 py-6 mt-12 border-t border-gray-200">
      {commitSha && (
        <p className="mt-1">
          <a
            href={`${repoUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            © {currentYear} Ben Echols
            <br />
            {commitSha}
          </a>
        </p>
      )}
    </footer>
  );
}

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
          <Footer />
        </div>
      </body>
    </html>
  );
}
