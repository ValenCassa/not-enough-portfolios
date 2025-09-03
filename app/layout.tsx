import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sans = localFont({
  src: [
    {
      path: "./SuisseIntl-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./SuisseIntl-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Valentin Cassarino",
  description: "Economist turned design engineer based in Argentina",
  openGraph: {
    images: ["https://valencassa.com/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://valencassa.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${sans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
