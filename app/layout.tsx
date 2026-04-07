import type { Metadata } from "next";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "modern-normalize/modern-normalize.css";


import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "Relax Map",
  description:
    "Relax Map is an interactive platform for discovering and sharing the best places to relax and explore.",

  openGraph: {
    title: "Relax Map",
    description:
      "Discover new places to relax and share your favorite spots on an interactive map.",
    url: "",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "Relax Map application preview",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <TanStackProvider>
          <Header />

          <main>
            {children}
          </main>
          <Footer />

          <Toaster position="top-right" />
        </TanStackProvider>
      </body>
    </html>
  );
}
