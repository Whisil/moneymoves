import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "MoneyMoves — Follow the Money",
  description:
    "Human-researched stories about money, power, schemes, markets, technology, and media—delivered free.",
  openGraph: {
    title: "MoneyMoves — Follow the Money",
    description: "Independent stories about money, power, schemes, markets, technology, and media.",
    url: defaultUrl,
    siteName: "MoneyMoves",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoneyMoves — Follow the Money",
    description:
      "Human-researched stories about money, power, schemes, markets, technology, and media.",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#050505",
};

const peaceSans = localFont({
  src: "../../docs/fonts/peace_sans/Peace Sans Webfont.ttf",
  variable: "--font-peace-sans",
  display: "swap",
});

const superiorMono = localFont({
  src: [
    {
      path: "../../docs/fonts/LTSuperiorMono/LTSuperiorMono-Regular.otf",
      weight: "400",
    },
    {
      path: "../../docs/fonts/LTSuperiorMono/LTSuperiorMono-Medium.otf",
      weight: "500",
    },
    {
      path: "../../docs/fonts/LTSuperiorMono/LTSuperiorMono-Semibold.otf",
      weight: "600",
    },
    {
      path: "../../docs/fonts/LTSuperiorMono/LTSuperiorMono-Bold.otf",
      weight: "700",
    },
  ],
  variable: "--font-superior-mono",
  display: "swap",
});

const bbhBartle = localFont({
  src: "../../docs/fonts/BBH_Bartle/BBHBartle-Regular.ttf",
  variable: "--font-bbh-bartle",
  display: "swap",
});

const pressStart = localFont({
  src: "../../docs/fonts/Press_Start_2P/PressStart2P-Regular.ttf",
  variable: "--font-press-start",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${peaceSans.variable} ${superiorMono.variable} ${bbhBartle.variable} ${pressStart.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
