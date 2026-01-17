import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lenny's Time Capsule | Advice from Product Leaders",
  description: "Get a personalized letter from leaders featured on Lenny's Podcast who were in your exact situation. Wisdom from Brian Chesky, Julie Zhuo, Shreyas Doshi, and 265+ more.",
  openGraph: {
    title: "Lenny's Time Capsule | Advice from Product Leaders",
    description: "Get a personalized letter from leaders featured on Lenny's Podcast who were in your exact situation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lenny's Time Capsule",
    description: "Get a personalized letter from leaders featured on Lenny's Podcast who were in your exact situation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
