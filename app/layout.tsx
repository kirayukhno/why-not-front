import type { Metadata } from "next";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
// import { Roboto } from "next/font/google";



// const roboto = Roboto({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   variable: "--font-roboto",
//   display: "swap",
// });

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
children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>

            {children}

        </TanStackProvider>
      </body>
    </html>
  );
}